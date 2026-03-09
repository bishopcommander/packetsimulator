package com.network.packetsimulator.service;

import com.network.packetsimulator.graph.Graph;

import org.springframework.stereotype.Service;

@Service
public class NetworkService {

    private Graph graph = new Graph();

    public void addNode(String node){

        graph.addNode(node);

    }

    public void connect(String from,String to, double weight){

        graph.addEdge(from,to,weight);

    }

    public Graph getGraph(){

        return graph;

    }

}