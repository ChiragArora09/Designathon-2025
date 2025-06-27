import './AdminDashboardOnlineContent.css'

const AdminDashboardOnlineContent = () => {
  return (
    <div className="section-container">
      <h2 className="section-title">OnlineContent</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>🧾 Generate Quiz</h3>
          <p>Create MCQs and coding challenges with AI.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📥 Assign to Users</h3>
          <p>Distribute content to specific users.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📊 View Submissions</h3>
          <p>See performance and attempts.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardOnlineContent