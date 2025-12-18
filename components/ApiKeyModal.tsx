import React, { useState } from 'react';
import { Lock, Key, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  isOpen: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, isOpen }) => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white text-center">
          <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Enter Gemini API Key</h2>
          <p className="text-primary-100 text-sm mt-2">
            Your key is stored locally in your browser. We never see it.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-10"
                placeholder="AIzaSy..."
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Get one from Google AI Studio</a>.
            </p>
          </div>

          <button
            onClick={() => onSave(inputKey.trim())}
            disabled={!inputKey.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Connect & Continue
          </button>
          
          <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
            <Lock size={12} />
            <span>Secure Client-Side Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};