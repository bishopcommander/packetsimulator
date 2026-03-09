package com.network.packetsimulator.service;

import com.network.packetsimulator.graph.*;

import java.util.*;

public class PacketService {

    private BFSRouter router = new BFSRouter();

    public List<String> sendPacket(Graph graph, String source, String destination, String data, double packetLoss) {

        List<String> path = router.route(graph, source, destination);

        List<String> result = new ArrayList<>();

        Random random = new Random();

        for (String node : path) {

            if (random.nextDouble() < packetLoss) {
                result.add("Packet lost at node: " + node);
                return result;
            }

            result.add("Packet reached node: " + node);
        }

        result.add("Data Delivered: " + data);

        return result;
    }
}