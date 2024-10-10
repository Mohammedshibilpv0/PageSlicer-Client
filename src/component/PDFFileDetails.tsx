import React from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';

interface PDFFileInfoProps {
  file: File;
  onRemove: () => void;
}

export const PDFFileInfo: React.FC<PDFFileInfoProps> = ({ file, onRemove }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
      <div className="flex items-center">
        <AiOutlineFilePdf className="text-red-500 text-4xl mr-4" />
        <div>
          <h4 className="text-gray-700 font-medium">{file.name}</h4>
          <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-600 transition duration-200"
      >
        Remove
      </button>
    </div>
  );
};