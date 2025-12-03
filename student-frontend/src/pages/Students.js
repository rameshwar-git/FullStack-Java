import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({ baseURL: "http://localhost:8080" });

/* --- Small inline SVG icons (no external dependency) --- */
function EditIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function TrashIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function Students() {
  // Paged data
  const [students, setStudents] = useState([]); // page content
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, size: 5, totalElements: 0 });

  // paging/sorting controls
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState("rollNo");
  const [direction, setDirection] = useState("asc");

  // search (client-side filter)
  const [searchText, setSearchText] = useState("");

  // form + edit
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editRoll, setEditRoll] = useState(null);

  // UX
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // refs
  const rollRef = useRef(null);
  const nameRef = useRef(null);
  const marksRef = useRef(null);

  const navigate = useNavigate();

  // auto-dismiss flash
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  // Fetchpaged data whenever paging/sort changes
  useEffect(() => {
    let canceled = false;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/students/page?page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}&direction=${direction}`
        );

        if (data && Array.isArray(data.content)) {
          if (!canceled) {
            setStudents(data.content);
            setPageInfo({
              number: data.number ?? page,
              totalPages: data.totalPages ?? 1,
              size: data.size ?? size,
              totalElements: data.totalElements ?? (data.content.length || 0),
            });
          }
        } else if (Array.isArray(data)) {
          if (!canceled) {
            setStudents(data);
            setPageInfo({ number: 0, totalPages: 1, size: data.length, totalElements: data.length });
          }
        } else {
          if (!canceled) {
            setStudents([]);
            setPageInfo({ number: 0, totalPages: 1, size, totalElements: 0 });
          }
        }
      } catch (err) {
        console.error("Fetch page failed:", err);
        if (!canceled) setFlash({ type: "error", message: "Failed to load students." });
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchPage();
    return () => {
      canceled = true;
    };
  }, [page, size, sortBy, direction]); // eslint-disable-line

  // validation
  const validate = () => {
    const errors = {};
    if (!editMode) {
      if (!rollNo && rollNo !== 0) errors.rollNo = "Roll number is required";
      else if (!Number.isInteger(Number(rollNo))) errors.rollNo = "Roll must be an integer";
      else if (Number(rollNo) < 1) errors.rollNo = "Roll must be >= 1";
    }
    const nm = (name || "").trim();
    if (!nm) errors.name = "Name is required";
    else if (nm.length < 2) errors.name = "Name must be at least 2 characters";

    if (marks === "" || marks === null) errors.marks = "Marks required";
    else if (isNaN(marks)) errors.marks = "Marks must be a number";
    else if (Number(marks) < 0 || Number(marks) > 100) errors.marks = "Marks must be between 0 and 100";

    setFormErrors(errors);
    const keys = Object.keys(errors);
    if (keys.length) {
      if (keys[0] === "rollNo") rollRef.current?.focus();
      if (keys[0] === "name") nameRef.current?.focus();
      if (keys[0] === "marks") marksRef.current?.focus();
    }
    return keys.length === 0;
  };

  const clearForm = () => {
    setRollNo("");
    setName("");
    setMarks("");
    setFormErrors({});
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    if (!editMode) {
      const payload = { rollNo: parseInt(rollNo, 10), name: name.trim(), marks: parseFloat(marks) };
      try {
        await API.post("/students", payload);
        setFlash({ type: "success", message: "Student created" });
        clearForm();
        // after create go to first page to surface new item
        setPage(0);
      } catch (err) {
        console.error("Create error:", err);
        const msg = err.response?.data?.message || "Create failed";
        setFlash({ type: "error", message: msg });
      } finally {
        setSubmitting(false);
      }
    } else {
      const payload = { rollNo: editRoll, name: name.trim(), marks: parseFloat(marks) };
      try {
        await API.put(`/students/${editRoll}`, payload);
        setFlash({ type: "success", message: "Student updated" });
        // update UI locally
        setStudents((prev) => prev.map((s) => (s.rollNo === editRoll ? { ...s, ...payload } : s)));
        clearForm();
        setEditMode(false);
        setEditRoll(null);
      } catch (err) {
        console.error("Update error:", err);
        const msg = err.response?.data?.message || "Update failed";
        setFlash({ type: "error", message: msg });
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Start edit
  const startEdit = (student) => {
    setEditMode(true);
    setEditRoll(student.rollNo);
    setRollNo(student.rollNo);
    setName(student.name);
    setMarks(student.marks);
    setFormErrors({});
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    clearForm();
    setEditMode(false);
    setEditRoll(null);
  };

  // Delete
  const handleDelete = async (roll) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/students/${roll}`);
      setFlash({ type: "success", message: "Student deleted" });
      // if last on page and there are previous pages, move back
      if (students.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        // refetch current page
        const { data: refresh } = await API.get(
          `/students/page?page=${page}&size=${size}&sortBy=${encodeURIComponent(sortBy)}&direction=${direction}`
        );
        if (refresh && Array.isArray(refresh.content)) {
          setStudents(refresh.content);
          setPageInfo({
            number: refresh.number ?? page,
            totalPages: refresh.totalPages ?? 1,
            size: refresh.size ?? size,
            totalElements: refresh.totalElements ?? (refresh.content.length || 0),
          });
        }
      }
      if (editMode && editRoll === roll) cancelEdit();
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || "Delete failed";
      setFlash({ type: "error", message: msg });
    }
  };

  // pagination helpers
  const goToPage = (p) => {
    if (p < 0 || p >= pageInfo.totalPages) return;
    setPage(p);
  };

  const changeSize = (s) => {
    setSize(s);
    setPage(0);
  };

  const toggleDirection = () => {
    setDirection((d) => (d === "asc" ? "desc" : "asc"));
    setPage(0);
  };

  // client-side search: filter current page content by name substring (case-insensitive)
  const filtered = students.filter((s) => s.name.toLowerCase().includes(searchText.trim().toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1>Students</h1>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "6px 10px" }}>
            Go to Dashboard
          </button>
        </div>
      </div>

      {flash && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: flash.type === "success" ? "#eaffe6" : "#ffecec",
            color: flash.type === "success" ? "#063" : "#900",
            border: `1px solid ${flash.type === "success" ? "#063" : "#900"}`,
          }}
        >
          {flash.message}
        </div>
      )}

      {/* form */}
      <section style={{ marginBottom: 12 }}>
        <h2>{editMode ? "Edit Student" : "Add Student"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <label>
            Roll No
            <input ref={rollRef} type="number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} disabled={editMode} style={{ width: "100%", padding: 8 }} />
            {formErrors.rollNo && <div style={{ color: "crimson" }}>{formErrors.rollNo}</div>}
          </label>

          <label>
            Name
            <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
            {formErrors.name && <div style={{ color: "crimson" }}>{formErrors.name}</div>}
          </label>

          <label>
            Marks
            <input ref={marksRef} type="number" step="0.1" value={marks} onChange={(e) => setMarks(e.target.value)} style={{ width: "100%", padding: 8 }} />
            {formErrors.marks && <div style={{ color: "crimson" }}>{formErrors.marks}</div>}
          </label>

          <div>
            <button type="submit" disabled={submitting} style={{ padding: "8px 12px" }}>
              {submitting ? "Saving..." : editMode ? "Update" : "Add"}
            </button>
            {editMode ? (
              <button type="button" onClick={cancelEdit} style={{ marginLeft: 8, padding: "8px 12px" }}>
                Cancel
              </button>
            ) : (
              <button type="button" onClick={clearForm} style={{ marginLeft: 8, padding: "8px 12px" }}>
                Clear
              </button>
            )}
          </div>
        </form>
      </section>

      <hr />

      {/* controls */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <div>
          Page size:{" "}
          <select value={size} onChange={(e) => changeSize(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <div>
          Sort by:{" "}
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
            <option value="rollNo">rollNo</option>
            <option value="name">name</option>
            <option value="marks">marks</option>
          </select>
        </div>

        <div>
          Direction: <button onClick={toggleDirection} style={{ padding: "6px 10px" }}>{direction === "asc" ? "Asc" : "Desc"}</button>
        </div>

        <div style={{ marginLeft: "auto" }}>
          Showing page {pageInfo.number + 1} of {pageInfo.totalPages} (total {pageInfo.totalElements})
        </div>
      </div>

      {/* search */}
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Search by name..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ padding: 8, width: 260 }} />
        <button onClick={() => setSearchText("")} style={{ marginLeft: 8, padding: "6px 10px" }}>
          Clear
        </button>
      </div>

      {/* table */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Roll</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Marks</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.rollNo}>
                <td style={tdStyle}>{s.rollNo}</td>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.marks}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => startEdit(s)}
                    aria-label={`Edit student ${s.rollNo}`}
                    title="Edit"
                    style={iconButtonStyle}
                  >
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => handleDelete(s.rollNo)}
                    aria-label={`Delete student ${s.rollNo}`}
                    title="Delete"
                    style={{ ...iconButtonStyle, marginLeft: 8, color: "#b30000" }}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* pagination */}
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => goToPage(page - 1)} disabled={page <= 0}>
          Prev
        </button>

        {Array.from({ length: pageInfo.totalPages }, (_, i) => i).map((p) => (
          <button key={p} onClick={() => goToPage(p)} style={{ fontWeight: p === page ? "bold" : "normal", padding: "6px 10px" }}>
            {p + 1}
          </button>
        ))}

        <button onClick={() => goToPage(page + 1)} disabled={page >= pageInfo.totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

const thStyle = { border: "1px solid #ddd", padding: 8, background: "#f7f7f7", textAlign: "left" };
const tdStyle = { border: "1px solid #ddd", padding: 8 };
const iconButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  padding: 6,
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

