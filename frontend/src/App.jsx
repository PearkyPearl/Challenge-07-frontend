import { useEffect, useState } from "react";
import "./App.css";

const nodes = [
  {
    id: 1,
    name: "VNIT-Hostel_Gateway",
    os: "Ubuntu 22.04",
    status: "Online",
    cpu: "34%",
    memory: "48%",
    lastChecked: "Just now",
    owner: "Network Team",
    logs: [
"Hostel gaetway heartbeat received successfully.",
"Wifi traffic level normal",
"Firewall blocked 2 suspicious connection attempts.",
"Monitoring service synced with dashboard"
    ] 
  },
  {
    id: 2,
    name: "Shell-Core-Node",
    os: "Debian 12",
    status: "offline",
    cpu: "0%",
    memory: "0%",
    lastChecked: "12 mins ago",
    owner: "Shell Tech Club",
    logs: [
"Last heartbeat missed",
"SSH connection failed",
"Node marked as offline",
"Manual restart required"
    ] 
  },
  {
    id: 3,
    name: "EEE-Lab-Monitor",
    os: "CentOS 9",
    status: "Isolated",
    cpu: "71%",
    memory: "68%",
    lastChecked: "2 mins ago",
    owner: "EEE Department",
    logs: [
"Suspicious login attempt detected",
"Firewall rules updated",
"Node isolated from network for security",
"Admin review required"
    ] 
  },
  {
    id: 4,
    name: "CRC-Database-Server",
    os: "Ubuntu 20.04",
    status: "Online",
    cpu: "42%",
    memory: "59%",
    lastChecked: "Just now",
    owner: "CRC Admin Team",
    logs: [
"Database backup completed successfully.",
"Query response time normal",
"CRC network latency increased temporarily",
"System returned to stable state"
    ] 
  },
  {
    id: 5,
    name: "Axis-Event-Node",
    os: "Fedora 40",
    status: "Online",
    cpu: "53%",
    memory: "61%",
    lastChecked: "1 min ago",
    owner: "AXIS Tech Team",
    logs: [
"Event monitoring service active.",
"Alert rules updated for upcoming event",
"Dashboard synced with latest event data",
"No critical issues detected"
    ] 
  },
];

function App() 
{
  const [activeView, setActiveView] = useState("nodes");
  const [expandedNode, setExpandedNode] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    let socket;

    if (activeView === "alerts") {
      socket = new WebSocket("ws://localhost:8000");

      socket.onopen = () => {
        setConnectionStatus("Connected");
      };

      socket.onmessage = (event) => {
        const newAlert = JSON.parse(event.data);
        setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
      };

      socket.onerror = () => {
        setConnectionStatus("Error");
      };

      socket.onclose = () => {
        setConnectionStatus("Disconnected");
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [activeView]);

  const getStatusClass = (status) => {
    if (status === "Online") return "status-online";
    if (status === "offline") return "status-offline";
    return "staus-isolated";
  };

  const getSeverityClass = (severity) => {
    if (severity === "High") return "severity-high";
    if (severity === "Medium") return "severity-medium";
    return "severity-low";
  };

  const totalNodes = nodes.length;
  const onlineNodes = nodes.filter((node) => node.status === "Online").length;
  const offlineNodes = nodes.filter((node) => node.status === "offline").length;
  const isolatedNodes = nodes.filter((node) => node.status === "Isolated").length;

  return (
    <div className="app">
      <header className="hero">
        <div> 
          <p className="title">Shell Tech Club Network Dashboard</p>
          <h1>VNIT Node Monitoring Dashboard</h1>
          <p className="subtitle">
            Personalised Real-time frontend dashboard for monitoring campus-style nodes and alerts.
          </p>
        </div>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <p>Total Nodes</p>
          <h2>{totalNodes}</h2>
        </div>
        <div className="summary-card">
          <p>Online Nodes</p>
          <h2>{onlineNodes}</h2>
        </div>
        <div className="summary-card">
          <p>Offline Nodes</p>
          <h2>{offlineNodes}</h2>
        </div>
        <div className="summary-card">
          <p>Isolated Nodes</p>
          <h2>{isolatedNodes}</h2>
        </div>
      </section>

      <nav className="tabs">
        <button
          className={activeView === "nodes" ? "active" : ""}
          onClick={() => setActiveView("nodes")}
        >
          Node List
        </button>

        <button
          className={activeView === "alerts" ? "active" : ""}
          onClick={() => setActiveView("alerts")}
        >
          Live Alerts
        </button>
      </nav>

      {activeView === "nodes" && (
        <section>
          <div className="section-heading">
            <h2>Node List</h2>
            <p>Click any node to view recent fake logs</p>
          </div>

          <div className="node-grid">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="node-card"
                onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
              >
                <h3>{node.name}</h3>
                <span className={`status-badge ${getStatusClass(node.status)}`}>
                  {node.status}
                </span>

                <p><strong>OS:</strong> {node.os}</p>
                <p><strong>Last Checked:</strong> {node.lastChecked}</p>
                <p><strong>Owner:</strong> {node.owner}</p>

                <div className="metrics">
                  <div>
                    <span>CPU:</span>
                    <strong>{node.cpu}</strong>
                  </div>
                  <div>
                    <span>Memory:</span>
                    <strong>{node.memory}</strong>
                  </div>
                </div>

                {expandedNode === node.id && (
                  <div className="logs">
                    <h4>Recent Logs:</h4>
                    {node.logs.map((log, index) => (
                      <p key={index} className="log-line">
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

          {activeView === "alerts" && (
            <section>
              <div className="alert-header">
                <div className="section-heading">
                <h2>Live Alerts</h2>
                <p>Alerts are received from the mock webSocket backsend.</p>
              </div>

              <span className={`connection ${connectionStatus.toLowerCase()}`}>
                WebSocket: {connectionStatus}
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Node Name</th>
                  <th>Severity</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-message">
                      Waiting for live alerts...
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id}>
                      <td>{alert.nodeName}</td>
                      <td>
                        <span className={`severity ${getSeverityClass(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td>{alert.description}</td>
                      <td>{alert.timestamp}</td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}  
    </div>
  );

}

export default App;





