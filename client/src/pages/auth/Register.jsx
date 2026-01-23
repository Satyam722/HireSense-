import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  User, Briefcase, Lock, Mail, 
  ArrowRight, Loader2, ShieldCheck 
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Double-click protection: Prevent multiple API calls
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/register', formData);
      
      if (res.data.success || res.status === 201 || res.status === 200) {
        // 2. CRITICAL: Update Auth Context first
        // Make sure your login function sets localStorage.setItem('token', ...)
        await login(res.data.user, res.data.token);
        
        // 3. Clear form and redirect
        setFormData({ name: '', email: '', password: '', role: 'jobseeker' });
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      // If we get "User already exists" but it was a fresh sign-up, 
      // it means the first hidden request actually worked.
      setError(err.response?.data?.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Icon-Only Logo */}
      <div className="mb-10">
        <div className="w-12 h-12 bg-[#2563eb] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
          <ShieldCheck className="text-white" size={24} />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white border border-slate-100 rounded-[40px] shadow-sm p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-xs font-medium">Join the next generation of recruitment.</p>
        </div>

        {/* Error Message UI */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-[11px] font-bold border border-red-100 flex items-center gap-2">
            <div className="w-1 h-1 bg-red-600 rounded-full" />
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          
          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'jobseeker' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400'
              }`}
            >
              <User size={14} /> Job Seeker
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setFormData({ ...formData, role: 'recruiter' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'recruiter' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400'
              }`}
            >
              <Briefcase size={14} /> Recruiter
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                autoComplete="new-name"
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
                placeholder="Alex Rivera"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="one-time-code"
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
                placeholder="alex@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:border-blue-600 transition-all text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 bg-[#2563eb] hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Create Free Account <ArrowRight size={18} /></>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 font-bold mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </form>
      </div>

      <p className="mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 • SECURE REGISTRATION
      </p>
    </div>
  );
};



export default Register;