export default function Dashboard({ stats }) {
  const maxCount = Math.max(1, ...stats.byDepartment.map((d) => d.count));

  return (
    <section className="dashboard">
      <div className="stat-cards">
        <div className="card stat blue">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="card stat green">
          <span className="stat-label">Average CGPA</span>
          <span className="stat-value">{stats.avgCgpa.toFixed(2)}</span>
        </div>
        <div className="card stat orange">
          <span className="stat-label">Average Attendance</span>
          <span className="stat-value">{stats.avgAttendance.toFixed(1)}%</span>
        </div>
        <div className="card stat purple">
          <span className="stat-label">Departments</span>
          <span className="stat-value">{stats.byDepartment.length}</span>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Department-wise Breakdown</h3>
        {stats.byDepartment.length === 0 ? (
          <p className="muted">No data yet. Add your first student to see statistics.</p>
        ) : (
          <div className="dept-list">
            {stats.byDepartment.map((d) => (
              <div className="dept-row" key={d.department}>
                <span className="dept-name">{d.department}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(d.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="dept-count">
                  {d.count} {d.count === 1 ? "student" : "students"}
                </span>
                <span className="dept-cgpa">Avg CGPA {d.avgCgpa.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
