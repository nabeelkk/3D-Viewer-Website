import React, { useState, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

export default function UploadModal({ onClose, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);
  const { request } = useApi();

  const handleFileSelect = (selectedFile) => {
    setErrors({});

    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    if (!ACCEPTED_FILE_TYPES.includes(`.${fileExtension}`) && 
        selectedFile.type !== 'model/gltf-binary') {
      setErrors({ 
        file: 'Only GLB files are allowed. Please select a .glb file.' 
      });
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors({ 
        file: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      });
      return;
    }

    setFile(selectedFile);

    if (!formData.name) {
      const nameWithoutExtension = selectedFile.name.replace('.glb', '');
      setFormData(prev => ({
        ...prev,
        name: nameWithoutExtension
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('model', file);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);

      const result = await request({
        url: '/upload',
        method: 'POST',
        data: submitData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (result.success) {
        onSuccess();
      }

    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload 3D Model</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3D Model File <span className="text-red-500">*</span>
            </label>
            
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                ${errors.file ? 'border-red-300 bg-red-50' : ''}
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              
              {file ? (
                <div className="text-green-600">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-red-600 text-sm mt-2 hover:text-red-700"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="font-medium text-gray-900">Drop your GLB file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                  </p>
                </div>
              )}
            </div>
            
            {errors.file && (
              <p className="text-red-600 text-sm mt-2">{errors.file}</p>
            )}
          </div>

          {/* Model Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field"
              placeholder="Enter a descriptive name for your model"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-2">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Describe your 3D model (optional)"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="btn-primary flex items-center space-x-2"
            >
              {uploading && <LoadingSpinner size="sm" text="" />}
              <span>{uploading ? 'Uploading...' : 'Upload Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}