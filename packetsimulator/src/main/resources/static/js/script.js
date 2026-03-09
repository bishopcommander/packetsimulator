async function addNode() {

    const node = document.getElementById("nodeName").value;

    if (!node) {
        alert("Enter node name");
        return;
    }

    const response = await fetch("/api/addNode?node=" + node, {
        method: "POST"
    });

    const text = await response.text();

    document.getElementById("output").innerHTML += text + "<br>";

    // draw node in graph
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

    const response = await fetch(`/api/addEdge?from=${from}&to=${to}&weight=${weight}`, {
        method: "POST"
    });

    const text = await response.text();

    document.getElementById("output").innerHTML += text + "<br>";

    // draw edge visually
    drawEdge(from, to);
}



async function sendPacket() {

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const data = document.getElementById("data").value;
    const packetLoss = document.getElementById("packetLoss").value;

    const response = await fetch(`/api/sendPacket?source=${source}&destination=${destination}&data=${data}&packetLoss=${packetLoss}`);

    const result = await response.json();

    const output = document.getElementById("output");

    output.innerHTML = "";

    result.forEach(step => {

        const line = document.createElement("div");
        line.innerText = step;

        output.appendChild(line);
    });
}