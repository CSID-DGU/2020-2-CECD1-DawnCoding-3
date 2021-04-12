package com.dawn.service;

import com.dawn.controller.DeviceController;
import com.dawn.dto.DeviceDTO;
import com.dawn.models.Device;
import com.dawn.models.DeviceCycle;
import com.dawn.models.RedisDeviceEvent;
import com.dawn.models.Status;
import com.dawn.repository.DeviceCycleRepository;
import com.dawn.repository.DeviceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.TestPropertySource;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class DeviceServiceIntegrationTest {

    @Autowired
    public DeviceService deviceService;

    @Autowired
    public DeviceController deviceController;

    @Autowired
    public DeviceRepository deviceRepository;

    @Autowired
    private DeviceCycleRepository deviceCycleRepository;

    @Autowired
    private RedisTemplate redisTemplate;

    @AfterEach
    private void tearDown() {
        deviceRepository.deleteAll();
    }

    @BeforeEach
    public void setUp() {

    }

    public void TEST_ttsExecutor_MEMORIZE_ADVENTED_SEQUENCE() throws Exception {
        Device device1 = new Device("foo$1234$a", "baz", 0, "currentTitle",
                Arrays.asList(new Status(0, "status1", 0), new Status(1, "status2", 1)), true);
        Device device2 = new Device("foo$1234$b", "baz1", 0, "currentTitle",
                Arrays.asList(new Status(2, "status1", 0), new Status(3, "status2", 1)), true);
        List<Device> result = deviceRepository.saveAll(Arrays.asList(device1, device2));
        result.forEach(x -> {
            try {
                deviceController.triggerEventToDevice(
                        new DeviceDTO.Update(x.getDeviceId(), x.getCurrentStatusCode(), x.getCurrValue(), x.isTts()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public List<Object> DATASET_cycling_not_exceeding_threshold() {
        Device DEVICE = new Device(0);
        deviceRepository.save(DEVICE);
        return Arrays.asList(
                new RedisDeviceEvent(DEVICE.getDeviceId() ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(DEVICE.getDeviceId() ,1, System.currentTimeMillis())
        );
    }

    @Test
    public void applyEvent는_새로_형성된_사이클의_정보를_저장한다() {
        List<Object> eventList = DATASET_cycling_not_exceeding_threshold();

        IntStream.range(0, eventList.size())
                .forEach(idx ->
                        deviceService.applyEvent((RedisDeviceEvent) eventList.get(idx), idx));
        List<DeviceCycle> deviceCycle = deviceCycleRepository.findAll();
        assertThat(deviceCycle.size(), is(1));
        DeviceCycle NEW_DEVICE_CYCLE = deviceCycle.get(0);
        assertThat("저장된 사이클", NEW_DEVICE_CYCLE.getSequence(), is("01"));
    }

    @Test
    public void applyEvent는_사이클이_최소_인터벌_초과전에_재등장하면_중복등장카운트를_증가시킨다() {
        List<Object> eventList = DATASET_cycling_not_exceeding_threshold();

        IntStream.range(0, eventList.size())
                .forEach(idx ->
                        deviceService.applyEvent((RedisDeviceEvent) eventList.get(idx), idx));
        List<DeviceCycle> deviceCycle = deviceCycleRepository.findAll();
        DeviceCycle NEW_DEVICE_CYCLE = deviceCycle.get(0);
        assertThat("사이클이 제외된 횟수", NEW_DEVICE_CYCLE.getExcludedAcc(), equalTo(2));
    }

    
}
