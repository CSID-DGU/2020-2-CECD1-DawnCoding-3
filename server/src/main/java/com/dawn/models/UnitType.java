package com.dawn.models;

public enum UnitType {

    NONE(0, ""),
    TEMPERATURE(1, "온도"),
    HUMIDIY(2, "습도");

    int unitCode;
    String unitTitle;

    UnitType(int unitCode, String unitTitle) {
        this.unitCode = unitCode;
        this.unitTitle = unitTitle;
    }
}
