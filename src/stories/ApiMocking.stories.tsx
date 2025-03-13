import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MockApiDecorator } from './decorators/MockApiDecorator';
import { clientsMockData, transactionsMockData, inventoryMockData } from '../lib/api/mockData';
import ApiModeSelector from './decorators/ApiMockDecorator';

// Define a component to demonstrate API mocking
const ApiMockingDemo = () => {
  const [apiMode, setApiMode] = useState<'live' | 'slow' | 'error'>('live');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'clients' | 'transactions' | 'inventory'>('clients');

  // Define mock data sources
  const mockDataSources = {
    clients: clientsMockData.clients,
    transactions: transactionsMockData.transactions,
    inventory: inventoryMockData.products
  };

  // Fetch data based on the selected endpoint and API mode
  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    // Simulate API request
    setTimeout(() => {
      if (apiMode === 'error') {
        setError('An error occurred while fetching data. Please try again.');
        setIsLoading(false);
      } else {
        setData(mockDataSources[selectedEndpoint]);
        setIsLoading(false);
      }
    }, apiMode === 'slow' ? 2000 : 500);
  };

  // Handle API mode changes from the decorator
  useEffect(() => {
    // This will check for changes from the decorator (via props or context in a real implementation)
    const modeFromDecorator = document.body.getAttribute('data-api-mode') as 'live' | 'slow' | 'error' | null;
    if (modeFromDecorator && modeFromDecorator !== apiMode) {
      setApiMode(modeFromDecorator);
    }
  }, [apiMode]);

  // Format data for display
  const formatData = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <ApiModeSelector />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">API Mocking Demo</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select API Endpoint
            </label>
            <select
              id="endpoint"
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="clients">Clients</option>
              <option value="transactions">Transactions</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center p-6 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading data...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border-l-4 border-red-400 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {data && !isLoading && !error && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Response from {selectedEndpoint} endpoint:
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto max-h-80">
              <pre className="text-sm text-gray-800 dark:text-gray-200">{formatData(data)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof ApiMockingDemo> = {
  title: 'API/ApiMocking',
  component: ApiMockingDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiMockingDemo>;

// Default API mocking story
export const Default: Story = {
  name: 'API Response Modes',
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates how the API mocking system works with different response modes (Live, Slow, Error).',
      },
    },
  },
}; 