import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  FileText,
  Loader2,
  Mail,
  User as UserIcon,
  Sparkles,
  Info
} from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [data, setData] = useState({ jobTitle: '', applicants: [] });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}/applicants`);
        if (response.data.applicants) {
          setData(response.data);
        } else {
          setData({ jobTitle: 'Job Applications', applicants: response.data });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicantId, newStatus) => {
    setUpdatingId(applicantId);
    try {
      await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, { status: newStatus });
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(app => 
          app._id === applicantId ? { ...app, status: newStatus } : app
        )
      }));
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openResume = (url) => {
    if (!url || url === "undefined") {
      alert("Resume link not found for this candidate.");
      return;
    }
    const absoluteUrl = url.startsWith('http') ? url : `https://${url}`;
    const link = document.createElement('a');
    link.href = absoluteUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
          <p className="text-slate-500 font-medium">Analyzing Candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-4 text-sm font-bold">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{data.jobTitle || "Applicants List"}</h1>
              <p className="text-slate-500 font-medium">Reviewing {data.applicants.length} Total Applications</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-black">
                <th className="px-8 py-5">Candidate Details</th>
                <th className="px-8 py-5 text-center">AI Match Analysis</th>
                <th className="px-8 py-5">Resume</th>
                <th className="px-8 py-5 text-center">Hiring Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.applicants.length > 0 ? data.applicants.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Candidate Info */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{app.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <Mail size={14} /> {app.user?.email || "No email available"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AI SCORE & SUMMARY */}
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-blue-500" />
                        <span className={`inline-block px-4 py-1 rounded-full font-black text-sm ${
                          app.aiScore >= 80 ? 'bg-green-100 text-green-700' : 
                          app.aiScore >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.aiScore}% Match
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex gap-2">
                        <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] leading-relaxed text-slate-600 font-medium italic">
                          {app.aiSummary || "No AI summary available for this applicant."}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* RESUME LINK */}
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => openResume(app.resumeUrl)}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-md active:scale-95"
                    >
                      <FileText size={14} /> View PDF <ExternalLink size={12} />
                    </button>
                  </td>

                  {/* HIRING ACTIONS */}
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                      {app.status === 'Shortlisted' ? (
                        <div className="flex items-center gap-1 text-green-600 font-black text-xs uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                          <CheckCircle size={14} /> Shortlisted
                        </div>
                      ) : app.status === 'Rejected' ? (
                        <div className="flex items-center gap-1 text-red-600 font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                          <XCircle size={14} /> Rejected
                        </div>
                      ) : (
                        <>
                          <button 
                            disabled={updatingId === app._id}
                            onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                            title="Shortlist Candidate"
                            className="text-slate-400 hover:text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={22} />
                          </button>
                          <button 
                            disabled={updatingId === app._id}
                            onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                            title="Reject Candidate"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle size={22} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">
                    No applications have been submitted for this role yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default JobApplicants;