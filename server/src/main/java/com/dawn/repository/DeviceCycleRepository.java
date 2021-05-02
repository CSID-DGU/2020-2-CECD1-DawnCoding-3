package com.dawn.repository;

import com.dawn.models.Device;
import com.dawn.models.DeviceCycle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceCycleRepository extends JpaRepository<DeviceCycle, Long> {

    public DeviceCycle getDeviceCycleByDeviceAndAndSequence(Device device, String sequence);
}
