import { useNavigate } from 'react-router-dom';
import './AdminDashboardBatches.css'

const AdminDashboardBatches = () => {
  const navigate = useNavigate()

    return (
    <div className="section-container">
      <h2 className="section-title">Batches</h2>

      <div className="card-grid">
        
        <div className="section-card">
          <h3>📄 View All Batches</h3>
          <p>List and manage all created batches.</p>
          <button onClick={() => navigate('/admin-dashboard/batches/all')}>View</button>
        </div>

        <div className="section-card">
          <h3>📦 Create Batch</h3>
          <p>Add new batches with skills and activities.</p>
          <button onClick={() => navigate('/admin-dashboard/batches/add')}>Create</button>
        </div>

        <div className="section-card">
          <h3>👥 Assign Mavericks</h3>
          <p>Group freshers into batches by skill.</p>
          <button onClick={() => navigate('/admin-dashboard/batches/all')}>Assign</button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardBatches