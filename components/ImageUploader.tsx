
import React, { useState, useRef, useCallback } from 'react';
import { ImageFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
  label: string;
  size: 'large' | 'small';
  onImageUpload: (image: ImageFile | null) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, size, onImageUpload }) => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        const newImage = {
          file,
          previewUrl: URL.createObjectURL(file),
          base64: base64.split(',')[1],
        };
        setImage(newImage);
        onImageUpload(newImage);
      } catch (error) {
        console.error("Error processing file:", error);
        setImage(null);
        onImageUpload(null);
      }
    } else {
        setImage(null);
        onImageUpload(null);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };
  
  const onClick = () => fileInputRef.current?.click();

  const containerClasses = size === 'large' ? 'aspect-square' : 'aspect-square';
  const draggingClasses = isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500';

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">{label}</p>
      <div
        className={`relative ${containerClasses} bg-[#2a2b2c] rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center text-center cursor-pointer ${draggingClasses}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          accept="image/*"
        />
        {image ? (
          <img src={image.previewUrl} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadIcon />
            <p className="mt-2 text-sm">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};
