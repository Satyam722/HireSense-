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
  Award
} from 'lucide-react';

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [data, setData] = useState({ jobTitle: '', applicants: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}/applicants`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicantId, newStatus) => {
    setUpdating(applicantId);
    try {
      await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, { status: newStatus });
      
      // Update local state to reflect change
      setData(prev => ({
        ...prev,
        applicants: prev.applicants.map(app => 
          app._id === applicantId ? { ...app, status: newStatus } : app
        )
      }));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
          <p className="font-medium">Loading Applicant Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-4 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{data.jobTitle}</h1>
          <p className="text-slate-500">Reviewing {data.applicants.length} total candidates</p>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">AI Match Score</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.applicants.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{app.user?.name || "Applicant"}</p>
                    <p className="text-xs text-slate-500">{app.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-50 flex items-center justify-center relative">
                        <span className="text-xs font-black text-blue-700">{app.aiScore}%</span>
                      </div>
                      {app.aiScore >= 80 && <Award className="text-yellow-500" size={18} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-md transition"
                    >
                      <FileText size={16} />
                      View PDF
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {app.status === 'Shortlisted' ? (
                        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                          <CheckCircle size={16} /> Shortlisted
                        </span>
                      ) : app.status === 'Rejected' ? (
                        <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                          <XCircle size={16} /> Rejected
                        </span>
                      ) : (
                        <>
                          <button 
                            disabled={updating === app._id}
                            onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Shortlist"
                          >
                            <CheckCircle size={22} />
                          </button>
                          <button 
                            disabled={updating === app._id}
                            onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle size={22} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.applicants.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p>No applications received yet for this position.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewApplicants;