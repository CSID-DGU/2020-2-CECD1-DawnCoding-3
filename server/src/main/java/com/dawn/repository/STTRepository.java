package com.dawn.repository;

import com.dawn.dto.DeviceDTO;
import com.dawn.models.Device;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Component
public class STTRepository {

    @PersistenceContext
    EntityManager em;

    public List<DeviceDTO.STTResult> getSTTResult(String query){
        List<DeviceDTO.STTResult> results = new ArrayList<>();
        List<Device> devices = em.createNativeQuery(query, Device.class).getResultList();
        for (Device device : devices) {
//            System.out.println(device.getDeviceName());
            results.add(new DeviceDTO.STTResult(device.getDeviceId(), device.isAnalog(),
                    device.getDeviceName(), device.getCurrentStatusTitle(), device.getCurrValue()));
        }
        return results;
    }
}
