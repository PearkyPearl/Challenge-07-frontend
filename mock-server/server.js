const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 8000,
});

const nodeNames = [
    "VNIT-Hostel-Gateway",
    "SHELL-Core-Node",
    "EEE-Lab-Monitor",
    "CRC-Database-Server",
    "AXIS-Event-Node"
]

const severities = ["Low", "Medium", "High"];

const descriptions = [
    "CPU usage crossed expected limit",
    "Memory usage increased suddenly",
    "Unauthorized login attempt detected",
    "Node heartbeat delayed",
    "Disk usage warning generated",
    "Firewall rule updated",
    "Suspicious network traffic found",
    "Service response time increased"
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

wss.on("connection", (ws) => {
    console.log("Frontend connected to Websocket");

    const interval = setInterval(() => {
        const alert = {
            nodeName: getRandomItem(nodeNames),
            severity: getRandomItem(severities),
            description: getRandomItem(descriptions),
            timestamp: new Date().toLocaleTimeString()
        };

        ws.send(JSON.stringify(alert));
    }, 3000);

    ws.on("close", () => {
        console.log("Frontend disconnected");
        clearInterval(interval);
    });
});

console.log("Mock WebSocket server running at ws://localhost:8000");




