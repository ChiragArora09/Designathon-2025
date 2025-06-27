import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './BatchList.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LearningPathModal from '../learningPath/LearningPathModal';

axios.defaults.withCredentials = true; // Send cookies with every request
axios.defaults.baseURL = "http://localhost:3000/api"; // Backend base URL

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState([]);

  const handleView = async (batchId) => {
    const res = await axios.get(`/batch/${batchId}/learning-path`);
    console.log(res)
    setSelectedPath(res.data);
    setShowModal(true);
  };

  const navigate = useNavigate()

  const handleAssignClick = (batch) => {
    navigate('/admin-dashboard/batch/assign-mavericks', {
      state: {
        batchId: batch.id,
        phaseType: batch.phase,
      }
    });
  };

  useEffect(() => {
    axios.get('/batch/get-all')  // Adjust to your actual endpoint
      .then(res => setBatches(res.data))
      .catch(err => console.error("Error fetching batches", err));
  }, []);

  const filtered = batches.filter(batch =>
    batch.name.toLowerCase().includes(search.toLowerCase()) &&
    (skillFilter ? batch.skill === skillFilter : true) &&
    (phaseFilter ? batch.phase === phaseFilter : true)
  );

  return (
    <div className="batch-list-container">
      <div className="header">
        <h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          </button>
          All Batches
        </h2>
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Search by batch name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="">All Skills</option>
            <option value="Java">Java</option>
            <option value="Frontend">Frontend</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
          <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
            <option value="">All Phases</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
          </select>
        </div>
      </div>

      <table className="batch-table">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Skill</th>
            <th>Phase</th>
            <th>Start Date</th>
            <th>Year</th>
            <th>Duration</th>
            <th>Learning Path</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(batch => (
              <tr key={batch.id}>
                <td>{batch.name}</td>
                <td>{batch.skill}</td>
                <td>{batch.phase}</td>
                <td>{batch.start_date?.split('T')[0]}</td>
                <td>{batch.year}</td>
                <td>{batch.duration} days</td>
                <td>
                  <button className="view-btn" onClick={() => handleView(batch.id)}>
                    View
                  </button>
                </td>
                <td>
                  <button className="assign-btn" onClick={() => handleAssignClick(batch)}>
                    Assign Mavericks
                  </button>
                </td>
                <LearningPathModal
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  data={selectedPath}
                />
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-results">No batches found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BatchList;
