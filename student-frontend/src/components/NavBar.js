import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  marginRight: 12,
  textDecoration: "none",
  color: isActive ? "#0a66c2" : "#333",
  fontWeight: isActive ? "600" : "400",
});

export default function NavBar() {
  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fafafa" }}>
      <nav style={{ maxWidth: 1100, margin: "0 auto" }}>
        <NavLink to="/" style={linkStyle}>Home</NavLink>
        <NavLink to="/students" style={linkStyle}>Students</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      </nav>
    </header>
  );
}
