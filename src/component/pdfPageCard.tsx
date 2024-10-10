import React from 'react';
import { Page } from 'react-pdf';

interface PDFPageCardProps {
  pageNumber: number;
  width: number;
}

export const PDFPageCard: React.FC<PDFPageCardProps> = ({ pageNumber, width }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-[3/4]">
        <Page
          pageNumber={pageNumber}
          width={width}
          className="border border-gray-200"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading page...</p>
            </div>
          }
        />
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-center text-gray-600 font-medium">
          Page {pageNumber}
        </p>
      </div>
    </div>
  );
};
