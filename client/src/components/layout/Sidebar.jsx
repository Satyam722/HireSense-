import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileUser, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isRecruiter = user?.role === 'recruiter';

  const menuItems = isRecruiter 
    ? [
        { name: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
        { name: 'My Jobs', icon: <Briefcase size={20}/>, path: '/manage-jobs' },
      ]
    : [
        { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
        { name: 'Find Jobs', icon: <Briefcase size={20}/>, path: '/jobs' },
        { name: 'My Profile', icon: <FileUser size={20}/>, path: '/profile' },
      ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 font-bold text-2xl text-blue-600">HireSense AI</div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors font-semibold text-sm"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;