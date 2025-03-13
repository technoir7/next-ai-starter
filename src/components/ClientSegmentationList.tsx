"use client";

import { useState, useMemo } from 'react';
import { User, ArrowDown, ArrowUp, Star, Clock, AlertCircle, UserPlus } from 'lucide-react';

// Define the client data structure
export interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  segment: ClientSegment;
  lastVisit?: Date;
  totalSpent?: number;
}

// Define the segment types
export enum ClientSegment {
  HighValue = 'HIGH_VALUE',
  FrequentBooker = 'FREQUENT_BOOKER',
  AtRisk = 'AT_RISK',
  NewClient = 'NEW_CLIENT'
}

// Define the segmentation display configuration
const segmentConfig = {
  [ClientSegment.HighValue]: {
    label: 'HIGH',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: Star,
    description: 'High Value Clients'
  },
  [ClientSegment.FrequentBooker]: {
    label: 'FREQ',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: Clock,
    description: 'Frequent Bookers'
  },
  [ClientSegment.AtRisk]: {
    label: 'LOW ENGAGEMENT',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: AlertCircle,
    description: 'At-Risk Clients'
  },
  [ClientSegment.NewClient]: {
    label: 'NEW',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: UserPlus,
    description: 'New Clients'
  }
};

// Component props interface
interface ClientSegmentationListProps {
  clients: ClientData[];
  onClientClick?: (client: ClientData) => void;
  onSegmentClick?: (segment: ClientSegment) => void;
}

export const ClientSegmentationList = ({
  clients = [],
  onClientClick = () => {},
  onSegmentClick = () => {}
}: ClientSegmentationListProps) => {
  const [selectedSegment, setSelectedSegment] = useState<ClientSegment | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'totalSpent'>('name');

  // Group clients by segment
  const clientsBySegment = useMemo(() => {
    return clients.reduce<Record<ClientSegment, ClientData[]>>((acc, client) => {
      if (!acc[client.segment]) {
        acc[client.segment] = [];
      }
      acc[client.segment].push(client);
      return acc;
    }, {
      [ClientSegment.HighValue]: [],
      [ClientSegment.FrequentBooker]: [],
      [ClientSegment.AtRisk]: [],
      [ClientSegment.NewClient]: []
    });
  }, [clients]);

  // Filter clients based on selected segment
  const filteredClients = useMemo(() => {
    if (!selectedSegment) return clients;
    return clients.filter(client => client.segment === selectedSegment);
  }, [clients, selectedSegment]);

  // Sort clients based on sort options
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        const aName = `${a.lastName}, ${a.firstName}`;
        const bName = `${b.lastName}, ${b.firstName}`;
        comparison = aName.localeCompare(bName);
      } else if (sortBy === 'lastVisit' && a.lastVisit && b.lastVisit) {
        comparison = a.lastVisit.getTime() - b.lastVisit.getTime();
      } else if (sortBy === 'totalSpent' && a.totalSpent !== undefined && b.totalSpent !== undefined) {
        comparison = a.totalSpent - b.totalSpent;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredClients, sortBy, sortDirection]);

  // Handle segment selection
  const handleSegmentClick = (segment: ClientSegment) => {
    setSelectedSegment(segment === selectedSegment ? null : segment);
    onSegmentClick(segment);
  };

  // Handle sort change
  const handleSortChange = (field: 'name' | 'lastVisit' | 'totalSpent') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Render the segment header with count
  const renderSegmentHeader = (segment: ClientSegment) => {
    const segmentData = segmentConfig[segment];
    const count = clientsBySegment[segment]?.length || 0;
    const isSelected = selectedSegment === segment;
    const SegmentIcon = segmentData.icon;

    return (
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer rounded-t-lg ${
          isSelected ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        onClick={() => handleSegmentClick(segment)}
      >
        <div className="flex items-center space-x-2">
          <SegmentIcon className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold">{segmentData.description}</h3>
          <span className="text-sm text-gray-500">({count})</span>
        </div>
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${segmentData.color}`}>
          {segmentData.label}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Client Segmentation</h2>
      </div>

      {/* Segment Headers */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.values(ClientSegment).map((segment) => (
          <div key={segment} className="overflow-hidden">
            {renderSegmentHeader(segment)}
            
            {/* Show client list if segment is selected */}
            {selectedSegment === segment && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                {/* Sort controls */}
                <div className="flex justify-end mb-4 space-x-4 text-sm">
                  <button 
                    className={`flex items-center ${sortBy === 'name' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                    onClick={() => handleSortChange('name')}
                  >
                    Name
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                  <button 
                    className={`flex items-center ${sortBy === 'lastVisit' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                    onClick={() => handleSortChange('lastVisit')}
                  >
                    Last Visit
                    {sortBy === 'lastVisit' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                  <button 
                    className={`flex items-center ${sortBy === 'totalSpent' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                    onClick={() => handleSortChange('totalSpent')}
                  >
                    Total Spent
                    {sortBy === 'totalSpent' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-4 w-4" /> : 
                        <ArrowDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Client list */}
                {sortedClients.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {sortedClients.map((client) => (
                      <li 
                        key={client.id}
                        className="py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 rounded"
                        onClick={() => onClientClick(client)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-10 w-10 text-gray-400 bg-gray-200 dark:bg-gray-700 p-2 rounded-full" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {client.firstName} {client.lastName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {client.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {client.lastVisit && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last visit: {client.lastVisit.toLocaleDateString()}
                              </p>
                            )}
                            {client.totalSpent !== undefined && (
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                ${client.totalSpent.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No clients found in this segment.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSegmentationList; 