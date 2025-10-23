import React, { useState, useEffect } from 'react';
import { useModels } from '../hooks/useModels';
import { useApi } from '../hooks/useApi';
import ModelViewer from '../components/ModelViewer';
import ModelCard from '../components/ModelCard';
import UploadModal from '../components/UploadModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE } from '../utils/constants';
import {confirmAlert} from '../utils/sweetalert.js'


export default function Dashboard() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { models, loading, error, refresh } = useModels();
  const { request } = useApi();

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleDeleteModel = async (modelId) => {
    const confirmed = await confirmAlert('Are you sure?', 'This model will be permanently deleted.');
    if (!confirmed) return;

    try {
      const result = await request({
        url: `/models/${modelId}`,
        method: 'DELETE',
      });

      if (result.success) {
        refresh();
        if (selectedModel && selectedModel._id === modelId) {
          setSelectedModel(null);
        }
      }
    } catch (err) {
      alert(`❌ Failed to delete model: ${err.message}`);
    }
  };

  const handleUploadSuccess = () => {
    refresh();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">3D Model Viewer</h1>
              <p className="text-gray-600 mt-2">
                Upload, manage, and view your 3D models in GLB format
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Upload Model</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <div className="card">
              <div className="max-h-96 xl:max-h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="p-8">
                    <LoadingSpinner text="Loading models..." />
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <div className="text-red-500 text-sm">Error loading models</div>
                    <button
                      onClick={refresh}
                      className="text-primary-600 text-sm mt-2 hover:text-primary-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : models.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-3">📁</div>
                    <p className="text-gray-500 mb-4">No models found</p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="btn-primary text-sm"
                    >
                      Upload Your First Model
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {models.map((model) => (
                      <ModelCard
                        key={model._id}
                        model={model}
                        isSelected={selectedModel?._id === model._id}
                        onSelect={handleModelSelect}
                        onDelete={handleDeleteModel}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="card">
              <div className="p-6">
                {selectedModel ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedModel.name}</h2>
                        {selectedModel.description && (
                          <p className="text-gray-600 mt-2">{selectedModel.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span>Uploaded: {new Date(selectedModel.uploadDate).toLocaleDateString()}</span>
                          <span>Size: {formatFileSize(selectedModel.fileSize)}</span>
                          <span className="capitalize">Category: {selectedModel.category}</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedModel(null)} className="btn-secondary text-sm">
                        Close
                      </button>
                    </div>

                    <ModelViewer
                      modelUrl={`${API_BASE}/upload/file/${selectedModel.fileId}`}
                      className="h-96 lg:h-[500px]"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {selectedModel.tags && selectedModel.tags.length > 0 && ( 
                        <div> <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2"> 
                                {selectedModel.tags.map((tag, index) => ( <span key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm" > 
                                {tag} </span> ))}
                            </div> 
                        </div> )}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">File Information</h3>
                            <dl className="space-y-2 text-sm"> 
                                <div className="flex justify-between"> <dt className="text-gray-600">Original Name:</dt>
                                    <dd className="text-gray-900">{selectedModel.originalName}</dd>
                                </div>
                                <div className="flex justify-between"> 
                                    <dt className="text-gray-600">File Type:</dt> <dd className="text-gray-900">GLB (Binary GLTF)</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Upload Date:</dt> <dd className="text-gray-900"> {new Date(selectedModel.uploadDate).toLocaleString()} </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Last Updated:</dt> 
                                    <dd className="text-gray-900"> {new Date(selectedModel.updatedAt).toLocaleString()} </dd> 
                                </div>
                            </dl>
                        </div>
                                
                    </div> 
                  </div>
                  
                ) : (
                  <div className="text-center py-12 lg:py-24">
                    <div className="text-gray-400 text-8xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Model Selected</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Select a model from the list to view it in 3D, or upload a new model to get started.
                    </p>
                    <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary">
                      Upload Your First Model
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
