package com.dawn;

import com.dawn.dto.DeviceDTO;
import com.dawn.models.Device;
import com.dawn.models.UnitType;
import com.dawn.repository.DeviceRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class MainController {

    private final DeviceRepository deviceRepository;
    private static final ClassPathResource sapiPath = new ClassPathResource("static/sapi.py");

    @GetMapping("/init")
    public String initData() throws IOException {
        List<Device> deviceList = new ArrayList<>();
        CSVReader reader = new CSVReader(new FileReader(new ClassPathResource("static/data.csv").getFile())); // 1
        String[] nextLine;
        List<Device> devices = new ArrayList<>();
        String signalName, type, name, status;
        while ((nextLine = reader.readNext()) != null) {
            Map<Integer, String> map = new TreeMap<>();
            if (nextLine.length <= 1) continue;
            type = nextLine[0];
            name = nextLine[1];
            signalName = nextLine[2];
            status = nextLine[3];
            StringBuilder builder = new StringBuilder();
            int key = 0;
            for (int j = 0; j < status.length(); j++) {
                char curr = status.charAt(j);
                if (curr == ':') {
                    key = 0;
                    for (int k = 0; k < builder.length(); k++) {
                        key += (int) Math.pow(10, builder.length() - k - 1) * (builder.charAt(k) - '0');
                    }
                    builder = new StringBuilder();
                    System.out.println(key);
                    continue;
                }
                if ((j != 0 && Character.isDigit(curr)) || (j + 1 == status.length())) {
                    if (j + 1 == status.length()) builder.append(curr);
                    String stringStatus = builder.toString();
                    map.put(key, stringStatus);
                    builder = new StringBuilder();
                }
                builder.append(curr);

            }
            Device device =
                    new Device(signalName, name, 0, "default", map, true,
                            true, 20, 0, 80, 100, UnitType.NONE);
            deviceList.add(device);
        }
        deviceRepository.saveAll(deviceList);
        return "good!";
    }

    @GetMapping("/init2")
    public String initData2() {
        Map<Integer, String> device1Status = new HashMap<>();
        device1Status.put(0, "정상");
        device1Status.put(1, "이상");
        Device device1 = new Device("ABC1234$1", "(128KV) 함선보호", 0, "정상", device1Status, false);

        Map<Integer, String> device5Status = new HashMap<>();
        device5Status.put(0, "정상");
        device5Status.put(1, "이상");
        Device device5 = new Device("ABC1234$2", "(128KV) 함선보호", 0, "정상", device5Status, true);

        Map<Integer, String> device6Status = new HashMap<>();
        device6Status.put(0, "정상");
        device6Status.put(1, "이상");
        Device device7 = new Device("ABC1234$3", "(128KV) 함선보호", 0, "정상", device6Status, true);

        Map<Integer, String> device2Status = new HashMap<>();
        device2Status.put(0, "열림");
        device2Status.put(1, "닫힘");
        device2Status.put(2, "정상");
        device2Status.put(3, "비정상");
        Device device2 = new Device("HRDP3332$AT$1", "3상 전류 LEGENO 통지반", 0, device2Status.get(0), device2Status, false);

        Map<Integer, String> device8Status = new HashMap<>();
        device8Status.put(0, "열림");
        device8Status.put(1, "닫힘");
        device8Status.put(2, "정상");
        device8Status.put(3, "비정상");
        Device device8 = new Device("HRDP3332$AT$2", "3상 전류 LEGENO 통지반", 0, device8Status.get(0), device8Status, true);

        Map<Integer, String> device3Status = new HashMap<>();
        device3Status.put(0, "ON");
        device3Status.put(1, "OFF");
        Device device3 = new Device("PPAP$1", "고장 주파수 발생", 0, device3Status.get(1), device3Status, false);

        Map<Integer, String> device4Status = new HashMap<>();
        device4Status.put(0, "잠김");
        device4Status.put(1, "열림");
        Device device4 = new Device("RD24A$1", "2MTR NARUTO SASUKE", 0, device4Status.get(1), device4Status, true);
        List<Device> devices = Arrays.asList(device1, device2, device3, device4, device5, device7, device8);
        List<Device> adevices = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Device newDevice = Device.ofAnalog("NCK2018$" + (i + 1), "2상 계통 POT BINGSU", 0, 20, 100, 80, UnitType.HUMIDIY, true);
            adevices.add(newDevice);
        }
        for (int i = 0; i < 10; i++) {
            Device newDevice = Device.ofAnalog("UNCPT2018$" + (i + 1), "24K 변전 계통", 0, 20, 100, 80, UnitType.TEMPERATURE, true);
            adevices.add(newDevice);
        }
        for (int i = 0; i < 10; i++) {
            Device newDevice = Device.ofAnalog("TMR1118$" + (i + 1), "128K 영상분 제어", 0, 20, 100, 80, UnitType.TEMPERATURE, true);
            adevices.add(newDevice);
        }
        for (int i = 0; i < 10; i++) {
            Device newDevice = Device.ofAnalog("UNCPT$at$1996$" + (i + 1), "128K 영상분 제어", 0, 20, 100, 80, UnitType.TEMPERATURE, true);
            adevices.add(newDevice);
        }
        for (int i = 0; i < 10; i++) {
            Device newDevice = Device.ofAnalog("ACP$at$AA$" + (i + 1), "UVD CHICKEN", 0, 20, 100, 80, UnitType.HUMIDIY, true);
            adevices.add(newDevice);
        }
        deviceRepository.saveAll(devices);
        deviceRepository.saveAll(adevices);
        return "good!";
    }

    @DeleteMapping("/devices")
    public ResponseEntity removeAllDevice() {
        deviceRepository.deleteAll();
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/devices")
    public ResponseEntity<List<Device>> getDevices() {
        List<Device> devices = deviceRepository.findAll();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping("/device/{deviceName}")
    public ResponseEntity<Object> selectDevice(@PathVariable("deviceName") String deviceName) throws InterruptedException, IOException {
        final String sapiRealPath = sapiPath.getURL().getPath().substring(1);
        Runtime rt = Runtime.getRuntime();
        Process pc = null;

        try {
            System.out.println("python " + sapiRealPath + " \"" + deviceName + "가,선택되었습니다\"");
            pc = rt.exec("python " + sapiRealPath + " \"" + deviceName + "가,선택되었습니다\"");
            BufferedReader stdin = new BufferedReader(new InputStreamReader(pc.getInputStream()));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("예외가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            pc.waitFor();
            pc.destroy();
        }
        return new ResponseEntity(HttpStatus.OK);
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

    @PutMapping("/device")
    public ResponseEntity<Object> triggerEventToDevice(@RequestBody DeviceDTO.Update device) throws Exception {
        Device deviceInDB = deviceRepository.findById(device.getDeviceId()).get();
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
                deviceInDB.setCurrentStatusTitle(deviceInDB.getStatuses().get(device.getCurrentStatusCode()));
                deviceRepository.save(deviceInDB);
//                runSapi(ttsMessage);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("예외가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(deviceInDB, HttpStatus.OK);
    }

//    @PutMapping("/device")
//    public ResponseEntity<Object> triggerEventToDevice(@RequestBody List<DeviceDTO.Update> devices) throws Exception {
//        List<Device> result = new ArrayList<>();
//        int theIndex = 0;
//        for (DeviceDTO.Update device : devices) {
//            theIndex += 1;
//            Device deviceInDB = deviceRepository.findById(device.getDeviceId()).get();
//            if (deviceInDB.isAnalog()) {
//                System.out.println("----------------------------------------");
//                System.out.println(deviceInDB.isInDeadband());
//                System.out.println(Device.isSafeZone(deviceInDB, device.getCurrValue()));
//                System.out.println(device.getCurrValue());
//                System.out.println(deviceInDB.getHighCriticalPoint());
//
//                deviceInDB.setCurrValue(device.getCurrValue());
//                deviceRepository.save(deviceInDB);
//
//                if (!deviceInDB.isInDeadband() && (!Device.isSafeZone(deviceInDB, device.getCurrValue()))) {
//                    String ttsMessage = null;
//                    if(device.getCurrValue() >= deviceInDB.getHighCriticalPoint()) {
//                        ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " +
//                                device.getCurrValue() + "으로 상한치를 초과하였습니다";
//
//                    } else {
//                        ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " +
//                                device.getCurrValue() + "으로 하한치를 초과하였습니다";
//
//                    }
//                    deviceInDB.setInDeadband(true);
//
//                    if (theIndex == 1 || theIndex == devices.size()) { // 처음과 끝에만 TTS 읽음 일단
//                        runSapi(ttsMessage);
//                    }
//                } else {
//                    if (deviceInDB.isInDeadband() && Device.isSafeZone(deviceInDB, device.getCurrValue())) {
//                        String ttsMessage = deviceInDB.getDeviceName() + "의 계측값이 " +
//                                device.getCurrValue() + "정상치로 복귀했습니다";
//                        deviceInDB.setInDeadband(false);
//
//                        if (theIndex == 1 || theIndex == devices.size()) { // 처음과 끝에만 TTS 읽음 일단
//                            runSapi(ttsMessage);
//                        }
//                    } else {
//                        continue;
//                    }
//                }
//            } else {
//                try {
//                    String ttsMessage = deviceInDB.getDeviceName() + "의 상태가 " +
//                            deviceInDB.getCurrentStatusTitle() + " 입니다";
//                    deviceInDB.setCurrentStatusCode(device.getCurrentStatusCode());
//                    deviceInDB.setCurrentStatusTitle(deviceInDB.getStatuses().get(device.getCurrentStatusCode()));
//                    deviceRepository.save(deviceInDB);
//                    result.add(deviceInDB);
//                    if (theIndex == 1 || theIndex == devices.size()) { // 처음과 끝에만 TTS 읽음 일단
//                        runSapi(ttsMessage);
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    return new ResponseEntity<>("예외가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//                }
//            }
//        }
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
}