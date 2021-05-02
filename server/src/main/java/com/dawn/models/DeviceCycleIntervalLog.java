package com.dawn.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@Entity
@Getter
@Data
public class DeviceCycleIntervalLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private long id;

    @OneToOne
    private Device device;

    private String sequence;

    private long threshold;

    public DeviceCycleIntervalLog () {}

    public DeviceCycleIntervalLog(String sequence, Device device, long threshold) {
        this.sequence = sequence;
        this.device = device;
        this.threshold = threshold;
    }
}
