import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../utils/api';
import { 
  Loader2, CheckCircle2, Sparkles, ArrowLeft, FileText, ChevronDown, ChevronUp 
} from 'lucide-react';

const ApplicantsList = () => {
  const { jobId: urlJobId } = useParams();
  const navigate = useNavigate();
  
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // To toggle full summary

  useEffect(() => {
    fetchApplicants();
  }, [urlJobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const endpoint = urlJobId 
        ? `/jobs/${urlJobId}/applicants` 
        : '/jobs/recruiter/all-applicants';
      
      const res = await api.get(endpoint);
      
      if (urlJobId) {
        setApplicants(res.data.applicants || []);
        setJobTitle(res.data.jobTitle);
      } else {
        setApplicants(res.data.applications || []);
        setJobTitle('Global Talent Pool');
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlistToggle = async (app) => {
    const effectiveJobId = urlJobId || app.job?._id || app.job;
    const applicantId = app._id;
    
    if (!effectiveJobId || !applicantId) {
      alert("Error: Missing Job or Applicant ID");
      return;
    }

    const nextStatus = app.status === 'Shortlisted' ? 'Applied' : 'Shortlisted';
    setProcessingId(applicantId);

    try {
      const res = await api.patch(`/jobs/${effectiveJobId}/applicants/${applicantId}`, { 
        status: nextStatus 
      });

      if (res.data.success) {
        setApplicants(prev => prev.map(item => 
          item._id === applicantId ? { ...item, status: nextStatus } : item
        ));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAutoShortlist = async () => {
    const topCandidates = [...applicants]
      .filter(app => app.status !== 'Shortlisted')
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5);

    if (topCandidates.length === 0) return;

    setIsAutoProcessing(true);
    try {
      await Promise.all(
        topCandidates.map(app => {
          const jId = urlJobId || app.job?._id || app.job;
          return api.patch(`/jobs/${jId}/applicants/${app._id}`, { status: 'Shortlisted' });
        })
      );

      const topIds = topCandidates.map(c => c._id);
      setApplicants(prev => prev.map(item => 
        topIds.includes(item._id) ? { ...item, status: 'Shortlisted' } : item
      ));
      alert("Top candidates shortlisted!");
    } catch (err) {
      alert("Shortlisting failed.");
    } finally {
      setIsAutoProcessing(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-start">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-4 text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight">{jobTitle || 'Loading...'}</h1>
            <p className="text-slate-500 font-medium mt-1">{applicants.length} Total Applications</p>
          </div>

          <button
            onClick={handleAutoShortlist}
            disabled={isAutoProcessing || loading || applicants.length === 0}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
          >
            {isAutoProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-yellow-400" />}
            AUTO-SHORTLIST TOP 5
          </button>
        </header>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Resume</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></td></tr>
              ) : applicants.map((app) => (
                <tr key={app._id} className={`transition-colors ${app.status === 'Shortlisted' ? 'bg-green-50/40' : 'hover:bg-slate-50/30'}`}>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg uppercase">
                        {app.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{app.user?.name}</p>
                        <p className="text-sm text-slate-400 font-medium">{app.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2 max-w-md">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black w-fit ${app.aiScore > 80 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        <Sparkles size={12} /> {app.aiScore}% Match
                      </span>
                      
                      {/* Summary with Toggle for Full View */}
                      <div className="group cursor-pointer" onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
                        <p className={`text-[12px] text-slate-600 font-medium leading-relaxed ${expandedId === app._id ? '' : 'line-clamp-2'}`}>
                          {app.aiSummary || "Analysis summary pending..."}
                        </p>
                        <button className="text-[10px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                          {expandedId === app._id ? <><ChevronUp size={12}/> Show Less</> : <><ChevronDown size={12}/> Read Full Summary</>}
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-8 text-center">
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200">
                      <FileText size={14} /> VIEW PDF
                    </a>
                  </td>

                  <td className="px-8 py-8 text-right">
                    <button 
                      onClick={() => handleShortlistToggle(app)}
                      disabled={processingId === app._id}
                      className={`p-3 rounded-xl border transition-all ${
                        app.status === 'Shortlisted'
                        ? 'bg-green-600 border-green-600 text-white shadow-lg'
                        : 'bg-white border-slate-200 text-slate-300 hover:text-green-600 hover:border-green-600'
                      }`}
                    >
                      {processingId === app._id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ApplicantsList;