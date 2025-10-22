import React from 'react';
const ModelCard = ({ model, onSelect, onDelete, isSelected = false }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`
        card cursor-pointer transition-all duration-200 hover:shadow-md 
        ${isSelected ? 'ring-2 ring-primary-500 border-primary-200' : ''}
      `}
      onClick={() => onSelect(model)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
            {model.name}
          </h3>
        </div>

        {model.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {model.description}
          </p>
        )}

        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {model.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {model.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{model.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="space-y-1">
            <div>{formatFileSize(model.fileSize)}</div>
            <div>{formatDate(model.uploadDate)}</div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(model);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(model._id);
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;