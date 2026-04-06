package com.network.packetsimulator.service;

import com.network.packetsimulator.graph.*;

import java.util.*;

public class PacketService {

    private BFSRouter bfsRouter = new BFSRouter();

    public List<String> sendPacket(Graph graph, String source, String destination, String data, double packetLoss, String algorithm) {

        List<String> path;

        // ✅ SWITCH LOGIC
        if (algorithm.equalsIgnoreCase("dijkstra")) {
            Dijkstra dijkstra = new Dijkstra(graph);
            path = dijkstra.findShortestPath(source, destination);
        } else {
            path = bfsRouter.route(graph, source, destination);
        }

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