package com.dawn.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "status")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statusId;

    private int status_key;
    private String status_name;
    private int status_order;

    public Status(int status_key, String status_name, int status_order){
        this.status_key = status_key;
        this.status_name = status_name;
        this.status_order = status_order;
    }
}
