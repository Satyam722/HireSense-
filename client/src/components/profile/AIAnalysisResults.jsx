import React from 'react';
import { CheckCircle, Star, TrendingUp, Lightbulb } from 'lucide-react';

const AIAnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Header with Overall Score */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Analysis Complete</h3>
          <p className="text-slate-500 text-sm">We've identified your core professional DNA.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-blue-600">85%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Strength</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Star size={20} />
            <h4 className="font-bold text-slate-900">Extracted Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.skills?.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <TrendingUp size={20} />
            <h4 className="font-bold text-slate-900">Key Strengths</h4>
          </div>
          <ul className="space-y-3">
            {analysis.strengths?.map((strength, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions Section */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <div className="flex items-center gap-2 mb-3 text-amber-700">
          <Lightbulb size={20} />
          <h4 className="font-bold">AI Recommendations for Improvement</h4>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">
          {analysis.improvements || "Your resume looks great! To increase your score, consider adding more quantitative metrics to your past roles."}
        </p>
      </div>
    </div>
  );
};

export default AIAnalysisResults;