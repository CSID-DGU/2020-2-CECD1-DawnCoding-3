package com.dawn.controller;

import com.dawn.dto.DeviceDTO;
import com.dawn.dto.StatusDTO;
import com.dawn.models.Device;
import com.dawn.models.RedisDeviceEvent;
import com.dawn.models.Status;
import com.dawn.repository.DeviceRepository;
import com.dawn.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceRepository deviceRepository;
    private static final ClassPathResource sapiPath = new ClassPathResource("static/sapi.py");
    private final RedisTemplate<String, Object> redisTemplate;

    // 디바이스 상태 변경
    @PutMapping("/tts/statusOrder/{deviceId}")
    public ResponseEntity updateOrder(@PathVariable Long deviceId, @RequestBody StatusDTO.Update orderList) throws IOException {
        deviceRepository.findById(deviceId).ifPresent(theDevice -> {
            List<Status> originalStatus = theDevice.getStatuses();
            for(int i = 0 ; i < orderList.getOrderList().size(); i++){
                originalStatus.get(i).setStatus_order(orderList.getOrderList().get(i));
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
        List<Device> devices = deviceRepository.getAllDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
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
        redisTemplate.opsForList().rightPush(DeviceService.EVENT_SEQ_LIST, redisDeviceEvent);
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
