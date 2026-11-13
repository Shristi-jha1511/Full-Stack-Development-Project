import { useCallback, useEffect, useMemo, useState } from "react";
import api from "./api";
import { DEPARTMENTS } from "./constants";
import Dashboard from "./components/Dashboard";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import Modal from "./components/Modal";

const EMPTY_STATS = { total: 0, avgCgpa: 0, avgAttendance: 0, byDepartment: [] };

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [studentsRes, statsRes] = await Promise.all([
        api.get("/students"),
        api.get("/students/stats"),
      ]);
      setStudents(studentsRes.data);
      setStats(statsRes.data);
      setLoadError("");
    } catch (err) {
      setLoadError(
        "Cannot connect to the server. Make sure the backend is running and MONGO_URI is correct."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchesText =
        !q || s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
      const matchesDept = !department || s.department === department;
      return matchesText && matchesDept;
    });
  }, [students, search, department]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setFormOpen(true);
  };

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);

  // Errors are thrown back to StudentForm so it can show field-level messages
  const handleSave = async (payload) => {
    if (editing) {
      await api.put(`/students/${editing._id}`, payload);
      setToast({ type: "success", msg: "Student updated successfully" });
    } else {
      await api.post("/students", payload);
      setToast({ type: "success", msg: "Student added successfully" });
    }
    closeForm();
    await loadData();
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/students/${deleting._id}`);
      setToast({ type: "success", msg: "Student deleted successfully" });
      setDeleting(null);
      await loadData();
    } catch (err) {
      setToast({ type: "error", msg: err.response?.data?.message || "Delete failed" });
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  const closeDelete = useCallback(() => setDeleting(null), []);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Student Management System</h1>
          <p className="muted">MERN Stack · Full Stack Development II</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Student
        </button>
      </header>

      <main className="container">
        {loadError && <div className="alert-error">{loadError}</div>}

        <Dashboard stats={stats} />

        <section className="card directory">
          <div className="directory-head">
            <h3 className="card-title">
              Student Directory
              <span className="count-pill">{filtered.length}</span>
            </h3>

            <div className="filters">
              <input
                type="search"
                className="search-input"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {(search || department) && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearch("");
                    setDepartment("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading students...</p>
            </div>
          ) : (
            <StudentTable students={filtered} onEdit={openEdit} onDelete={setDeleting} />
          )}
        </section>
      </main>

      {formOpen && (
        <Modal title={editing ? "Edit Student" : "Add New Student"} onClose={closeForm}>
          <StudentForm initial={editing} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Student" onClose={closeDelete}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{deleting.name}</strong> (
            {deleting.rollNumber})? This action cannot be undone.
          </p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={closeDelete}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete} disabled={deleteBusy}>
              {deleteBusy ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
