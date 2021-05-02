package com.dawn.repository;

import com.dawn.models.Device;
import com.dawn.models.DeviceCycleIntervalLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceCycleIntervalLogRepository extends JpaRepository<DeviceCycleIntervalLog, Long> {

    public List<DeviceCycleIntervalLog> findByDeviceAndSequence(Device device, String sequence);
}
