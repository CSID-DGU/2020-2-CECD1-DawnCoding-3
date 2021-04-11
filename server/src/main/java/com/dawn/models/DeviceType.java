package com.dawn.models;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
public class DeviceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deviceTypeId")
    private long deviceTypeId;

    private String deviceTypeName;

    public DeviceType(String deviceTypeName) {
        this.deviceTypeName = deviceTypeName;
    }
}
