import React, { useState } from 'react';
import api from '../../utils/api';
import { MapPin, DollarSign, Zap, CheckCircle, Upload } from 'lucide-react';

const JobCard = ({ job }) => {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [score, setScore] = useState(null);

  const handleApply = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await api.post('/applications/apply', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setApplied(true);
      setScore(res.data.score);
      alert(`Applied! AI Match Score: ${res.data.score}%`);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p className="text-blue-600 mb-4">{job.company}</p>
      
      <div className="flex gap-4 text-sm text-slate-500 mb-6">
        <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
        <span className="flex items-center gap-1"><DollarSign size={16}/> {job.salary}</span>
      </div>

      <div className="flex items-center justify-between">
        {applied ? (
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle size={20}/> AI Match: {score}%
          </div>
        ) : (
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            {loading ? "Analyzing..." : "Apply"}
            <input type="file" className="hidden" accept=".pdf" onChange={handleApply} disabled={loading} />
          </label>
        )}
      </div>
    </div>
  );
};

export default JobCard;