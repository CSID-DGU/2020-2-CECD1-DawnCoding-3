package com.dawn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DawnApplication {

    public static void main(String[] args) {
        SpringApplication.run(DawnApplication.class, args);
    }

}
