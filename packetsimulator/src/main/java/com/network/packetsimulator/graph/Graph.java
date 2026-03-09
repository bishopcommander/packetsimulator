package com.network.packetsimulator.graph;

import java.util.*;

public class Graph {

    private Map<String, List<Edge>> adjList = new HashMap<>();

    public void addNode(String node) {
        adjList.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(String from, String to, double weight) {

        adjList.putIfAbsent(from, new ArrayList<>());
        adjList.putIfAbsent(to, new ArrayList<>());

        adjList.get(from).add(new Edge(to, weight));
        adjList.get(to).add(new Edge(from, weight));
    }
    public Map<String, List<Edge>> getGraph() {
        return adjList;
    }
}