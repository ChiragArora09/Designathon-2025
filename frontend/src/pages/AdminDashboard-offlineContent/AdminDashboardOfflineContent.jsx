import './AdminDashboardOfflineContent.css'

const AdminDashboardOfflineContent = () => {
  return (
    <div className="section-container">
      <h2 className="section-title">OfflineContent</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>🧑🏻‍🏫 Add Session</h3>
          <p>Create trainer sessions linked to topics.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📄 Add Assignments</h3>
          <p>Record offline assignment details.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📁 Upload Resources</h3>
          <p>Attach PDFs/Notes for trainer use.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardOfflineContent