import './AdminDashboardProgress.css'

const AdminDashboardProgress = () => {
  return (
    <div className="section-container">
      <h2 className="section-title">Progress</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>📈 Track Progress</h3>
          <p>See user topic-wise progress.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>🛑 Detect Inactivity</h3>
          <p>Flag idle or low-performance learners.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>🧠 AI Suggestions</h3>
          <p>See automated improvement recommendations.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardProgress