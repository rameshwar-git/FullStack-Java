import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      <NavBar />
      <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
