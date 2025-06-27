import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './CreateBatchWithLearningPath.css';

axios.defaults.withCredentials = true; // Send cookies with every request
axios.defaults.baseURL = "http://localhost:3000/api"; // Backend base URL

const CreateBatchWithLearningPath = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([
    {
      name: '',
      skill: '',
      phase: 'Phase 1 - Softskills',
      topics: '',
      startDate: '',
      year: '',
      duration: '',
      batchCount: 1
    }
  ]);

  const handleChange = (index, e) => {
    const updated = [...batches];
    const { name, value } = e.target;

    // Ensure batchCount is always numeric
    updated[index][name] = name === "batchCount" ? parseInt(value) : value;
    setBatches(updated);
  };

  const addBatchForm = () => {
    setBatches([
      ...batches,
      {
        name: '',
        skill: '',
        phase: 'Phase 1 - Softskills',
        topics: '',
        startDate: '',
        year: '',
        duration: '',
        batchCount: 1
      }
    ]);
  };

  const deleteBatchForm = (index) => {
    const updated = batches.filter((_, i) => i !== index);
    setBatches(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/batch/create-batches-learning-paths', { batches });
      alert('✅ Batches created successfully!');
      console.log(res)
      navigate('/admin-dashboard/batches/all');
    } catch (err) {
      console.error('❌ Error:', err.message);
      alert('Failed to create batches.');
    }
  };

  return (
    <div className="create-batch-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2>📘 Create Batch</h2>
      </div>
        <p>A complete learning path will be generated for each batch.</p>

      <form onSubmit={handleSubmit}>
        {batches.map((batch, index) => (
          <div key={index} className="batch-form-card">
            <div className="card-header">
              <h4>Batch-type {index + 1}</h4>
              {index > 0 && (
                <button type="button" className="delete-btn" onClick={() => deleteBatchForm(index)}>
                  <FaTrash />
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Number of Batches for this particular type:</label>
              <input
                type="number"
                name="batchCount"
                min="1"
                value={batch.batchCount}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Name of the Batch, eg. Java & Angular</label>
              <input
                type="text"
                name="name"
                placeholder="Batch Name"
                value={batch.name}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Skill, eg. Full stack web development</label>
              <input
                type="text"
                name="skill"
                placeholder="Skill"
                value={batch.skill}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phase</label>
              <select
                name="phase"
                value={batch.phase}
                onChange={(e) => handleChange(index, e)}
                required
              >
                <option value="Phase 1 - Softskills">Phase 1 - Softskills</option>
                <option value="Phase 1 - Technical">Phase 1 - Technical</option>
                <option value="Phase 2 - Softskills">Phase 2 - Softskills</option>
                <option value="Phase 2 - Role-specific">Phase 2 - Role-specific</option>
              </select>
            </div>

            <div className="form-group">
              <label>Topics to be covered</label>
              <textarea
                name="topics"
                placeholder="Keywords (comma-separated)"
                value={batch.topics}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={batch.startDate}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (in days)</label>
              <input
                type="number"
                name="duration"
                placeholder="Duration"
                value={batch.duration}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>

            <div className="form-group">
              <label>Year</label>
              <select
                name="year"
                value={batch.year}
                onChange={(e) => handleChange(index, e)}
                required
              >
                <option value="">Select Year</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
                <option value="2031">2031</option>
                <option value="2032">2032</option>
                <option value="2033">2033</option>
              </select>
            </div>

          </div>
        ))}

        <button type="button" className="add-btn" onClick={addBatchForm}>
          ➕ Add Another Batch
        </button>

        <button type="submit" className="submit-btn">🚀 Create Batches</button>
      </form>
    </div>
  );
};

export default CreateBatchWithLearningPath;
