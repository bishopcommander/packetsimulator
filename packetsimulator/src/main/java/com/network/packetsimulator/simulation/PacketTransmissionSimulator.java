package com.network.packetsimulator.simulation;

import com.network.packetsimulator.model.Packet;

import java.util.List;

public class PacketTransmissionSimulator {

    private PacketLossSimulator lossSimulator = new PacketLossSimulator();

    public Packet transmit(Packet packet,
                           List<String> route,
                           double lossRate) {

        packet.setRoute(route);

        for (String node : route) {

            boolean lost = lossSimulator.lost(lossRate);

            if (lost) {

                packet.setStatus("LOST at " + node);
                return packet;

            }

        }

        packet.setStatus("DELIVERED");

        return packet;
    }

}