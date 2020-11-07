package com.dawn.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
public class DeviceType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "deviceTypeId")
    private long deviceTypeId;

    private String deviceTypeName;

    public DeviceType(String deviceTypeName) {
        this.deviceTypeName = deviceTypeName;
    }
}
