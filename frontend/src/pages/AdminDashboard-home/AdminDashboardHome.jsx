import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboardHome.css'

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const { username } = useAuth()

  return (
    <div className="dashboard-home">
      <h2 className="dashboard-title">Welcome, {username} 👋</h2>

      <div className="metric-cards">
        <div className="metric-card">
          <h4>Total Mavericks</h4>
          <p>152</p>
        </div>
        <div className="metric-card">
          <h4>Active Batches</h4>
          <p>12</p>
        </div>
        <div className="metric-card">
          <h4>Quizzes Today</h4>
          <p>9</p>
        </div>
        <div className="metric-card">
          <h4>Pending Reports</h4>
          <p>4</p>
        </div>
        <div className="metric-card">
          <h4>Inactive Users</h4>
          <p>7</p>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button onClick={() => navigate('/admin-dashboard/mavericks/import')}>📤 Import Mavericks</button>
          <button onClick={() => navigate('/admin-dashboard/batches/add')} >➕ Create Batch</button>
          <button>🧠 Generate Path</button>
          <button>🧾 Assign Quiz</button>
        </div>
      </div>

      <div className="activity-feed">
        <h3>Recent Activity</h3>
        <ul>
          <li><strong>2 mins ago:</strong> Quiz assigned to Batch A</li>
          <li><strong>10 mins ago:</strong> Report downloaded for Rohan</li>
          <li><strong>1 hour ago:</strong> Batch "Frontend-101" created</li>
          <li><strong>Today:</strong> AI Learning Path generated for Backend group</li>
        </ul>
      </div>

      <div className="progress-snapshot">
        <h3>Progress Snapshot</h3>
        <div className="progress-placeholder">[Progress Chart Placeholder]</div>
      </div>

      <div className="alerts-section">
        <h3>Alerts & Suggestions</h3>
        <ul>
          <li>⚠️ 5 users idle for 3+ days</li>
          <li>❗ Batch "UI/UX-101" missed Topic 3 deadline</li>
          <li>💡 AI Suggestion: Assign reinforcement quiz to Backend-101</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboardHome