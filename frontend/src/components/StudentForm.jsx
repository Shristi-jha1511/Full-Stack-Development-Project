import { useState } from "react";
import { DEPARTMENTS, SEMESTERS } from "../constants";

const EMPTY = {
  name: "",
  rollNumber: "",
  email: "",
  department: "",
  semester: "",
  phone: "",
  cgpa: "",
  attendance: "",
};

function validate(v) {
  const e = {};
  const name = v.name.trim();
  const roll = v.rollNumber.trim();

  if (!name) e.name = "Name is required";
  else if (name.length < 2) e.name = "Name must be at least 2 characters";
  else if (!/^[A-Za-z .'-]+$/.test(name)) e.name = "Name can contain only letters and spaces";

  if (!roll) e.rollNumber = "Roll number is required";
  else if (!/^[A-Za-z0-9-]{3,20}$/.test(roll))
    e.rollNumber = "Use 3-20 letters, digits or hyphens";

  if (!v.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Enter a valid email address";

  if (!v.department) e.department = "Select a department";
  if (!v.semester) e.semester = "Select a semester";

  if (!v.phone.trim()) e.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(v.phone.trim()))
    e.phone = "Enter a valid 10-digit phone number";

  if (v.cgpa === "") e.cgpa = "CGPA is required";
  else if (isNaN(v.cgpa) || Number(v.cgpa) < 0 || Number(v.cgpa) > 10)
    e.cgpa = "CGPA must be between 0 and 10";

  if (v.attendance === "") e.attendance = "Attendance is required";
  else if (isNaN(v.attendance) || Number(v.attendance) < 0 || Number(v.attendance) > 100)
    e.attendance = "Attendance must be between 0 and 100";

  return e;
}

export default function StudentForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial
      ? {
          name: initial.name,
          rollNumber: initial.rollNumber,
          email: initial.email,
          department: initial.department,
          semester: String(initial.semester),
          phone: initial.phone,
          cgpa: String(initial.cgpa),
          attendance: String(initial.attendance),
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      name: values.name.trim(),
      rollNumber: values.rollNumber.trim().toUpperCase(),
      email: values.email.trim().toLowerCase(),
      department: values.department,
      semester: Number(values.semester),
      phone: values.phone.trim(),
      cgpa: Number(values.cgpa),
      attendance: Number(values.attendance),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      setServerError(data?.message || "Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  };

  const field = (label, name, input) => (
    <div className={`form-group ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {input}
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert-error">{serverError}</div>}

      <div className="form-grid">
        {field(
          "Student Name",
          "name",
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma"
          />
        )}
        {field(
          "Roll Number",
          "rollNumber",
          <input
            id="rollNumber"
            name="rollNumber"
            value={values.rollNumber}
            onChange={handleChange}
            placeholder="e.g. 21CSE101"
          />
        )}
        {field(
          "Email",
          "email",
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="name@college.edu"
          />
        )}
        {field(
          "Phone Number",
          "phone",
          <input
            id="phone"
            name="phone"
            inputMode="numeric"
            maxLength={10}
            value={values.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
          />
        )}
        {field(
          "Department",
          "department",
          <select
            id="department"
            name="department"
            value={values.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
        {field(
          "Semester",
          "semester",
          <select
            id="semester"
            name="semester"
            value={values.semester}
            onChange={handleChange}
          >
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        )}
        {field(
          "CGPA (0 - 10)",
          "cgpa",
          <input
            id="cgpa"
            name="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={values.cgpa}
            onChange={handleChange}
            placeholder="e.g. 8.45"
          />
        )}
        {field(
          "Attendance % (0 - 100)",
          "attendance",
          <input
            id="attendance"
            name="attendance"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={values.attendance}
            onChange={handleChange}
            placeholder="e.g. 87.5"
          />
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : initial ? "Update Student" : "Add Student"}
        </button>
      </div>
    </form>
  );
}
