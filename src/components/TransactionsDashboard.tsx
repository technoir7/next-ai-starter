"use client";

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Search, Filter, AlertCircle, CreditCard, DollarSign, Activity } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Define transaction data types
export interface TransactionData {
  id: string;
  date: Date;
  type: 'Service' | 'Retail';
  amount: number;
  paymentMethod: 'Card' | 'Cash' | 'Transfer';
  tip?: number;
  notes?: string;
  clientName?: string;
  serviceName?: string;
  productName?: string;
}

// Define the props for the dashboard
interface TransactionsDashboardProps {
  transactions?: TransactionData[];
  isLoading?: boolean;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  onSearchChange?: (query: string) => void;
  onExport?: () => void;
}

export const TransactionsDashboard = ({
  transactions = [],
  isLoading = false,
  onDateRangeChange = () => {},
  onSearchChange = () => {},
  onExport = () => {}
}: TransactionsDashboardProps) => {
  // State for date range filtering
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for transaction type filter
  const [typeFilter, setTypeFilter] = useState<'All' | 'Service' | 'Retail'>('All');
  
  // State for error message when no data
  const [noDataError, setNoDataError] = useState<string | null>(null);

  // Summary calculations
  const summary = useMemo(() => {
    if (!transactions.length) return { 
      total: 0, 
      serviceTotal: 0, 
      retailTotal: 0, 
      tipTotal: 0,
      count: 0
    };
    
    return transactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount || 0;
        const tip = transaction.tip || 0;
        
        acc.total += amount;
        acc.tipTotal += tip;
        acc.count += 1;
        
        if (transaction.type === 'Service') {
          acc.serviceTotal += amount;
        } else if (transaction.type === 'Retail') {
          acc.retailTotal += amount;
        }
        
        return acc;
      },
      { total: 0, serviceTotal: 0, retailTotal: 0, tipTotal: 0, count: 0 }
    );
  }, [transactions]);

  // Filter transactions based on date range, search query, and type
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => {
        return (
          transaction.clientName?.toLowerCase().includes(query) ||
          transaction.serviceName?.toLowerCase().includes(query) ||
          transaction.productName?.toLowerCase().includes(query) ||
          transaction.notes?.toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply transaction type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    return filtered;
  }, [transactions, startDate, endDate, searchQuery, typeFilter]);

  // Handle date range changes
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    
    // Use the callback with the current values
    onDateRangeChange(start, end);
    
    // Reset error when changing date range
    setNoDataError(null);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
    
    // Reset error when changing search
    setNoDataError(null);
  };

  // Handle transaction type filter changes
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as 'All' | 'Service' | 'Retail');
    
    // Reset error when changing filter
    setNoDataError(null);
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Check if there's no data after filters are applied
  useEffect(() => {
    if ((startDate && endDate) || searchQuery || typeFilter !== 'All') {
      if (filteredTransactions.length === 0 && !isLoading) {
        setNoDataError('No records found for the selected criteria.');
      } else {
        setNoDataError(null);
      }
    }
  }, [filteredTransactions, isLoading, startDate, endDate, searchQuery, typeFilter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Transactions</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track and manage salon financial transactions
        </p>
      </div>

      {/* Filters and Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleDateRangeChange(date, endDate)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start date"
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => handleDateRangeChange(startDate, date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || undefined}
                  placeholderText="End date"
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="All">All Transactions</option>
                <option value="Service">Services Only</option>
                <option value="Retail">Retail Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800">
        {/* Total Transactions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summary.count}</p>
            </div>
          </div>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-green-500 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(summary.total)}</p>
            </div>
          </div>
        </div>
        
        {/* Service Revenue */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <div className="flex items-center">
            <CreditCard className="h-10 w-10 text-purple-500 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Service Revenue</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(summary.serviceTotal)}</p>
            </div>
          </div>
        </div>
        
        {/* Retail Revenue */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-amber-500 dark:text-amber-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Retail Revenue</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{formatCurrency(summary.retailTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error message for no data */}
      {noDataError && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 m-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{noDataError}</p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredTransactions.length === 0 && !noDataError ? (
          <div className="p-8 text-center">
            <Activity className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No transactions recorded</h3>
            <p className="text-gray-600 dark:text-gray-400">No transactions recorded for the selected period.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tip
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.date.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'Service' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {transaction.type}
                    </span>
                    {transaction.type === 'Service' && transaction.serviceName && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {transaction.serviceName}
                      </div>
                    )}
                    {transaction.type === 'Retail' && transaction.productName && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {transaction.productName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </div>
                    {transaction.clientName && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.clientName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.tip ? formatCurrency(transaction.tip) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Export Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionsDashboard; 