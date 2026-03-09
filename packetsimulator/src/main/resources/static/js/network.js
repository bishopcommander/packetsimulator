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