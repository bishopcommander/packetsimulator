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
        borderWidth: 1,
        shadow:false,
        font: {
            size: 16,
            color: "#ffffff"
        },
        color:{
            background:"#6c8ef5",
            border:"#3b5bdb"
        }
    },

    edges: {
        arrows: "to",
        smooth:false,
        font: {
            align: "middle",
            color: "#ffffff"
        }
    },

    physics:{
        enabled:true,
        stabilization:{
            iterations:100
        },
        barnesHut:{
            gravitationalConstant:-500,
            centralGravity:0.2,
            springLength:100,
            springConstant:0.04,
            damping:0.6
        }
    },

    interaction:{
        dragNodes:true,
        dragView:true,
        zoomView:true,
        hover:false,
        hideEdgesOnDrag:true
    }

};

// create network
const network = new vis.Network(container, data, options);

network.setSize("100%", "500px");

network.once("stabilizationIterationsDone", function () {
    network.setOptions({ physics: false });
});

network.on("dragStart", function () {
    network.setOptions({ physics: false });
});

// add node visually
function drawNode(node){

    nodes.add({
        id: node,
        label: node
    });

    network.focus(node,{
        scale:1.3,
        animation:true
    });

    network.fit({
        animation:false
    });
}

// ✅ UPDATED: add edge WITH WEIGHT
function drawEdge(from, to, weight) {

    edges.add({
        from: from,
        to: to,
        label: weight.toString(),   // show weight
        weight: parseFloat(weight)  // store weight
    });

    network.fit({
        animation:true
    });
}

// animation state
let packetAnimation = null;
let glowingEdge = null;
let flashingNode = null;

// packet animation
function animatePacket(route){

    if(!route || route.length < 2) return;

    let hopIndex = 0;
    let progress = 0;

    function move(){

        if(hopIndex >= route.length - 1){

            packetAnimation = null;
            glowingEdge = null;

            // 🔥 FINAL PATH HIGHLIGHT
            edges.update(
                edges.get().map(e => ({
                    ...e,
                    color: { color: "#374151" } // reset all edges
                }))
            );

            for (let i = 0; i < route.length - 1; i++) {

                let from = route[i];
                let to = route[i + 1];

                let edge = edges.get().find(e =>
                    (e.from === from && e.to === to) ||
                    (e.from === to && e.to === from)
                );

                if (edge) {
                    edges.update({
                        id: edge.id,
                        color: { color: "#22c55e" } // GREEN PATH
                    });
                }
            }

            network.redraw();
            return;
        }

        let from = route[hopIndex];
        let to = route[hopIndex + 1];

        glowingEdge = {from: from, to: to};

        let positions = network.getPositions([from,to]);

        let start = positions[from];
        let end = positions[to];

        progress += 0.02;

        let x = start.x + (end.x - start.x) * progress;
        let y = start.y + (end.y - start.y) * progress;

        packetAnimation = {x:x,y:y};

        network.redraw();

        if(progress >= 1){

            flashingNode = to;

            setTimeout(()=>{
                flashingNode = null;
                network.redraw();
            },400);

            progress = 0;
            hopIndex++;

            setTimeout(move,1200);

        }else{
            requestAnimationFrame(move);
        }

    }

    move();
}

// draw visual effects
network.on("afterDrawing", function(ctx){

    // glowing edge
    if(glowingEdge){

        let positions = network.getPositions([glowingEdge.from, glowingEdge.to]);

        let start = positions[glowingEdge.from];
        let end = positions[glowingEdge.to];

        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);

        ctx.strokeStyle = "#00bfff";
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00bfff";

        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    // packet
    if(packetAnimation){

        ctx.beginPath();
        ctx.arc(packetAnimation.x, packetAnimation.y, 10, 0, 2*Math.PI);
        ctx.fillStyle = "#ff9900";
        ctx.fill();

        ctx.font = "14px Arial";
        ctx.fillText("📦", packetAnimation.x - 6, packetAnimation.y + 5);
    }

    // node flash
    if(flashingNode){

        let pos = network.getPositions([flashingNode])[flashingNode];

        ctx.beginPath();
        ctx.arc(pos.x,pos.y,22,0,2*Math.PI);

        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 4;
        ctx.stroke();
    }

});