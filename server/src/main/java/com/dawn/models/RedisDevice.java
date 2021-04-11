package com.dawn.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@RedisHash("redis_device")
public class RedisDevice implements Serializable {

    @Id
    private long deviceId;

    private LocalDateTime lastTriggeredAt;

}
