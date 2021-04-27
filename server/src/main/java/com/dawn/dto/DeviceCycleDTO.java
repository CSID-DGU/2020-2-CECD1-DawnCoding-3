package com.dawn.dto;

import lombok.*;

public class DeviceCycleDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
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

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangeDeviceCycle {
        private long id;
        private int threshold;
    }
}
