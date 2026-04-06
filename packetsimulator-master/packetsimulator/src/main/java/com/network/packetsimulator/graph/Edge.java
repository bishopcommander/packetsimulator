package com.network.packetsimulator.graph;

public class Edge {
    public String to;
    public double weight;

    public Edge(String to, double weight) {
        this.to = to;
        this.weight = weight;
    }

    public String getTo() {
        return to;
    }

    public int getWeight() {
        return (int) weight;
    }
}