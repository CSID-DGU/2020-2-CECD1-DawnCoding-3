package com.dawn.dto;

import lombok.*;

public class DeviceDTO {

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder @Getter @Setter
    public static class Update {
        private long deviceId;
        private int currentStatusCode;
        private int currValue;
        private boolean tts;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    public static class Request {
        private long deviceId;
        private String signalName;
        private String deviceName;
        private int currentStatusCode;
        private String currentStatusTitle;
        private boolean tts;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    public static class STTResult {
        private long deviceId;
        private boolean analog;
        private String deviceName;
        private String currentStatusTitle;
        private int currValue;
    }
}
