import React, { useState } from 'react';
import api from '../../utils/api';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file first");
    
    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      // This matches your backend route for profile updates
      const res = await api.put('/auth/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      alert("Resume uploaded and analyzed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText className="text-blue-600" /> Resume Profile
      </h3>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="hidden" 
          id="resume-input" 
        />
        <label htmlFor="resume-input" className="cursor-pointer">
          <Upload className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="text-sm text-slate-600">
            {file ? file.name : "Click to upload your Resume (PDF)"}
          </p>
        </label>
      </div>
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
        {uploading ? "Uploading..." : "Upload & Analyze"}
      </button>
      {success && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={14}/> Resume Active</p>}
    </div>
  );
};

export default ResumeUpload;