import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import JobCard from '../components/jobs/JobCard';
import { Search, Briefcase, ChevronRight, RefreshCw } from 'lucide-react';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  // New state for Work Mode filters
  const [workMode, setWorkMode] = useState({ remote: false, onsite: false });

  // Function to fetch jobs - separated so we can call it manually if needed
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      const jobData = res.data.jobs || res.data;
      setJobs(Array.isArray(jobData) ? jobData : []); 
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Multi-Filter Logic
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || job.category === activeCategory;
    
    // Work Mode Filter Logic
    const noWorkModeSelected = !workMode.remote && !workMode.onsite;
    const matchesRemote = workMode.remote && job.workMode?.toLowerCase() === 'remote';
    const matchesOnsite = workMode.onsite && job.workMode?.toLowerCase() === 'on-site';
    const matchesWorkMode = noWorkModeSelected || matchesRemote || matchesOnsite;

    return matchesSearch && matchesCategory && matchesWorkMode;
  }) || [];

  const handleWorkModeChange = (mode) => {
    setWorkMode(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR: Naukri-Style Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-600" /> Filters
            </h3>

            <div className="space-y-6">
              {/* Category Filter Group */}
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Department</p>
                <div className="space-y-2">
                  {['All', 'Tech', 'Sales', 'Marketing', 'HR'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeCategory === cat ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                      {activeCategory === cat && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode Filter Group */}
              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Work Mode</p>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-600 mb-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={workMode.remote}
                    onChange={() => handleWorkModeChange('remote')}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  /> 
                  <span className="group-hover:text-blue-600 transition-colors">Remote</span>
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-600 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={workMode.onsite}
                    onChange={() => handleWorkModeChange('onsite')}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  /> 
                  <span className="group-hover:text-blue-600 transition-colors">On-site</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Job List */}
        <main className="flex-1">
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by role or company..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Manual Refresh Button for HR Updates */}
            <button 
              onClick={fetchJobs}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              title="Refresh Jobs"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-500 text-sm font-bold">
              Showing <span className="text-slate-900">{filteredJobs.length}</span> jobs
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-[32px]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListing;