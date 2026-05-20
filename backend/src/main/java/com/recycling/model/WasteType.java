package com.recycling.model;

public enum WasteType {
    PLASTIC(10),
    PAPER(8),
    GLASS(12),
    ORGANIC(5),
    MIXED(3);

    private final int pointsPerKg;

    WasteType(int pointsPerKg) {
        this.pointsPerKg = pointsPerKg;
    }

    public int getPointsPerKg() {
        return pointsPerKg;
    }
}
