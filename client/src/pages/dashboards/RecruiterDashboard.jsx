import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Briefcase, Users, UserCheck, PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user, loading: authLoading } = useAuth(); // Get auth loading state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch jobs if we have a user
    if (user) {
      const fetchMyJobs = async () => {
        try {
          const response = await api.get('/jobs/my/posted-jobs');
          setJobs(response.data);
        } catch (err) {
          console.error("Error loading dashboard jobs:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMyJobs();
    }
  }, [user]);

  // DELETE HANDLER
  const handleDeleteJob = async (jobId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will remove all applicant data.`)) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  // 1. CALCULATE REAL STATS
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0);
  
  const totalShortlisted = jobs.reduce((acc, job) => {
    const shortlistedCount = job.applicants?.filter(app => app.status === 'Shortlisted').length || 0;
    return acc + shortlistedCount;
  }, 0);

  const stats = [
    { label: 'Active Jobs', value: jobs.length, icon: <Briefcase className="text-blue-600"/>, bg: 'bg-blue-50' },
    { label: 'Total Applicants', value: totalApplicants, icon: <Users className="text-purple-600"/>, bg: 'bg-purple-50' },
    { label: 'Shortlisted', value: totalShortlisted, icon: <UserCheck className="text-green-600"/>, bg: 'bg-green-50' },
  ];

  // SAFETY GUARD: If Auth is still loading or user isn't found yet, show a full-screen loader
  if (authLoading || (!user && loading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-bold tracking-tight">Securing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recruiter Console</h1>
            <p className="text-slate-500 text-sm tracking-tight">
              Welcome back, <span className="text-blue-600 font-bold">{user?.name}</span>. Manage your hiring pipeline.
            </p>
          </div>
          <Link to="/post-job" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <PlusCircle size={20} />
            Post New Job
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Jobs Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Your Active Postings</h3>
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Neural Engine Active</span>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="font-medium">Syncing with HireSense Neural Engine...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="mx-auto text-slate-200 mb-2" size={48} />
                <p className="text-slate-500 font-medium">No jobs posted yet. Click "Post New Job" to start.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Candidates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{job.title}</p>
                        <p className="text-xs text-slate-500">{job.location}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {job.applicants?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-4">
                        <Link to={`/jobs/${job._id}/applicants`} className="text-blue-600 hover:text-blue-800 font-black text-sm transition-colors">
                          View Rankings
                        </Link>
                        <button 
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;