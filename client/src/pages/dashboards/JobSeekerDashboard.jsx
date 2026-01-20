import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import ResumeUpload from '../../components/profile/ResumeUpload'; // Import your new component
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, Star, Send } from 'lucide-react';


const JobSeekerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Applications', value: '12', icon: <Send className="text-blue-600"/>, bg: 'bg-blue-50' },
    { label: 'Interviews', value: '3', icon: <Clock className="text-yellow-600"/>, bg: 'bg-yellow-50' },
    { label: 'AI Match Score', value: '84%', icon: <Star className="text-purple-600"/>, bg: 'bg-purple-50' },
    { label: 'Offers', value: '1', icon: <CheckCircle className="text-green-600"/>, bg: 'bg-green-50' },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-500 text-sm">Here is what's happening with your job search today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {/* Real Resume Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <ResumeUpload /> {/* Replacing the placeholder with the functional component */}
          </div>
          
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden flex items-center">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3 text-white">Unlock AI Matching</h2>
              <p className="text-blue-100 mb-0 max-w-md leading-relaxed">
                Once you upload your resume, our AI will automatically compare your skills with every job posting to give you a real-time compatibility score.
              </p>
            </div>
            {/* Decorative element */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-white skew-x-12 translate-x-20"></div>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-medium text-slate-700">Google</td>
                <td className="px-6 py-4 text-slate-600">Senior UX Designer</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>
                </td>
                <td className="px-6 py-4 font-bold text-blue-600">92%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;