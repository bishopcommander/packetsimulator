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
        size: 20,
        borderWidth: 2,
        font: {
            size: 14,
            color: "#ffffff",
            face: "Inter"
        },
        color: {
            background: "#020617",
            border: "#00e5ff",
            highlight: {
                background: "#00e5ff",
                border: "#ffffff"
            },
            hover: {
                background: "#00e5ff",
                border: "#ffffff"
            }
        }
    },
    edges: {
        arrows: "to",
        smooth: false,
        width: 1.5,
        color: {
            color: "rgba(255, 255, 255, 0.2)",
            highlight: "#00e5ff",
            hover: "#00e5ff"
        },
        font: {
            align: "top",
            color: "#00e5ff",
            size: 12,
            face: "Space Mono",
            strokeWidth: 0
        }
    },
    physics: {
        enabled: true,
        stabilization: { iterations: 100 },
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09
        }
    },
    interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        hover: true
    }
};

// create network
const network = new vis.Network(container, data, options);
network.setSize("100%", "100%");

network.once("stabilizationIterationsDone", function () {
    network.setOptions({ physics: false });
});

network.on("dragStart", function () {
    network.setOptions({ physics: false });
});

function drawNode(node) {
    nodes.add({ id: node, label: node });
    network.fit();
}

function drawEdge(from, to, weight) {
    edges.add({
        from: from,
        to: to,
        label: weight.toString(),
        weight: parseFloat(weight)
    });
    network.fit();
}

// animation state
let packetAnimation = null;
let activePath = null;

function animatePacket(route) {
    if (!route || route.length < 2) return;

    let hopIndex = 0;
    let progress = 0;
    activePath = route;

    function move() {
        if (hopIndex >= route.length - 1) {
            packetAnimation = null;
            // Highlight final path in solid blue
            edges.update(edges.get().map(e => ({ ...e, color: { color: "#e5e7eb" }, width: 1.5 })));
            for (let i = 0; i < route.length - 1; i++) {
                let edge = edges.get().find(e => (e.from === route[i] && e.to === route[i+1]) || (e.from === route[i+1] && e.to === route[i]));
                if (edge) edges.update({ id: edge.id, color: { color: "#2563eb" }, width: 3 });
            }
            network.redraw();
            return;
        }

        let from = route[hopIndex];
        let to = route[hopIndex + 1];
        let positions = network.getPositions([from, to]);
        let start = positions[from];
        let end = positions[to];

        progress += 0.04;
        packetAnimation = {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress
        };

        network.redraw();

        if (progress >= 1) {
            progress = 0;
            hopIndex++;
            setTimeout(move, 200);
        } else {
            requestAnimationFrame(move);
        }
    }
    move();
}

network.on("afterDrawing", function (ctx) {
    if (packetAnimation) {
        ctx.beginPath();
        ctx.arc(packetAnimation.x, packetAnimation.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#2563eb";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});