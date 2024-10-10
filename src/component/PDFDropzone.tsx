import { message } from 'antd';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface PDFDropzoneProps {
  onPDFSelect: (file: File) => void;
}

export const PDFDropzone: React.FC<PDFDropzoneProps> = ({ onPDFSelect }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file && file.type === 'application/pdf') {
        onPDFSelect(file);
      }
    }else{
      message.error('File should be pdf')
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className="border-4 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer transition duration-300 hover:bg-gray-50"
    >
      <input {...getInputProps()} />
      <AiOutlineCloudUpload className="mx-auto text-6xl text-gray-400" />
      <p className="text-gray-500 mt-4">Drag and drop a PDF file here, or click to select a file</p>
      <p className="text-gray-400 text-sm">Only PDF files are accepted</p>
    </div>
  );
};
