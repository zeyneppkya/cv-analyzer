import React, { useCallback } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, fileName: string) => void;
  selectedFileName: string | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFileName, onClear }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Currently only PDF files are supported for direct analysis.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get raw base64
        const base64 = result.split(',')[1];
        onFileSelect(base64, file.name);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  if (selectedFileName) {
    return (
      <div className="w-full bg-primary-50 border-2 border-primary-200 border-dashed rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{selectedFileName}</p>
            <p className="text-sm text-primary-600">Ready for analysis</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label 
        htmlFor="cv-upload" 
        className="group flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primary-500 transition-all"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-primary-100 transition-colors">
            <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-primary-600" />
          </div>
          <p className="mb-2 text-sm text-gray-700 font-medium">
            <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF (Max 10MB)</p>
        </div>
        <input 
          id="cv-upload" 
          type="file" 
          className="hidden" 
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};