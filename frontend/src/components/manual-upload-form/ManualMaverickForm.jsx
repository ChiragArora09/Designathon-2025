import { useState } from 'react';
import axios from 'axios';
import './ManualMaverickForm.css';

const ManualMaverickForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skill: '',
    phone: '',
    year: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/add-maverick', formData, {
        responseType: 'blob' // Receive downloadable file
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'credentials.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();

      alert("✅ Maverick added successfully!");
      setFormData({ name: '', email: '', skill: '', phone: '', year: '' });
    } catch (err) {
      console.error('❌ Error:', err.message);
      alert("❌ Failed to add Maverick.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manual-form">
      <h3>👤 Add Maverick Manually</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="skill" placeholder="Skill" value={formData.skill} onChange={handleChange} />
        <input name="year" placeholder="Year" value={formData.year} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Maverick"}
        </button>
      </form>
    </div>
  );
};

export default ManualMaverickForm;
