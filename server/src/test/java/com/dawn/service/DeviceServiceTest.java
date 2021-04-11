package com.dawn.service;

import com.dawn.models.Device;
import com.dawn.models.DeviceCycle;
import com.dawn.models.RedisDeviceEvent;
import com.dawn.repository.DeviceCycleRepository;
import com.dawn.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DeviceServiceTest {

    @Mock
    private RedisTemplate<String, Object> mockRedisTemplate = (RedisTemplate<String, Object>)mock(RedisTemplate.class);

    @Mock
    private DeviceRepository deviceRepository;

    @Mock
    private DeviceCycleRepository deviceCycleRepository;

    @Mock
    private ValueOperations valueOperations;

    @Mock
    private ListOperations listOperations;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    /*
        RedisDeviceEvent device1 = new RedisDeviceEvent("foo$1234$a", "baz", 0, "currentTitle",
                Arrays.asList(new Status(0, "status1", 0), new Status(1, "status2", 1)), true);
        RedisDeviceEvent Device device2 = new Device("foo$1234$b", "baz1", 0, "currentTitle",
                Arrays.asList(new Status(2, "status1", 0), new Status(3, "status2", 1)), true);
        */

    @Test
    public void ttsExecutor_MEMORIZE_ADVENTED_SEQUENCE() throws Exception {
        given(mockRedisTemplate.opsForValue()).willReturn(valueOperations);
        given(mockRedisTemplate.opsForList()).willReturn(listOperations);
        given(mockRedisTemplate.opsForValue().get(DeviceService.LAST_INDEX)).willReturn("0");

        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        RedisDeviceEvent device1 = new RedisDeviceEvent(0 ,0, System.currentTimeMillis());
        RedisDeviceEvent device2 = new RedisDeviceEvent(1 ,0, System.currentTimeMillis());
        List<Object> deviceLists = Arrays.asList(device1, device2);
        given(mockRedisTemplate.opsForList().range(DeviceService.EVENT_SEQ_LIST, 0, -1)).willReturn(deviceLists);
        assertEquals(2, deviceService.ttsExecutor());
    }

    @Test
    public void Test_applyEvent_최소시간간격보다_짧은_재발생_시퀀스는_제외된다() {
        given(mockRedisTemplate.opsForValue()).willReturn(valueOperations);
        given(mockRedisTemplate.opsForList()).willReturn(listOperations);
        given(mockRedisTemplate.opsForValue().get(DeviceService.LAST_INDEX)).willReturn("0");
        Device mockDevice = new Device(0);
        given(deviceRepository.findById(0L)).willReturn(Optional.of(mockDevice));
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString()))
                .willReturn(null)
                .willReturn(new DeviceCycle(mockDevice, "0120"));
        when(deviceCycleRepository.save(any())).then(AdditionalAnswers.returnsFirstArg());
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        List<Object> eventList = Arrays.asList(
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,2, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,2, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis())
        );
        given(mockRedisTemplate.opsForList().range(DeviceService.EVENT_SEQ_LIST, 0, -1)).willReturn(eventList);
        deviceService.ttsExecutor();
        IntStream.range(0, eventList.size())
                .forEach(idx -> deviceService.applyEvent((RedisDeviceEvent) eventList.get(idx), idx));
        assertNull(deviceService.eventArray[3]);
        assertNull(deviceService.eventArray[4]);
        assertNull(deviceService.eventArray[5]);
    }

    @Test
    public void Test_applyEvent_최소시간간격보다_짧은_재발생_시퀀스는_제외된다2() {
        given(mockRedisTemplate.opsForValue()).willReturn(valueOperations);
        given(mockRedisTemplate.opsForList()).willReturn(listOperations);
        given(mockRedisTemplate.opsForValue().get(DeviceService.LAST_INDEX)).willReturn("0");
        Device mockDevice = new Device(0);
        given(deviceRepository.findById(0L)).willReturn(Optional.of(mockDevice));
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString()))
                .willReturn(null)
                .willReturn(new DeviceCycle(mockDevice, "0120"));
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        List<Object> eventList = Arrays.asList(
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis())
        );
        given(mockRedisTemplate.opsForList().range(DeviceService.EVENT_SEQ_LIST, 0, -1)).willReturn(eventList);
        deviceService.ttsExecutor();
        IntStream.range(0, eventList.size())
                .forEach(idx -> deviceService.applyEvent((RedisDeviceEvent) eventList.get(idx), idx));
        int[] notNullIndices = {0, 1, 6, 7};
        int[] nullIndices = {2, 3, 4, 5};
        Arrays.stream(notNullIndices).forEach(idx -> assertNotNull(deviceService.eventArray[idx]));
        Arrays.stream(nullIndices).forEach(idx -> assertNull(deviceService.eventArray[idx]));
    }

    @Test
    public void Test_applyEvent_최소시간간격보다_긴_재발생_시퀀스는_제외되지_않는다() {
        given(mockRedisTemplate.opsForValue()).willReturn(valueOperations);
        given(mockRedisTemplate.opsForList()).willReturn(listOperations);
        given(mockRedisTemplate.opsForValue().get(DeviceService.LAST_INDEX)).willReturn("0");
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString())).willReturn(null);
        Device mockDevice = new Device(0);
        given(deviceRepository.findById(0L)).willReturn(Optional.of(mockDevice));
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString()))
                .willReturn(null)
                .willReturn(new DeviceCycle(mockDevice, "0120"));
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        List<Object> eventList = Arrays.asList(
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,2, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,2, System.currentTimeMillis()),
                new RedisDeviceEvent(0 ,0, System.currentTimeMillis() + 1001),
                new RedisDeviceEvent(0 ,1, System.currentTimeMillis())
        );
        given(mockRedisTemplate.opsForList().range(DeviceService.EVENT_SEQ_LIST, 0, -1)).willReturn(eventList);
        deviceService.ttsExecutor();
        IntStream.range(0, eventList.size())
                .forEach(idx -> deviceService.applyEvent((RedisDeviceEvent) eventList.get(idx), idx));
        for (int i = 0; i < deviceService.eventArray.length; i++) {
            assertNotNull(deviceService.eventArray[i]);
        }
    }

    @Test
    public void applyEvent_DETECT_CYCLE_WHEN_CYCLE_CREATED() {
        Device mockDevice = new Device(0);
        given(deviceRepository.findById(0L)).willReturn(Optional.of(mockDevice));
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString()))
                .willReturn(null)
                .willReturn(new DeviceCycle(mockDevice, "0120"));
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        RedisDeviceEvent de1 = new RedisDeviceEvent(0, 0, System.currentTimeMillis());
        RedisDeviceEvent de2 = new RedisDeviceEvent(0, 1, System.currentTimeMillis());
        RedisDeviceEvent de3 = new RedisDeviceEvent(0, 2, System.currentTimeMillis());
        RedisDeviceEvent de4 = new RedisDeviceEvent(0, 0, System.currentTimeMillis());
        List<RedisDeviceEvent> events =  Arrays.asList(de1, de2, de3, de4);
        IntStream.range(0, events.size() - 1)
                .forEach(idx -> assertFalse(deviceService.applyEvent(events.get(idx), idx)));
        assertTrue(deviceService.applyEvent(events.get(events.size() - 1), events.size() - 1));
    }

    @Test
    public void applyEvent_NOT_DETECT_CYCLE_WHEN_CYCLE_NOT_CREATED() {
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        RedisDeviceEvent de1 = new RedisDeviceEvent(0, 0, System.currentTimeMillis());
        RedisDeviceEvent de2 = new RedisDeviceEvent(0, 1, System.currentTimeMillis());
        RedisDeviceEvent de3 = new RedisDeviceEvent(0, 2, System.currentTimeMillis());
        RedisDeviceEvent de4 = new RedisDeviceEvent(0, 3, System.currentTimeMillis());
        List<RedisDeviceEvent> events =  Arrays.asList(de1, de2, de3, de4);
        IntStream.range(0, events.size() - 1)
                .forEach(idx -> assertFalse(deviceService.applyEvent(events.get(idx), idx)));
        assertFalse(deviceService.applyEvent(events.get(events.size() - 1), events.size() - 1));
    }

    @Test
    public void applyEvent_CLEAR_INDEX_MEMORY_WHEN_CYCLE_CREATED() {
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString())).willReturn(null);
        Device mockDevice = new Device(0);
        given(deviceRepository.findById(0L)).willReturn(Optional.of(mockDevice));
        given(deviceCycleRepository.getDeviceCycleBySequence(anyString()))
                .willReturn(null)
                .willReturn(new DeviceCycle(mockDevice, "0120"));
        DeviceService deviceService = new DeviceService(mockRedisTemplate, deviceRepository, deviceCycleRepository);
        RedisDeviceEvent de1 = new RedisDeviceEvent(0, 0, System.currentTimeMillis());
        RedisDeviceEvent de2 = new RedisDeviceEvent(0, 1, System.currentTimeMillis());
        RedisDeviceEvent de3 = new RedisDeviceEvent(0, 2, System.currentTimeMillis());
        RedisDeviceEvent de4 = new RedisDeviceEvent(0, 0, System.currentTimeMillis());
        List<RedisDeviceEvent> events =  Arrays.asList(de1, de2, de3, de4);
        IntStream.range(0, events.size() - 1)
                .forEach(idx -> assertFalse(deviceService.applyEvent(events.get(idx), idx)));
        assertTrue(deviceService.applyEvent(events.get(events.size() - 1), events.size() - 1));
        assertFalse(deviceService.applyEvent(
                new RedisDeviceEvent(0, 1, System.currentTimeMillis()), events.size()));
    }
}
