package com.network.packetsimulator.simulation;

import java.util.Random;

public class PacketLossSimulator {

    private Random random = new Random();

    public boolean lost(double rate){

        return random.nextDouble() < rate;

    }

}