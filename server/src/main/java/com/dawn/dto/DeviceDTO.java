package com.dawn.dto;

import lombok.*;

public class DeviceDTO {

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder @Getter @Setter
    public static class Update {
        private long deviceId;
        private int currentStatusCode;
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

}
