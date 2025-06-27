import { useState, useRef } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import './CSVUploadForm.css';

axios.defaults.withCredentials = true; // Send cookies with every request
axios.defaults.baseURL = "http://localhost:3000/api"; // Backend base URL

const CSVUploadForm = () => {
  const [fileName, setFileName] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const dropRef = useRef(null);

  // ✅ Updated expected headers
  const expectedHeaders = ['name', 'email', 'phone', 'role', 'year'];

  const handleImport = async () => {
    try {
      const response = await axios.post('/maverick/import-mavericks', { data: parsedData }, {
        responseType: 'blob', // for file download
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'credentials.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setFileName(null);
      setParsedData([]);
      setError(null);
      alert('✅ Import successful! Credentials downloaded.');

    } catch (err) {
      console.error('❌ Import error:', err.message);
      alert('❌ Failed to import.');
    }
  };

  const handleFile = (file) => {
    setFileName(file.name);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const headers = results.meta.fields;

        const isValid = expectedHeaders.every(h => headers.includes(h));
        if (!isValid) {
          setError("❌ CSV is missing one or more required columns.");
          setParsedData([]);
          return;
        }

        setParsedData(rows);
      },
      error: (err) => {
        setError("❌ Failed to parse CSV file.");
        console.error(err);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFile(file);
    } else {
      setError("❌ Please upload a valid CSV file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // const handleImport = () => {
  //   console.log("Importing parsed data:", parsedData);
    
  // };

  return (
    <div className="csv-upload">
      <h3>📥 Import via CSV</h3>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={dropRef}
      >
        Drag and drop CSV here or
        <label className="browse-btn">
          Browse
          <input type="file" accept=".csv" onChange={handleBrowse} hidden />
        </label>
      </div>

      {fileName && <p className="file-info">📄 Selected File: {fileName}</p>}
      {error && <p className="error-msg">{error}</p>}

      {parsedData.length > 0 && (
        <div className="preview-table">
          <table>
            <thead>
              <tr>{expectedHeaders.map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {parsedData.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {expectedHeaders.map(h => <td key={h}>{row[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="preview-count">📋 Showing first 5 of {parsedData.length} rows</p>
        </div>
      )}

      <button
        className="upload-btn"
        onClick={handleImport}
        disabled={!parsedData.length}
      >
        Import {parsedData.length ? `(${parsedData.length})` : ""}
      </button>
    </div>
  );
};

export default CSVUploadForm;
