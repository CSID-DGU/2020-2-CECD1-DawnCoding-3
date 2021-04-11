package com.dawn.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class RedisDeviceEvent implements Serializable {

    private long deviceId;
    private int status;
    private long triggeredAt;

    @Override
    public String toString() {
        return String.format("deviceId - %s, status - %s, triggeredAt - %s",
                deviceId, status, triggeredAt);
    }

}
