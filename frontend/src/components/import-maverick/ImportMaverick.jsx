import CSVUploadForm from '../csv-upload-form/CSVUploadForm';
import ManualMaverickForm from '../manual-upload-form/ManualMaverickForm';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './ImportMaverick.css';

const ImportMavericks = () => {
  const navigate = useNavigate();

  return (
    <div className="import-page">
      {/* 🔹 Header with Back Button and Title */}
      <div className="import-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2>Import Mavericks</h2>
      </div>

      {/* 🔹 Split Layout */}
      <div className="import-container">
        <div className="import-left">
          <CSVUploadForm />
        </div>
        <div className="import-right">
          <ManualMaverickForm />
        </div>
      </div>
    </div>
  );
};

export default ImportMavericks;
