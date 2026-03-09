package com.network.packetsimulator.graph;

public class Edge {

    public String to;
    public double weight;

    public Edge(String to, double weight) {
        this.to = to;
        this.weight = weight;
    }
}