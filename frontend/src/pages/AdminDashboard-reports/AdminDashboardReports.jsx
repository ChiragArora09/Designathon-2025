import './AdminDashboardReports.css'

const AdminDashboardReports = () => {
      return (
    <div className="section-container">
      <h2 className="section-title">Reports</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>📑 Generate Reports</h3>
          <p>Compile performance into AI-based reports.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📥 Download PDF</h3>
          <p>Download sharable insights.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📤 Share to Manager</h3>
          <p>Send report via email to mentors.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardReports