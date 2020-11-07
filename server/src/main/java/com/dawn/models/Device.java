package com.dawn.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Map;

@AllArgsConstructor
@Entity
@Data
public class Device implements Serializable  {

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "deviceId")
    private long deviceId;

    private String signalName;

    private String deviceName;

    private int currentStatusCode;

    private String currentStatusTitle;

    private boolean tts;

    @ElementCollection
    @CollectionTable(name = "status")
    @MapKeyJoinColumn(name = "deviceId")
    @Column(name = "statuses")
    private Map<Integer, String> statuses;

    public Device() {}

    public Device(String signalName, String deviceName, int currentStatusCode,
                  String currentStatusTitle, Map<Integer, String> statuses, boolean tts) {
        this.signalName = signalName;
        this.deviceName = deviceName;
        this.currentStatusCode = currentStatusCode;
        this.currentStatusTitle = currentStatusTitle;
        this.statuses = statuses;
        this.tts = tts;
    }
}
