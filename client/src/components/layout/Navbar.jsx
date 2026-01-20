import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Briefcase, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap size={20} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            HireSense<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/jobs" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            Find Jobs
          </Link>
          <Link to="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            Pricing
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm font-semibold text-blue-600">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">{user.role}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;