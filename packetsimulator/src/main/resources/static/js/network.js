// create datasets
const nodes = new vis.DataSet([]);
const edges = new vis.DataSet([]);

// get container
const container = document.getElementById("network");

// graph data
const data = {
    nodes: nodes,
    edges: edges
};

// graph options
const options = {
    nodes: {
        shape: "dot",
        size: 18,
        font: { size: 16 }
    },
    edges: {
        arrows: "to"
    },
    physics: {
        enabled: true
    }
};

// create network
const network = new vis.Network(container, data, options);


// add node visually
function drawNode(nodeName) {

    if (nodes.get(nodeName) == null) {
        nodes.add({
            id: nodeName,
            label: nodeName
        });
    }
}


// add edge visually
function drawEdge(from, to) {

    edges.add({
        from: from,
        to: to
    });
}
// Packet animation node
let packetNodeId = "packet_node";

// Function to animate packet along route
function animatePacket(route){

    if(!route || route.length === 0) return;

    // remove old packet if exists
    if(nodes.get(packetNodeId)){
        nodes.remove(packetNodeId);
    }

    let step = 0;

    function movePacket(){

        if(step >= route.length){
            nodes.remove(packetNodeId); // remove packet after finish
            return;
        }

        let nodeId = route[step];

        let nodePosition = network.getPositions([nodeId])[nodeId];

        if(step === 0){
            nodes.add({
                id: packetNodeId,
                label: "📦",
                x: nodePosition.x,
                y: nodePosition.y,
                fixed: true,
                physics:false
            });
        }else{
            nodes.update({
                id: packetNodeId,
                x: nodePosition.x,
                y: nodePosition.y
            });
        }

        step++;

        setTimeout(movePacket,1000); // 1 second per hop
    }

    movePacket();
}