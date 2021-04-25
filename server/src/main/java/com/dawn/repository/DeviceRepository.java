package com.dawn.repository;

import com.dawn.models.Device;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    @Query("select distinct d from Device d join fetch d.statuses s")
    public List<Device> getStatusDevices();

    @EntityGraph(attributePaths = "statuses")
    @Query("select d from Device d where d.currentStatusTitle is null")
    public List<Device> getAnalogDevices();
}
