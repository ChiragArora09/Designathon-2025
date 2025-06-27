import './AdminDashboardAdminTools.css'

const AdminDashboardAdminTools = () => {
    return (
    <div className="section-container">
      <h2 className="section-title">Admin Tools</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>🛠️ Manage Admins</h3>
          <p>Add/remove dashboard administrators.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📁 Data Backup</h3>
          <p>Export user/batch/quiz data.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>🚨 View Logs</h3>
          <p>Check system logs and quiz generation errors.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardAdminTools