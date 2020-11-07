package com.dawn;

import com.dawn.dto.DeviceDTO;
import com.dawn.models.Device;
import com.dawn.repository.DeviceRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class MainController {

    private final DeviceRepository deviceRepository;

    @GetMapping("/init")
    public String initData() throws IOException {
        List<Device> deviceList = new ArrayList<>();
        CSVReader reader = new CSVReader(new FileReader(ResourceUtils.getFile("classpath:data.csv"))); // 1
        String[] nextLine;
        List<Device> devices = new ArrayList<>();
        String signalName, type, name, status;
        while ((nextLine = reader.readNext()) != null) {   //
            Map<Integer, String> map = new TreeMap<>();
            if (nextLine.length == 1) continue;
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
            Device device = new Device(signalName, name, 0, "default", map, true);
            deviceList.add(device);
        }
        deviceRepository.saveAll(deviceList);
        return "good!";
    }

    @GetMapping("/init2")
    public String initData2() {
        Map<Integer, String> device1Status = new HashMap<>();
        device1Status.put(0, "정상"); device1Status.put(1, "이상");
        Device device1 = new Device("ABC1234$1", "멋있는 센서", 0, "정상", device1Status, false);

        Map<Integer, String> device5Status = new HashMap<>();
        device5Status.put(0, "정상"); device5Status.put(1, "이상");
        Device device5 = new Device("ABC1234$2", "멋있는 센서", 0, "정상", device5Status, true);

        Map<Integer, String> device6Status = new HashMap<>();
        device6Status.put(0, "정상"); device6Status.put(1, "이상");
        Device device7 = new Device("ABC1234$3", "멋있는 센서", 0, "정상", device6Status, true);

        Map<Integer, String> device2Status = new HashMap<>();
        device2Status.put(0, "열림"); device2Status.put(1, "닫힘");
        device2Status.put(2, "정상"); device2Status.put(3, "비정상");
        Device device2 = new Device("HRDP3332$AT$1", "탐나는 센서", 0, device2Status.get(0), device2Status, false);

        Map<Integer, String> device8Status = new HashMap<>();
        device8Status.put(0, "열림"); device8Status.put(1, "닫힘");
        device8Status.put(2, "정상"); device8Status.put(3, "비정상");
        Device device8 = new Device("HRDP3332$AT$2", "탐나는 센서", 0, device8Status.get(0), device8Status, true);

        Map<Integer, String> device3Status = new HashMap<>();
        device3Status.put(0, "ON"); device3Status.put(1, "OFF");
        Device device3 = new Device("PPAP$1", "놀라운 센서", 0, device3Status.get(1), device3Status, false);

        Map<Integer, String> device4Status = new HashMap<>();
        device4Status.put(0, "잠김"); device4Status.put(1, "열림");
        Device device4 = new Device("RD24A$1", "빛나는 센서", 0, device4Status.get(1), device4Status, true);
        List<Device> devices = Arrays.asList(device1, device2, device3, device4, device5, device7, device8);
        deviceRepository.saveAll(devices);
        return "good!";
    }

    @GetMapping("/devices")
    public ResponseEntity<List<Device>> getDevices() throws IOException {
        List<Device> devices = deviceRepository.findAll();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PutMapping("/device")
    public ResponseEntity<Device> triggerEventToDevice(@RequestBody DeviceDTO.Update device) throws IOException {
        Device deviceInDB = deviceRepository.findById(device.getDeviceId()).get();
        deviceInDB.setCurrentStatusCode(device.getCurrentStatusCode());
        deviceInDB.setCurrentStatusTitle(deviceInDB.getStatuses().get(device.getCurrentStatusCode()));
        deviceRepository.save(deviceInDB);
        return new ResponseEntity<>(deviceInDB, HttpStatus.OK);
    }
}