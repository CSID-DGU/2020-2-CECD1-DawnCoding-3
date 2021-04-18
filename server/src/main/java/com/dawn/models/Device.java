package com.dawn.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@AllArgsConstructor
@Entity
@Getter
@Data
public class Device implements Serializable  {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deviceId")
    private long deviceId;

    private String signalName;

    private String deviceName;

    private int currentStatusCode;

    private String currentStatusTitle;

    private boolean tts;


    private boolean analog = false;

    private boolean inDeadband = false;

    private int currValue = 0;

    private int lowerBound = 0;

    private int lowCriticalPoint = 20;

    private int highBound = 100;

    private int highCriticalPoint = 80;


    @Enumerated(EnumType.ORDINAL)
    private UnitType unitType;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Status> statuses = new ArrayList<>();

    @OneToMany(mappedBy = "device")
    @JsonIgnore
    private List<DeviceCycle> deviceCycles = new LinkedList<>();

    public static Device ofAnalog(String signalName, String deviceName, int lowerBound, int lowCriticalPoint,
                           int highBound, int highCriticalPoint, UnitType unitType, boolean tts) {
        return new Device(
                signalName, deviceName, lowerBound, lowCriticalPoint,
                highBound, highCriticalPoint, unitType, true, tts);
    }
    public Device() {}

    public Device(long deviceId) {
        this.deviceId = deviceId;
    }

    public Device(String signalName, String deviceName, int currentStatusCode,
                  String currentStatusTitle, List<Status> statuses, boolean tts) {
        this.signalName = signalName;
        this.deviceName = deviceName;
        this.currentStatusCode = currentStatusCode;
        this.currentStatusTitle = currentStatusTitle;
        this.statuses = statuses;
        this.tts = tts;
    }
    public Device(String signalName, String deviceName,  int lowerBound, int lowCriticalPoint,
                  int highBound, int highCriticalPoint, UnitType unitType, boolean analog, boolean tts) {
        this.signalName = signalName;
        this.deviceName = deviceName;
        this.lowerBound = lowerBound;
        this.lowCriticalPoint = lowCriticalPoint;
        this.highBound = highBound;
        this.highCriticalPoint = highCriticalPoint;
        this.unitType = unitType;
        this.analog = analog;
        this.tts = tts;
    }

    public Device(String signalName, String deviceName, int currentStatusCode,
                  String currentStatusTitle, List<Status> statuses, boolean tts,
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

    public static boolean isSafeZone(Device device, int newValue) {
        return !(newValue >= device.getHighCriticalPoint() || newValue <= device.getLowCriticalPoint());
    }

}
