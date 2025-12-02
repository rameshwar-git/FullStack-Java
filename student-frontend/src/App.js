import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/students")
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  }, []);

  const [name, setName] = useState("");

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Live Name Preview</h2>

      <label>
        Enter Your Name:{" "}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type Your Name"
          style={{ padding: 6 }}
        />
      </label>

      <h3>Hello {name || "..."} </h3>

      <hr />

      <h2>Student List (From API)</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Marks</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.rollNo}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
