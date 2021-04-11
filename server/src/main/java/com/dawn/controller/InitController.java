package com.dawn.controller;

import com.dawn.models.Device;
import com.dawn.models.Status;
import com.dawn.models.UnitType;
import com.dawn.repository.DeviceRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class InitController {

    private final DeviceRepository deviceRepository;

    @GetMapping("/init")
    public String initData() throws IOException {
        List<Device> deviceList = new ArrayList<>();
        CSVReader reader = new CSVReader(new FileReader(new ClassPathResource("static/data.csv").getFile())); // 1
        String[] nextLine;
        List<Device> devices = new ArrayList<>();
        String signalName, type, name, status;
        while ((nextLine = reader.readNext()) != null) {
            List<Status> statusList = new ArrayList<>();
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
                    Status tmpStatus = new Status();
                    tmpStatus.setStatus_key(key);
                    tmpStatus.setStatus_name(stringStatus);
                    tmpStatus.setStatus_order(j + 1);
                    statusList.add(tmpStatus);
                    builder = new StringBuilder();
                }
                builder.append(curr);

            }
            Device device =
                    new Device(signalName, name, 0, "default", statusList, true,
                            true, 20, 0, 80, 100, UnitType.NONE);
            deviceList.add(device);
        }
        deviceRepository.saveAll(deviceList);
        return "good!";
    }

    @GetMapping("/init2")
    public String initData2() {
        List<Status> statusList1 = new ArrayList<>();
        statusList1.add(new Status(0, "정상", 1));
        statusList1.add(new Status(1, "이상", 2));
        Device device1 = new Device("ABC1234$1", "(128KV) 함선보호", 0, "정상", statusList1, false);

        List<Status> statusList5 = new ArrayList<>();
        statusList5.add(new Status(0, "정상", 1));
        statusList5.add(new Status(1, "이상", 2));
        Device device5 = new Device("ABC1234$2", "(128KV) 함선보호", 0, "정상", statusList5, true);

        List<Status> statusList6 = new ArrayList<>();
        statusList6.add(new Status(0, "정상", 1));
        statusList6.add(new Status(1, "이상", 2));
        Device device7 = new Device("ABC1234$3", "(128KV) 함선보호", 0, "정상", statusList6, true);

        List<Status> statusList2 = new ArrayList<>();
        statusList2.add(new Status(0, "열림", 1));
        statusList2.add(new Status(1, "닫힘", 2));
        statusList2.add(new Status(2, "정상", 3));
        statusList2.add(new Status(3, "비정상", 4));
        Device device2 = new Device("HRDP3332$AT$1", "3상 전류 LEGENO 통지반", 0, "열림", statusList2, false);

        List<Status> statusList8 = new ArrayList<>();
        statusList8.add(new Status(0, "열림", 1));
        statusList8.add(new Status(1, "닫힘", 2));
        statusList8.add(new Status(2, "정상", 3));
        statusList8.add(new Status(3, "비정상", 4));
        Device device8 = new Device("HRDP3332$AT$2", "3상 전류 LEGENO 통지반", 0, "열림", statusList8, true);

        List<Status> statusList3 = new ArrayList<>();
        statusList3.add(new Status(0, "ON", 1));
        statusList3.add(new Status(1, "OFF", 2));
        Device device3 = new Device("PPAP$1", "고장 주파수 발생", 0, "ON", statusList3, false);

        List<Status> statusList4 = new ArrayList<>();
        statusList4.add(new Status(0, "잠김", 1));
        statusList4.add(new Status(1, "열림", 2));
        Device device4 = new Device("RD24A$1", "2MTR NARUTO SASUKE", 0, "잠김", statusList4, true);

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
}