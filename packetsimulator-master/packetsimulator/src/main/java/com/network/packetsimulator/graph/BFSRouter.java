package com.network.packetsimulator.graph;

import java.util.*;

public class BFSRouter {

    public List<String> route(Graph graph, String source, String destination) {

        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        Map<String, String> parent = new HashMap<>();

        queue.add(source);
        visited.add(source);

        while (!queue.isEmpty()) {

            String current = queue.poll();

            if (current.equals(destination)) {
                break;
            }

            List<Edge> neighbors = graph.getGraph().get(current);

            if (neighbors == null) {
                continue;
            }

            for (Edge edge : neighbors) {

                String neighbor = edge.to;

                if (!visited.contains(neighbor)) {

                    visited.add(neighbor);
                    parent.put(neighbor, current);
                    queue.add(neighbor);
                }
            }
        }

        List<String> path = new ArrayList<>();
        String step = destination;

        while (step != null) {

            path.add(0, step);
            step = parent.get(step);
        }

        if (path.isEmpty() || !path.get(0).equals(source)) {
            return new ArrayList<>();
        }

        return path;
    }
}