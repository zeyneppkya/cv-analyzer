import React, { useState } from 'react';
import { 
  LogOut, 
  Sparkles, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Briefcase,
  FileText,
  Type,
  Info
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { analyzeCV } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  apiKey: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiKey, onLogout }) => {
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cvText, setCvText] = useState('');
  
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    // Determine active input
    const effectiveBase64 = inputMethod === 'file' ? fileBase64 : null;
    const effectiveText = inputMethod === 'text' ? cvText : null;

    if (!effectiveBase64 && (!effectiveText || effectiveText.trim() === '')) {
      setError("Please provide CV content either by pasting text or uploading a PDF.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeCV(apiKey, effectiveBase64, effectiveText, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  // Check if the analyze button should be enabled
  const canAnalyze = inputMethod === 'file' 
    ? !!fileBase64 
    : cvText.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900">CV Analyzer</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-2 transition-colors"
          >
            Sign Out
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. CV Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="text-primary-600" size={20} />
                1. Candidate Resume
              </h2>
              
              {/* Tabs */}
              <div className="flex items-center gap-4 mb-4 border-b border-gray-100">
                <button
                  className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all ${
                    inputMethod === 'text' 
                      ? 'text-primary-600 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setInputMethod('text')}
                >
                  <Type size={16} /> Paste Text
                </button>
                <button
                   className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all ${
                    inputMethod === 'file' 
                      ? 'text-primary-600 border-b-2 border-primary-600' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setInputMethod('file')}
                >
                  <FileText size={16} /> Upload PDF
                </button>
              </div>

              {inputMethod === 'text' ? (
                <textarea 
                  className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm"
                  placeholder="Paste the full CV content here..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                />
              ) : (
                <FileUpload 
                  onFileSelect={(b64, name) => {
                    setFileBase64(b64);
                    setFileName(name);
                  }}
                  selectedFileName={fileName}
                  onClear={() => {
                    setFileBase64(null);
                    setFileName(null);
                  }}
                />
              )}
            </div>

            {/* 2. Job Context Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="text-primary-600" size={20} />
                2. Target Job Description
              </h2>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <div className="flex gap-2">
                  <Info className="text-blue-600 w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    <strong>Why fill this?</strong> Paste a real job post here. The AI will compare your CV specifically against this role to find missing keywords and relevance.
                  </p>
                </div>
              </div>

              <textarea 
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm placeholder:text-gray-400"
                placeholder="Paste the job advertisement here (Requirements, Responsibilities, etc.)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                ${!canAnalyze || isAnalyzing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Analyze CV
                </>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {!result ? (
              <div className="h-full min-h-[400px] bg-white rounded-xl shadow-sm border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400">
                <TrendingUp size={48} className="mb-4 opacity-20" />
                <p>Provide CV content and start analysis to see results.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                
                {/* Score Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Verdict</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
                    <p className="mt-2 text-sm font-medium italic text-primary-700">"{result.verdict}"</p>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[150px]">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={getScoreColor(result.atsScore)}
                          strokeWidth="3"
                          strokeDasharray={`${result.atsScore}, 100`}
                          className="animate-[spin_1s_ease-out_reverse]"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-900">{result.atsScore}</span>
                        <span className="text-xs text-gray-500 uppercase">ATS Score</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} /> Found Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.found.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                      <AlertTriangle size={18} /> Missing / Recommended
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.missing.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SWOT Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">SWOT Analysis</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Strengths</span>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {result.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Weaknesses</span>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {result.swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-6">Suggested Improvements</h3>
                  <div className="space-y-6">
                    {result.improvements.map((imp, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs font-bold text-red-500 uppercase mb-1">Original</div>
                        <p className="text-sm text-gray-500 mb-3 line-through">{imp.original}</p>
                        
                        <div className="text-xs font-bold text-green-600 uppercase mb-1">Better Version</div>
                        <p className="text-sm text-gray-900 font-medium mb-2">{imp.suggestion}</p>
                        
                        <div className="text-xs text-primary-600 bg-primary-50 inline-block px-2 py-1 rounded">
                          Reason: {imp.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};