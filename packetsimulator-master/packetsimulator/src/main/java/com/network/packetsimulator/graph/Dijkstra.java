package com.network.packetsimulator.graph;

import java.util.*;

public class Dijkstra {

    private Graph graph;

    public Dijkstra(Graph graph) {
        this.graph = graph;
    }

    public List<String> findShortestPath(String source, String destination) {

        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();

        PriorityQueue<NodeDistance> pq =
                new PriorityQueue<>(Comparator.comparingInt(n -> n.distance));

        // Initialize distances
        for (String node : graph.getAdjList().keySet()) {
            dist.put(node, Integer.MAX_VALUE);
        }

        dist.put(source, 0);
        pq.add(new NodeDistance(source, 0));

        while (!pq.isEmpty()) {

            NodeDistance current = pq.poll();
            String currentNode = current.node;

            // Stop early if destination reached
            if (currentNode.equals(destination)) break;

            for (Edge edge : graph.getAdjList().get(currentNode)) {

                String neighbor = edge.getTo();
                int weight = edge.getWeight();

                int newDist = dist.get(currentNode) + weight;

                if (newDist < dist.get(neighbor)) {
                    dist.put(neighbor, newDist);
                    prev.put(neighbor, currentNode);
                    pq.add(new NodeDistance(neighbor, newDist));
                }
            }
        }

        // Reconstruct path
        List<String> path = new ArrayList<>();
        String step = destination;

        while (step != null) {
            path.add(0, step);
            step = prev.get(step);
        }

        // If no path exists
        if (path.size() == 1 && !path.get(0).equals(source)) {
            return new ArrayList<>();
        }

        return path;
    }

    // Helper class for priority queue
    static class NodeDistance {
        String node;
        int distance;

        NodeDistance(String node, int distance) {
            this.node = node;
            this.distance = distance;
        }
    }
}