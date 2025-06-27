import { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignMavericks.css';
import { useLocation } from 'react-router-dom';

const AssignMavericks = () => {
  const [mavericks, setMavericks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedMavericks, setSelectedMavericks] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { batchId, phaseType } = location.state || {};

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000/api";

  useEffect(() => {
    if (batchId) {
      setSelectedBatch(batchId);
    }

    fetchBatches();
    fetchMavericks();
  }, [batchId, phaseType]);

  const fetchBatches = async () => {
    console.log("Inside fetch batches")
    try {
      const res = await axios.get('/batch/get-all');
      setBatches(res.data);
    } catch (err) {
      console.error("❌ Failed to load batches", err);
    }
  };

  const fetchMavericks = async () => {
    try {
      const res = await axios.get('/maverick/unassigned', {
        params: { phaseType }
      });
      console.log(res)
      setMavericks(res.data);
    } catch (err) {
      console.error("❌ Failed to load mavericks", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedMavericks((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedBatch || selectedMavericks.length === 0) {
      return alert("Select a batch and at least one maverick.");
    }
    setLoading(true);
    try {
      await axios.post('/assign-batches', {
        batchId: selectedBatch,
        maverickIds: selectedMavericks
      });
      alert("✅ Mavericks assigned successfully!");
      fetchMavericks();
      setSelectedMavericks([]);
    } catch (err) {
      console.error(err);
      alert("❌ Error assigning mavericks.");
    }
    setLoading(false);
  };

  const handleAIAssign = async () => {
    setLoading(true);
    try {
      await axios.post('/auto-assign-ai');
      alert("✅ AI batch assignment complete!");
      fetchMavericks();
    } catch (err) {
      console.error(err);
      alert("❌ AI assignment failed.");
    }
    setLoading(false);
  };

  return (
    <div className="assign-mavericks">
      <h2>🎯 Assign Mavericks to Batches</h2>

      <div className="batch-select">
        <label>Select Batch:</label>
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">-- Choose Batch --</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <button onClick={handleAssign} disabled={loading}>Assign Selected</button>
        <button onClick={handleAIAssign} className="ai-btn" disabled={loading}>🤖 Auto Assign via AI</button>
      </div>

      <div className="maverick-list">
        {mavericks.map((mav) => (
          <div
            key={mav.id}
            className={`maverick-item ${selectedMavericks.includes(mav.id) ? 'selected' : ''}`}
            onClick={() => toggleSelect(mav.id)}
          >
            <p><strong>{mav.full_name}</strong> ({mav.role}, {mav.year})</p>
          </div>
        ))}
        {mavericks.length === 0 && <p>🎉 All mavericks are assigned or not eligible!</p>}
      </div>
    </div>
  );
};

export default AssignMavericks;
