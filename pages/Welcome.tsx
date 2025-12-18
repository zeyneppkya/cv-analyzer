import React from 'react';
import { ShieldCheck, Zap, Database } from 'lucide-react';
import { ApiKeyModal } from '../components/ApiKeyModal';

interface WelcomeProps {
  onApiKeySubmit: (key: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onApiKeySubmit }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              CV <span className="text-primary-600">Analyzer</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Professional, privacy-focused resume analysis powered by Gemini 2.5. 
              Upload your PDF, analyze skills gaps, and optimize for ATS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <ShieldCheck className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Private</h3>
              <p className="text-sm text-gray-500">Your CV and API key never leave your browser. Zero data retention.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-yellow-100 p-3 rounded-full mb-4">
                <Zap className="text-yellow-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-500">Powered by Gemini 2.5 Flash for split-second, high-accuracy feedback.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Database className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cost Effective</h3>
              <p className="text-sm text-gray-500">Bring your own free-tier API key. No monthly subscriptions.</p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg"
            >
              Get Started
            </button>
            <p className="mt-4 text-sm text-gray-400">Requires a Google Gemini API Key</p>
          </div>
        </div>
      </div>
      
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onSave={onApiKeySubmit} 
      />
    </div>
  );
};