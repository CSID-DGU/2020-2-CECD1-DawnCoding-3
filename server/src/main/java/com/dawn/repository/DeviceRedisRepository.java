package com.dawn.repository;

import com.dawn.models.RedisDevice;
import org.springframework.data.repository.CrudRepository;

public interface DeviceRedisRepository extends CrudRepository<RedisDevice, Long> {
}
