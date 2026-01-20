// src/pages/Profile.jsx
import React, { useState } from 'react';
import ResumeUploader from '../components/profile/ResumeUploader';
import AIAnalysisResults from '../components/profile/AIAnalysisResults';

const Profile = () => {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Professional Profile</h1>
      
      {/* If no data yet, show the uploader. If data exists, show the results. */}
      {!analysisData ? (
        <ResumeUploader onUploadSuccess={(data) => setAnalysisData(data)} />
      ) : (
        <>
          <AIAnalysisResults analysis={analysisData} />
          <button 
            onClick={() => setAnalysisData(null)}
            className="mt-6 text-sm text-slate-500 hover:text-blue-600 font-medium"
          >
            ← Upload a different resume
          </button>
        </>
      )}
    </div>
  );
};