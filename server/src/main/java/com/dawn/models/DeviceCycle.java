package com.dawn.models;

import lombok.*;

import javax.persistence.*;

@RequiredArgsConstructor
@Entity
@Getter
@Data
public class DeviceCycle {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private long id;

    @ManyToOne
    private Device device;

    private String sequence;

    private int threshold;

    private int excludedAcc;

    public DeviceCycle(Device device, String sequence) {
        this.device = device;
        this.sequence = sequence;
        this.threshold = 1000;
        this.excludedAcc = 0;
    }
}
