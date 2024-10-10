import React, { useState } from 'react';
import { Document } from 'react-pdf';
import { PDFPageCard } from './pdfPageCard';
import { Button, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { SERVER_URL } from '../config/constant';

interface PDFPreviewProps {
  url: string;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  numPages: number;
  onPagesSelect?: (selectedPages: number[]) => void;
  file: File;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  url,
  onLoadSuccess,
  onLoadError,
  numPages,
  onPagesSelect,
  file
}) => {
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [fileName,setFileName]=useState<string>('')

  const handlePageClick = (pageNumber: number) => {
    if (!selectMode) return;

    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNumber)) {
      newSelection.delete(pageNumber);
    } else {
      newSelection.add(pageNumber);
    }
    setSelectedPages(newSelection);
    onPagesSelect?.(Array.from(newSelection).sort((a, b) => a - b));
  };

  const handleSelectAll = () => {
    if (selectedPages.size === numPages) {
      setSelectedPages(new Set());
      onPagesSelect?.([]);
    } else {
      const allPages = new Set(Array.from({ length: numPages }, (_, i) => i + 1));
      setSelectedPages(allPages);
      onPagesSelect?.(Array.from(allPages).sort((a, b) => a - b));
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedPages(new Set());
      onPagesSelect?.([]);
    }
  };

  const handleUpload = async () => {
    const selectedPagesArray = Array.from(selectedPages).sort((a, b) => a - b);
    if (selectedPagesArray.length === 0) {
      message.error('Please select at least one page to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('selectedPages', JSON.stringify(selectedPagesArray));
    formData.append('pdf', file);
   
    try {
      const response = await axios.post(`${SERVER_URL}/pdfManagerServer/user/upload`,  formData)
      if (response.data.fileName) {
        message.success('File successfully uploaded!');
        setSelectedPages(new Set());
        toggleSelectMode();
        setFileName(response.data.fileName)
        setIsUploadComplete(true);
      } else {
        throw new Error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
      message.error('Failed to upload the PDF. Please try again.');
    }
  };


  const download= async()=>{
    
    if(!fileName) return message.error('No file name') 
        const {data}=await axios.get(`${SERVER_URL}/pdfManagerServer/user/download/${fileName}`,{responseType: 'blob'})
        console.log(data)
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName!);

        document.body.appendChild(link);  
        link.click();  
        document.body.removeChild(link); 
  }
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">PDF Preview</h3>
        <div className="flex items-center gap-4">
          <Button type={selectMode ? "primary" : "default"} onClick={toggleSelectMode} disabled={isUploadComplete}>
            {selectMode ? "Done" : "Select Pages"}
          </Button>
          {selectMode && (
            <>
              <Button onClick={handleSelectAll} disabled={isUploadComplete}>
                {selectedPages.size === numPages ? "Deselect All" : "Select All"}
              </Button>
              <span className="text-sm text-gray-600">
                {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
              </span>
            </>
          )}
        </div>
      </div>

      {!isUploadComplete && (
        <>
          {selectMode && selectedPages.size > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Selected Pages:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedPages).sort((a, b) => a - b).map((pageNum) => (
                  <span
                    key={pageNum}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                    onClick={() => handlePageClick(pageNum)}
                  >
                    Page {pageNum}
                    <button 
                      className="hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePageClick(pageNum);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <Document
            file={url}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={
              <div className="text-center py-4">
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            }
            error={
              <div className="text-center py-4">
                <p className="text-red-500">Failed to load PDF. Please try again.</p>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Array(numPages), (_, index) => {
                const pageNumber = index + 1;
                const isSelected = selectedPages.has(pageNumber);
                
                return (
                  <div 
                    key={`page_${pageNumber}`} 
                    className={`relative group cursor-pointer transition-transform duration-200 ${
                      selectMode ? 'hover:scale-[1.02]' : ''
                    }`}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    <PDFPageCard pageNumber={pageNumber} width={300} />
                    {selectMode && (
                      <>
                        <div className={`absolute inset-0 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-500 bg-opacity-10' 
                            : 'bg-black bg-opacity-0 group-hover:bg-opacity-5'
                        }`}>
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <CheckCircleFilled className="text-2xl text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transition-transform duration-200 ${
                          isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Document>
        </>
      )}

      {isUploadComplete && (
        <Button type="primary" className="mt-4" onClick={download}>
          Download PDF
        </Button>
      )}

      {selectMode && !isUploadComplete && (
        <Button type="primary" onClick={handleUpload} className="mt-4">
          Upload Selected Pages
        </Button>
      )}
    </div>
  );
};
