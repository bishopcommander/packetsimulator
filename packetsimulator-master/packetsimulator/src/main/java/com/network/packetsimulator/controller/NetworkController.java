package com.network.packetsimulator.controller;

import com.network.packetsimulator.graph.Graph;
import com.network.packetsimulator.service.PacketService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NetworkController {

    private Graph graph = new Graph();
    private PacketService packet = new PacketService();

    @PostMapping("/addNode")
    public String addNode(@RequestParam String node) {

        graph.addNode(node);

        return "Node added: " + node;
    }

    @PostMapping("/addEdge")
    public String addEdge(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double weight) {

        graph.addEdge(from, to, weight);

        return "Edge added between " + from + " and " + to;
    }

    @GetMapping("/sendPacket")
    public List<String> sendPacket(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String data,
            @RequestParam double packetLoss,
            @RequestParam String algorithm) {

        return packet.sendPacket(graph, source, destination, data, packetLoss, algorithm);
    }
}
