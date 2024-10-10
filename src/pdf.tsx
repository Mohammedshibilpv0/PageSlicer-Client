
import React, { useState } from 'react';
import { message } from 'antd';
import { pdfjs } from 'react-pdf';
import { PDFDropzone } from './component/PDFDropzone'; 
import { PDFFileInfo } from './component/PDFFileDetails';
import { PDFPreview } from './component/PDFPreview';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFUploadContainer: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);


  const handlePDFSelect = (file: File) => {
    
    setPdfFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPdfUrl(fileUrl);
  };

  const handleRemoveFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfFile(null);
    setPdfUrl(null);
    setNumPages(0);
    
  };

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    
  };

  const handleLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    message.error('Error loading PDF. Please try again.');
    handleRemoveFile();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Upload Your PDF</h2>
        
        <PDFDropzone onPDFSelect={handlePDFSelect} />

        {pdfFile && (
          <>
            <div className="mt-8">
              <PDFFileInfo file={pdfFile} onRemove={handleRemoveFile} />
            </div>

            {pdfUrl && (
              <PDFPreview
                file={pdfFile}
                url={pdfUrl}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={handleLoadError}
                numPages={numPages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

