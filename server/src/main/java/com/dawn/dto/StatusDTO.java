package com.dawn.dto;

import lombok.*;

import java.util.List;

public class StatusDTO {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    public static class Update{
        private List<Integer> orderList;
    }
}
