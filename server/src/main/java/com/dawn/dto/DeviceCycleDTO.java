package com.dawn.dto;

import lombok.*;

public class DeviceCycleDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class GetExcludedDeviceCycle {
        private long id;
        private long deviceId;
        private String signalName;
        private String deviceName;
        private String sequence;
        private int threshold;
        private int excludedAcc;

    }
}
