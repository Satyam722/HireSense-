import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Sidebar from '../../components/layout/Sidebar'; 
import { Briefcase, MapPin, DollarSign, FileText, Plus, X, Sparkles } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time', // Changed from 'type' to 'jobType' to match backend
    salary: '',
    description: '',
    tags: [] 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Payload mapping to match Schema exactly
    const payload = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      jobType: formData.jobType, // Matches controller
      salary: formData.salary,
      description: formData.description,
      requirements: formData.tags 
    };

    try {
      // Hits http://localhost:5000/api/jobs
      await api.post('/jobs', payload);
      alert("Job Published Successfully!");
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Error posting job:", err);
      // Alert the specific error from the backend if available
      alert(err.response?.data?.message || "Connection refused. Is your backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <Sparkles size={12} /> Recruiter Portal
              </div>
              <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter">Post a New Role</h1>
              <p className="text-slate-500 font-medium">Define your role to activate the neural matching engine.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-black text-slate-900 flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                  <Briefcase size={16} className="text-blue-600" /> Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Job Title</label>
                    <input name="title" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Senior Frontend Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                    <input name="company" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Acme Inc." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                      <input name="location" required onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Remote / NY" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Job Type</label>
                    <select name="jobType" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Salary Range</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-4 text-slate-400" />
                      <input name="salary" required onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="$120k - $150k" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-black text-slate-900 flex items-center gap-2 mb-2 uppercase text-xs tracking-widest">
                  <FileText size={16} className="text-blue-600" /> Job Requirements
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Key Skills (Press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100">
                        {tag} <X size={14} className="cursor-pointer hover:scale-110" onClick={() => removeTag(tag)} />
                      </span>
                    ))}
                  </div>
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                    placeholder="Add skills like React, Node.js, AWS..." 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                  <textarea name="description" required onChange={handleChange} rows="6" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Describe the mission and responsibilities..."></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Optimizing with AI..." : "Publish Job Posting"}
              </button>
            </form>
          </div>

          <div className="hidden lg:block w-80">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Live Preview</p>
                <h4 className="font-black text-xl text-slate-900 truncate">{formData.title || "Position Title"}</h4>
                <p className="text-slate-500 text-sm font-bold mb-4">{formData.company || "Company Name"}</p>
                <div className="space-y-2 mb-6 text-slate-400 text-xs font-bold">
                  <div className="flex items-center gap-2"><MapPin size={14} /> {formData.location || "City, Country"}</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} /> {formData.salary || "Competitive Salary"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostJob;