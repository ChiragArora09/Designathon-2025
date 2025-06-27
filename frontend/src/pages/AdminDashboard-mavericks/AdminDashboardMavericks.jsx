import { useNavigate } from "react-router-dom";
import "./AdminDashboardMavericks.css"

const AdminDashboardMavericks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mavericks-container">
      <h2 className="mavericks-title">Mavericks Management</h2>

      <div className="card-grid">
        <div className="maverick-card">
          <h3>📤 Add Mavericks</h3>
          <p>Upload a CSV file or add manually to add new mavericks to the system.</p>
          <button onClick={() => navigate('/admin-dashboard/mavericks/import')} >Add </button>
        </div>

        <div className="maverick-card">
          <h3>🏷️ Assign to Batch</h3>
          <p>Group Mavericks into skill-based batches for onboarding.</p>
          <button>Assign Batch</button>
        </div>

        <div className="maverick-card">
          <h3>👥 View Mavericks</h3>
          <p>Search, filter, and manage all current mavericks in the system.</p>
          <button>View List</button>
        </div>
      </div>

      <div className="future-features">
        <h4>Coming Soon:</h4>
        <ul>
          <li>🧠 AI Suggestions for Skill Grouping</li>
          <li>📈 Progress Summary Snapshot</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboardMavericks