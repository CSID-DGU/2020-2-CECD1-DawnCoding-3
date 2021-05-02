package com.dawn.controller;

import com.dawn.dto.DeviceCycleDTO;
import com.dawn.dto.DeviceDTO;
import com.dawn.dto.StatusDTO;
import com.dawn.models.Device;
import com.dawn.models.DeviceCycle;
import com.dawn.models.RedisDeviceEvent;
import com.dawn.models.Status;
import com.dawn.repository.DeviceCycleRepository;
import com.dawn.repository.DeviceRepository;
import com.dawn.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class DeviceController {

    private static final ClassPathResource sapiPath = new ClassPathResource("static/sapi.py");
    private static final Logger logger = LoggerFactory.getLogger(DeviceController.class);

    private final DeviceRepository deviceRepository;
    private final DeviceCycleRepository deviceCycleRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final DeviceService deviceService;

    // 디바이스 상태 변경
    @PutMapping("/tts/statusOrder/{deviceId}")
    public ResponseEntity updateOrder(@PathVariable Long deviceId, @RequestBody StatusDTO.Update orderList) throws IOException {
        deviceRepository.findById(deviceId).ifPresent(theDevice -> {
            List<Status> originalStatus = theDevice.getStatuses();
            for(int i = 0 ; i < orderList.getOrderList().size(); i++){
                int currOrder = orderList.getOrderList().get(i);
                logger.info(String.format("%s : 의 상태를 "));
                originalStatus.get(i).setStatus_order(currOrder);
            }
            deviceRepository.save(theDevice);
        });
        return new ResponseEntity(HttpStatus.OK);
    }

    // 디바이스 삭제
    @DeleteMapping("/tts/devices")
    public ResponseEntity removeAllDevice() {
        deviceRepository.deleteAll();
        return new ResponseEntity(HttpStatus.OK);
    }

    // 디바이스 전체 가져오기
    @GetMapping("/tts/devices")
    public ResponseEntity<List<Device>> getDevices() {
        List<Device> devices = deviceRepository.getAlldevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping("/devices/excluded")
    public ResponseEntity<List<DeviceCycleDTO.GetExcludedDeviceCycle>> getExcludedDevices() {
        List<DeviceCycle> deviceCycles = deviceCycleRepository.findAll();
        List<DeviceCycleDTO.GetExcludedDeviceCycle> result = new LinkedList<>();
        deviceCycles.forEach(dc -> result.add(new DeviceCycleDTO.GetExcludedDeviceCycle(
                dc.getId(), dc.getDevice().getDeviceId(), dc.getDevice().getSignalName(),
                dc.getDevice().getDeviceName(), dc.getSequence(), dc.getThreshold(), dc.getExcludedAcc()
        )));
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     *
     * @param info : device_cycle 테이블의 id, threshold 값
     * @return device_cycle 테이블의 변경된 row 데이터
     */
    @PutMapping("/devices/excluded")
    @Transactional
    public ResponseEntity<DeviceCycleDTO.GetExcludedDeviceCycle> ModifyExcludedDevices(@RequestBody DeviceCycleDTO.ChangeDeviceCycle info) {
        DeviceCycle deviceCycle = deviceCycleRepository.findById(info.getId()).orElseThrow(() -> new RuntimeException("잘못된 정보"));
        deviceCycle.setThreshold(info.getThreshold());
        DeviceCycleDTO.GetExcludedDeviceCycle result = DeviceCycleDTO.GetExcludedDeviceCycle.builder().deviceId(deviceCycle.getId())
                .excludedAcc(deviceCycle.getExcludedAcc())
                .deviceName(deviceCycle.getDevice().getDeviceName())
                .sequence(deviceCycle.getSequence())
                .signalName(deviceCycle.getDevice().getSignalName())
                .threshold(deviceCycle.getThreshold())
                .id(deviceCycle.getId()).build();
        System.out.println(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    // 디바이스 선택시 알림용 tts
    @GetMapping("/tts/device/{deviceName}")
    public ResponseEntity<Object> selectDevice(@PathVariable("deviceName") String deviceName) throws Exception {
        String sapiMessage = deviceName + "가 선택되었습니다";
        runSapi(sapiMessage);
        return new ResponseEntity(HttpStatus.OK);
    }

    // 디바이스 상태 변경 시 상태 변경 tts
    @PutMapping("/tts/device")
    public ResponseEntity<Object> triggerEventToDevice(@RequestBody DeviceDTO.Update device) throws Exception {
        Device deviceInDB = deviceRepository.findById(device.getDeviceId()).get();
        RedisDeviceEvent redisDeviceEvent =
                new RedisDeviceEvent(device.getDeviceId(), device.getCurrentStatusCode(), System.currentTimeMillis());
        long llen = redisTemplate.opsForList().size(DeviceService.EVENT_SEQ_LIST);
        int len = (int) llen;
        redisTemplate.opsForList().rightPush(DeviceService.EVENT_SEQ_LIST, redisDeviceEvent);
        List<Object> list = redisTemplate.opsForList().range(DeviceService.EVENT_SEQ_LIST, 0, -1);
        assert list != null;
        list.forEach(elem -> {
            RedisDeviceEvent currEvent = (RedisDeviceEvent) elem;
            System.out.print(currEvent.getDeviceId() + "-" + currEvent.getStatus() + " ");
        });
        System.out.println();
        deviceService.applyEvent(new RedisDeviceEvent(
                device.getDeviceId(), device.getCurrentStatusCode(), System.currentTimeMillis()),
                len);
        if (deviceInDB.isAnalog()) {
            System.out.println("----------------------------------------");
            System.out.println(deviceInDB.isInDeadband());
            System.out.println(Device.isSafeZone(deviceInDB, device.getCurrValue()));
            System.out.println(device.getCurrValue());
            System.out.println(deviceInDB.getHighCriticalPoint());

            deviceInDB.setCurrValue(device.getCurrValue());
            deviceRepository.save(deviceInDB);

            if (!deviceInDB.isInDeadband() && (!Device.isSafeZone(deviceInDB, device.getCurrValue()))) {
                String ttsMessage = null;
                if (device.getCurrValue() >= deviceInDB.getHighCriticalPoint()) {
                    ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " + device.getCurrValue() + "으로 상한치를 초과하였습니다";
                } else {
                    ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " + device.getCurrValue() + "으로 하한치를 초과하였습니다";
                }
                deviceInDB.setInDeadband(true);
//                runSapi(ttsMessage);

            } else if (deviceInDB.isInDeadband() && Device.isSafeZone(deviceInDB, device.getCurrValue())) {
                String ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " + device.getCurrValue() + "정상치로 복귀했습니다";
                deviceInDB.setInDeadband(false);
//                runSapi(ttsMessage);
            }
        } else {
            try {
                String ttsMessage = deviceInDB.getDeviceName() + "의 상태가 " + deviceInDB.getCurrentStatusTitle() + " 입니다";
                deviceInDB.setCurrentStatusCode(device.getCurrentStatusCode());
                deviceInDB.setCurrentStatusTitle(deviceInDB.getStatuses().get(device.getCurrentStatusCode()).getStatus_name());
                deviceRepository.save(deviceInDB);
//                runSapi(ttsMessage);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("예외가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(deviceInDB, HttpStatus.OK);
    }

    private void runSapi(String message) throws Exception {
        final String sapiRealPath = sapiPath.getURL().getPath().substring(1);
        Runtime rt = Runtime.getRuntime();
        Process pc = null;
        try {
            message = message.replaceAll(" ", ",");
            System.out.println("python " + sapiRealPath + " " + message);
            pc = rt.exec("python " + sapiRealPath + " \"" + message);
            BufferedReader stdin = new BufferedReader(new InputStreamReader(pc.getInputStream()));
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("TTS 예외가 발생했습니다.");
        } finally {
            pc.waitFor();
            pc.destroy();
        }
    }
}
