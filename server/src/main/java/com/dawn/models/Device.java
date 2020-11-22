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

    private boolean analog;

    private int lowerBound = 0;

    private int lowCriticalPoint = 20;

    private int highBound = 100;

    private int highCriticalPoint = 80;


    @Enumerated(EnumType.ORDINAL)
    private UnitType unitType;

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

    public Device(String signalName, String deviceName, int currentStatusCode,
                  String currentStatusTitle, Map<Integer, String> statuses, boolean tts,
                  boolean analog, int lowerBound, int lowCriticalPoint,
                  int highBound, int highCriticalPoint, UnitType unitType) {
        this.signalName = signalName;
        this.deviceName = deviceName;
        this.currentStatusCode = currentStatusCode;
        this.currentStatusTitle = currentStatusTitle;
        this.statuses = statuses;
        this.tts = tts;
        this.analog = analog;
        this.lowerBound = lowerBound;
        this.lowCriticalPoint = lowCriticalPoint;
        this.highBound = highBound;
        this.highCriticalPoint = highCriticalPoint;
        this.unitType = unitType;
    }
}
