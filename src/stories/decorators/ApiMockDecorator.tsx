import React, { useState } from 'react';

// API response modes
export type ApiMode = 'live' | 'slow' | 'error';

// Simpler API Mock UI component for Storybook
export const ApiModeSelector = () => {
  const [apiMode, setApiMode] = useState<ApiMode>('live');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle API mode changes
  const handleModeChange = (mode: ApiMode) => {
    setApiMode(mode);
    setLoading(mode === 'slow');
    setError(mode === 'error' ? 'This is a simulated API error for testing purposes.' : null);
    
    if (mode === 'slow') {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

    // This would communicate with stories in a real implementation
    document.body.setAttribute('data-api-mode', mode);
  };

  return (
    <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">API Response Simulation</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select different API response modes to see how the component behaves.
          </p>
        </div>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => handleModeChange('live')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              apiMode === 'live'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => handleModeChange('slow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              apiMode === 'slow'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Slow API
          </button>
          <button
            onClick={() => handleModeChange('error')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              apiMode === 'error'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Error
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="mt-3 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-2 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800 dark:text-yellow-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading data... (simulated slow response)
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-3 bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-2 rounded-md">
          <p className="text-xs text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiModeSelector; 