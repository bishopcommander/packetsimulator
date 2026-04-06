package com.network.packetsimulator.model;

public class Node {

    private String id;
    private NodeType type;

    public Node(String id, NodeType type) {
        this.id = id;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public NodeType getType() {
        return type;
    }

}