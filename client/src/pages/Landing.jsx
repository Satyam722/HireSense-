import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, FileText, Target, BarChart, Zap, ArrowRight, 
  CheckCircle2, Sparkles, Globe, Menu, X, PlusCircle, 
  UserCheck, ChevronRight 
} from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. STICKY HEADER LOGIC
  useEffect(() => {
    const handleScroll = () => {
      // Toggle styles when user scrolls more than 20px
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureCards = [
    {
      icon: FileText,
      title: "Neural Parsing",
      description: "AI extracts semantic meaning from resumes, identifying hidden potential beyond keywords.",
      tags: ['Skill Discovery', 'Contextual Mapping'],
      color: 'blue'
    },
    {
      icon: Target,
      title: "Precise Matching",
      description: "Get a mathematical certainty score for every application based on experience gap analysis.",
      tags: ['Score Accuracy', 'Bias Reduction'],
      color: 'indigo'
    },
    {
      icon: BarChart,
      title: "Predictive Hiring",
      description: "Comprehensive analytics to predict candidate success and long-term team fit.",
      tags: ['Retention Analytics', 'Team Sync'],
      color: 'slate'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* 1. STICKY NAVIGATION (Consolidated to prevent overlap) */}
      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' 
          : 'bg-white py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 font-black text-2xl tracking-tighter text-slate-900">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
              HireSense AI
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Technology</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <Link to="/jobs" className="hover:text-blue-600 transition-colors">Browse Jobs</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-700 hover:text-blue-600 transition">Log in</Link>
            <Link 
              to="/register" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              Get Started Free
            </Link>
            
            <button className="md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-600">Technology</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="font-bold text-slate-600">How it Works</a>
            <Link to="/jobs" className="font-bold text-slate-600">Browse Jobs</Link>
            <hr />
            <Link to="/login" className="font-bold text-blue-600">Log in</Link>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative pt-48 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge with Gemini 2.5 Mention */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-blue-600 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
            <Sparkles size={14} className="animate-pulse" /> 
            Now Powered by Gemini 2.5
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-[-0.04em] leading-[1]">
            Hire with <br />
            <span className="relative inline-block">
              Intelligence
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none">
                <path d="M3 9C118.957 4.47226 238.162 3.99974 355 7.49981" stroke="#2563EB" strokeWidth="5" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
            The neural job portal that bypasses manual screening. We use AI to match talent to roles with <span className="text-slate-900 font-bold italic underline decoration-blue-200">99% precision</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/register" className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 flex items-center gap-3">
              Start Building Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/jobs" className="flex items-center gap-2 px-8 py-5 text-slate-900 font-black hover:text-blue-600 transition-colors">
              <Globe size={20} /> Explore Opportunities
            </Link>
          </div>
        </div>
      </header>

      {/* 3. LIVE MATCH PREVIEW (Visual Demo) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="p-10 lg:p-20 lg:w-1/2 text-left">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Neural Match Analysis
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                Identify the top 1% <br />in seconds.
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                Our engine uses Gemini 2.5 to analyze project impact and technical depth for perfect candidate fits.
              </p>
              <div className="space-y-4">
                {['Experience Gap Analysis', 'Skill Authenticity Scoring'].map(item => (
                  <div key={item} className="flex items-center gap-3 font-bold text-slate-700">
                    <CheckCircle2 className="text-green-500" size={20} /> {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 w-full lg:w-1/2 p-12 flex justify-center border-l border-slate-100">
              {/* Candidate Preview Card */}
              <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[32px] shadow-2xl p-8 relative transform hover:scale-105 transition-all duration-500">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-5 py-2 rounded-2xl font-black text-xs shadow-lg flex items-center gap-1.5">
                  <Sparkles size={14} /> 97% Match
                </div>
                <div className="flex items-center gap-4 mb-8 text-left">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                    S
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-slate-900 tracking-tight">Rahul Sharma</h4>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Product Lead Candidate</p>
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[97%] rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-semibold italic leading-relaxed">
                      "Rahul demonstrates elite leadership capabilities with a proven track record of scaling consumer apps to 1M+ users."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3-Step Workflow) */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">The Gemini 2.5 Workflow</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              { 
                icon: <PlusCircle size={36} />, 
                title: "Post Position", 
                desc: "Define your requirements. Our AI interprets the context and tech stack instantly." 
              },
              { 
                icon: <Brain size={36} />, 
                title: "Gemini Analysis", 
                desc: "Gemini 2.5 semantically maps resumes against your job DNA to find technical matches." 
              },
              { 
                icon: <UserCheck size={36} />, 
                title: "Instant Shortlist", 
                desc: "Review a ranked list of the top 1% of talent, ready for final interviews." 
              }
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[28px] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-10 -right-8 text-slate-200">
                    <ChevronRight size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-20 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <Zap className="text-blue-600 fill-blue-600" size={28} />
            <span>HireSense AI</span>
          </div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
            © 2026 Powered by Google Gemini 2.5. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;