async function addNode() {
    const node = document.getElementById("nodeName").value;

    const response = await fetch("/api/addNode?node=" + node, { method: "POST" });
    const text = await response.text();

    document.getElementById("output").innerHTML += text + "<br>";

    drawNode(node);
}

async function addEdge() {

    const from = document.getElementById("fromNode").value;
    const to = document.getElementById("toNode").value;
    const weight = document.getElementById("weight").value;

    if (!from || !to || !weight) {
        alert("Fill all fields");
        return;
    }

    const response = await fetch(`/api/addEdge?from=${from}&to=${to}&weight=${weight}`, { method: "POST" });
    const text = await response.text();

    document.getElementById("output").innerHTML += text + "<br>";

    drawEdge(from, to, weight);
}



async function sendPacket() {

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const data = document.getElementById("data").value;
    const packetLoss = document.getElementById("packetLoss").value;

    // ✅ NEW: get selected algorithm
    const algorithm = document.getElementById("algoSelect").value;

    console.log({
        event: "SIMULATION_START",
        algorithm: algorithm,
        source: source,
        destination: destination
    });

    // ✅ UPDATED: send algorithm to backend
    const response = await fetch(`/api/sendPacket?source=${source}&destination=${destination}&data=${data}&packetLoss=${packetLoss}&algorithm=${algorithm}`);
    const result = await response.json();

    const output = document.getElementById("output");

    let packetID = "PKT-" + Math.floor(Math.random() * 9000 + 1000);


    // Extract route from backend response
    let routeArray = result
        .filter(step => step.includes("node"))
        .map(step => step.split(": ")[1]);

    console.log("ROUTE:", routeArray);


    // Start smooth animation from network.js
    animatePacket(routeArray);


    // Route text
    let route = routeArray.join(" → ");
    let hopCount = routeArray.length;
    let delay = 0;

    for (let i = 0; i < routeArray.length - 1; i++) {

        let from = routeArray[i];
        let to = routeArray[i + 1];

        let edge = edges.get().find(e =>
            (e.from === from && e.to === to) ||
            (e.from === to && e.to === from)
        );

        if (edge && edge.weight) {
            delay += edge.weight;
        }
    }


    // Build journey report
    let journeyHTML = "";

    result.forEach(step => {

        if (step.toLowerCase().includes("lost")) {

            journeyHTML += `<div class="hop-fail">🔴 ${step}</div>`;

        } else {

            journeyHTML += `<div class="hop-success">🟢 ${step}</div>`;

        }

    });


    let success = !result.some(step => step.includes("lost"));

    let statusBadge = success
        ? `<span class="badge-success">SUCCESS</span>`
        : `<span class="badge-fail">PACKET LOST</span>`;


    output.innerHTML = `

    <div class="report-section">
        <div class="report-title">Packet Information</div>
        <div>Packet ID : ${packetID}</div>
        <div>Payload : ${data}</div>
        <div>Packet Loss Rate : ${packetLoss}</div>
        <div>Algorithm : ${algorithm.toUpperCase()}</div> <!-- ✅ NEW -->
    </div>

    <div class="report-section">
        <div class="report-title">Transmission</div>
        <div>Source Node : ${source}</div>
        <div>Destination Node : ${destination}</div>
        <div>Route : <span class="route">${route}</span></div>
    </div>

    <div class="report-section">
        <div class="report-title">Packet Journey</div>
        ${journeyHTML}
    </div>

    <div class="report-section">
        <div class="report-title">Statistics</div>
        <div>Hop Count : ${hopCount}</div>
        <div>Total Delay : ${delay} ms</div>
    </div>

    <div class="report-section">
        <div class="report-title">Status</div>
        ${statusBadge}
    </div>

    `;

    console.log({
        event: "SIMULATION_END"
    });
}
async function clearGraph() {
    // clear backend graph
    await fetch("/api/clearGraph", { method: "POST" });

    // clear visual graph
    nodes.clear();
    edges.clear();

    // clear output panel
    document.getElementById("output").innerHTML = "";

    console.log({
        event: "GRAPH_CLEARED"
    });
}