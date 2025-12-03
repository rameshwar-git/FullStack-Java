import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is the Student Management demo. Use the navigation to open the Students page or Dashboard.</p>
      <p>
        Quick links: <Link to="/students">Students</Link> • <Link to="/dashboard">Dashboard</Link>
      </p>
    </div>
  );
}
