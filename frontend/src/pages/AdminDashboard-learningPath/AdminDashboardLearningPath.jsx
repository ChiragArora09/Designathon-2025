import './AdminDashboardLearningPath.css'

const AdminDashboardLearningPath = () => {
  return (
    <div className="section-container">
      <h2 className="section-title">Learning Paths</h2>

      <div className="card-grid">

        <div className="section-card">
          <h3>🧠 Generate Path</h3>
          <p>Use AI to create learning paths per skill.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📝 Edit Topics</h3>
          <p>Customize or modify day-wise topics.</p>
          <button>Go</button>
        </div>

        <div className="section-card">
          <h3>📚 Assign Path to Batch</h3>
          <p>Link a learning path with a batch.</p>
          <button>Go</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardLearningPath