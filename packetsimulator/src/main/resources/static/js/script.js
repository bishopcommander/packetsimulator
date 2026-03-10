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

    drawEdge(from, to);
}

// ---------------- Packet Animation ----------------


function animatePacket(route) {
    if (!route || route.length === 0) return;

    // remove old packet if exists
    if (nodes.get(packetNodeId)) {
        nodes.remove(packetNodeId);
    }

    let step = 0;

    function movePacket() {
        if (step >= route.length) {
            nodes.remove(packetNodeId); // remove packet after finish
            return;
        }

        let nodeId = route[step];
        let nodePosition = network.getPositions([nodeId])[nodeId];

        if (step === 0) {
            nodes.add({
                id: packetNodeId,
                label: "📦",
                x: nodePosition.x,
                y: nodePosition.y,
                fixed: true,
                physics: false
            });
        } else {
            nodes.update({
                id: packetNodeId,
                x: nodePosition.x,
                y: nodePosition.y
            });
        }

        step++;
        setTimeout(movePacket, 1000); // 1 second per hop
    }

    movePacket();
}
// -------------------------------------------------

async function sendPacket() {
    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const data = document.getElementById("data").value;
    const packetLoss = document.getElementById("packetLoss").value;

    const response = await fetch(`/api/sendPacket?source=${source}&destination=${destination}&data=${data}&packetLoss=${packetLoss}`);
    const result = await response.json();

    const output = document.getElementById("output");

    let packetID = "PKT-" + Math.floor(Math.random() * 9000 + 1000);

    // Extract route for display and animation
    let routeArray = result
        .filter(step => step.includes("node"))
        .map(step => step.split(": ")[1]);

    let route = routeArray.join(" → ");
    let hopCount = routeArray.length;

    // Animate packet on graph
    animatePacket(routeArray);

    // Build journey HTML with colored hops
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

    // Update Packet Report
    output.innerHTML = `
    <div class="report-section">
        <div class="report-title">Packet Information</div>
        <div>Packet ID : ${packetID}</div>
        <div>Payload : ${data}</div>
        <div>Packet Loss Rate : ${packetLoss}</div>
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
    </div>

    <div class="report-section">
        <div class="report-title">Status</div>
        ${statusBadge}
    </div>
    `;
}