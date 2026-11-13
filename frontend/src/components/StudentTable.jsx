function cgpaClass(cgpa) {
  if (cgpa >= 8) return "badge badge-good";
  if (cgpa >= 6) return "badge badge-mid";
  return "badge badge-low";
}

function attendanceClass(a) {
  if (a >= 75) return "badge badge-good";
  if (a >= 60) return "badge badge-mid";
  return "badge badge-low";
}

export default function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <p>No students found.</p>
        <span className="muted">Try changing your search or filter, or add a new student.</span>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Sem</th>
            <th>Phone</th>
            <th>CGPA</th>
            <th>Attendance</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id}>
              <td>{i + 1}</td>
              <td className="strong">{s.name}</td>
              <td>{s.rollNumber}</td>
              <td>{s.email}</td>
              <td>
                <span className="dept-tag">{s.department}</span>
              </td>
              <td>{s.semester}</td>
              <td>{s.phone}</td>
              <td>
                <span className={cgpaClass(s.cgpa)}>{s.cgpa.toFixed(2)}</span>
              </td>
              <td>
                <span className={attendanceClass(s.attendance)}>{s.attendance}%</span>
              </td>
              <td className="actions-col">
                <button className="btn btn-sm btn-edit" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(s)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
