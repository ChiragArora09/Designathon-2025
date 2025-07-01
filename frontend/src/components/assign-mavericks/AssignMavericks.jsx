import { useEffect, useState } from "react";
import axios from "axios";
import "./AssignMavericks.css";
import { useLocation } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const AssignMavericks = () => {
  const [batches, setBatches] = useState([]);
  const [mavericks, setMavericks] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMavericks, setSelectedMavericks] = useState([]);
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000/api";

  const location = useLocation();
  const { batchId, phaseType } = location.state || {};

  useEffect(() => {
    if (batchId && phaseType) {
      fetchData(phaseType);
    }
  }, [batchId, phaseType]);

  const fetchData = async (phaseType) => {
    try {
      const [mavRes, batchRes] = await Promise.all([
        axios.get("/maverick/unassigned", { params: { phaseType } }),
        axios.get("/batch/get-all")
      ]);
      console.log(mavRes)
      console.log(batchRes)
      setMavericks(mavRes.data || []);
      setBatches(batchRes.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch data", err);
    }
  };

  const toggleMaverick = (id) => {
    setSelectedMavericks((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedBatch || selectedMavericks.length === 0) {
      return alert("Please select a batch and at least one maverick.");
    }
    setLoading(true);
    try {
      await axios.post("/assign-batches", {
        batchId: selectedBatch,
        maverickIds: selectedMavericks
      });
      alert("✅ Assigned successfully!");
      setSelectedMavericks([]);
      fetchData(phaseType);
    } catch (err) {
      console.error(err);
      alert("❌ Assignment failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssign = async () => {
    setLoading(true);
    try {
      await axios.post("/auto-assign-ai");
      alert("✅ AI-based assignment complete!");
      fetchData(phaseType);
    } catch (err) {
      console.error(err);
      alert("❌ AI assignment failed.");
    }
    setLoading(false);
  };

  return (
    <div className="assign-container">
      <div className="batch-panel">
        <h3>📋 Available Batches</h3>
        {batches.map((batch) => (
          <div
            key={batch.id}
            className={`batch-card ${selectedBatch === batch.id ? "active" : ""}`}
            onClick={() => setSelectedBatch(batch.id)}
          >
            <h5 className="batch-header">{batch.name}</h5>
            <p className="batch-info">{batch.phase}</p>
            <p className="batch-info"><strong>Skill:</strong> {batch.skill}</p>
            <p className="batch-info"><strong>Starts</strong> {new Date(batch.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        ))}
      </div>

      <div className="maverick-panel">
        <div className="panel-header">
          <h3>🧑‍🎓 Mavericks List</h3>
          <div>
            <button onClick={handleAssign} disabled={loading || !selectedBatch}>
              Assign Selected
            </button>
            <button className="ai-btn" onClick={handleAIAssign} disabled={loading}>
              <FaRobot /> Auto Assign via AI
            </button>
          </div>
        </div>

        {mavericks.length === 0 ? (
          <p>🎉 All Mavericks are assigned!</p>
        ) : (
          <table className="maverick-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Role</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {mavericks.map((mav) => (
                <tr key={mav.id} className={selectedMavericks.includes(mav.id) ? "selected" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMavericks.includes(mav.id)}
                      onChange={() => toggleMaverick(mav.id)}
                    />
                  </td>
                  <td>{mav.full_name}</td>
                  <td>{mav.role}</td>
                  <td>{mav.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssignMavericks;
