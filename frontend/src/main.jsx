import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';

// Import Components
import App from './App.jsx';
import GlassSurface from './components/GlassSurface';
import ShinyText from './components/ShinyText';

// Import CSS
import './index.css';
import './components/GlassSurface.css';
import './components/ShinyText.css';

// --- Page 1: The Uploader ---
function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(file.name);
      setMessageType('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      setMessageType('error');
      return;
    }
    setIsUploading(true);
    setMessage('Uploading...');
    setMessageType('');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-document/', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'File upload failed');
      }
      await response.json();
      setMessage(`Upload successful!`);
      setMessageType('success');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GlassSurface width="clamp(300px, 80vw, 550px)" height="auto" borderRadius={24}>
      <div className="uploader-content">
        <ShinyText text="Upload Document" speed={4} className="main-title" />
        <p className="subtitle">Select a file and click upload.</p>
        <input type="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} className="file-input-hidden" disabled={isUploading} />
        <label htmlFor="file-upload" className="file-input-label">Choose File</label>
        <button onClick={handleUpload} className="upload-button" disabled={isUploading || !selectedFile}>
          {isUploading ? <div className="loader"></div> : 'Upload File'}
        </button>
        {message && <p className={`status-message ${messageType}`}>{message}</p>}
      </div>
    </GlassSurface>
  );
}

// --- Page 2: The File History ---
function FileHistory() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/files/');
        if (!response.ok) throw new Error('Failed to fetch files.');
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${['Bytes', 'KB', 'MB', 'GB'][i]}`;
  };

  return (
    <GlassSurface width="clamp(500px, 90vw, 1000px)" height="auto" borderRadius={24}>
      <div className="history-content">
        <h2>File Upload History</h2>
        <Link to="/" className="nav-link">← Back to Uploader</Link>
        {loading && <p>Loading history...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Original Filename</th><th>File Size</th><th>Uploaded At</th></tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file) => (
                    <tr key={file.id}>
                      <td data-label="Filename">{file.original_filename}</td>
                      <td data-label="Size">{formatSize(file.file_size_bytes)}</td>
                      <td data-label="Uploaded At">{formatDate(file.uploaded_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No files have been uploaded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GlassSurface>
  );
}

// --- The Router ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The layout with the background
    children: [
      { index: true, element: <UploadPage /> },
      { path: 'history', element: <FileHistory /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);