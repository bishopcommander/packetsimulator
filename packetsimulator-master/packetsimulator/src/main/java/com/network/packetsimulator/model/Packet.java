package com.network.packetsimulator.model;

import lombok.Setter;

import java.util.List;

public class Packet {

    private String packetId;
    private String source;
    private String destination;
    private String payload;

    @Setter
    private List<String> route;
    @Setter
    private String status;

    public Packet(String packetId,
                  String source,
                  String destination,
                  String payload) {

        this.packetId = packetId;
        this.source = source;
        this.destination = destination;
        this.payload = payload;

        this.status = "CREATED";
    }

    public String getPacketId() {
        return packetId;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getPayload() {
        return payload;
    }

    public List<String> getRoute() {
        return route;
    }

    public String getStatus() {
        return status;
    }
}