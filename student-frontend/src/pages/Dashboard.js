import React from "react";

export default function Dashboard() {
  // Placeholder — you can fetch metrics later
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Simple stats & charts can be added here later.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        <div style={cardStyle}>
          <h3>Total Students</h3>
          <p style={{ fontSize: 24 }}>—</p>
        </div>
        <div style={cardStyle}>
          <h3>Average Marks</h3>
          <p style={{ fontSize: 24 }}>—</p>
        </div>
        <div style={cardStyle}>
          <h3>Top Performer</h3>
          <p style={{ fontSize: 18 }}>—</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: 12,
  border: "1px solid #eee",
  borderRadius: 6,
  background: "#fff",
};
