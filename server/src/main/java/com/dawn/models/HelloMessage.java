package com.dawn.models;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class HelloMessage {

    private String name;
    private String contents;
    private Date sendDate;
}
