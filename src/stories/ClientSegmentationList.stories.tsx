import type { Meta, StoryObj } from '@storybook/react';
import { ClientSegmentationList, ClientSegment, type ClientData } from '../components/ClientSegmentationList';

const meta: Meta<typeof ClientSegmentationList> = {
  title: 'Client/ClientSegmentationList',
  component: ClientSegmentationList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClientSegmentationList>;

// Sample client data
const sampleClients: ClientData[] = [
  {
    id: '1',
    firstName: 'Emily',
    lastName: 'Smith',
    email: 'emily.smith@example.com',
    segment: ClientSegment.HighValue,
    lastVisit: new Date('2025-04-28'),
    totalSpent: 850.50
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    segment: ClientSegment.FrequentBooker,
    lastVisit: new Date('2025-05-15'),
    totalSpent: 425.75
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Ray',
    email: 'lisa.ray@example.com',
    segment: ClientSegment.AtRisk,
    lastVisit: new Date('2024-12-20'),
    totalSpent: 175.25
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    segment: ClientSegment.NewClient,
    lastVisit: new Date('2025-05-18'),
    totalSpent: 120.00
  },
  {
    id: '5',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    segment: ClientSegment.NewClient,
    lastVisit: new Date('2025-05-20'),
    totalSpent: 95.50
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    segment: ClientSegment.NewClient,
    lastVisit: new Date('2025-05-19'),
    totalSpent: 110.25
  }
];

// Default view with all segments
export const DefaultView: Story = {
  name: 'Segmentation – Default View',
  args: {
    clients: sampleClients,
    onClientClick: (client) => console.log('Client clicked:', client),
    onSegmentClick: (segment) => console.log('Segment clicked:', segment),
  },
};

// Filtered view, showing only New Clients
export const FilteredView: Story = {
  name: 'Segmentation – Filtered View',
  render: () => {
    // Filter only new clients
    const newClients = sampleClients.filter(
      client => client.segment === ClientSegment.NewClient
    );
    
    return (
      <div className="max-w-3xl">
        <h3 className="text-lg font-medium mb-4">Filtered by "New Clients" Segment</h3>
        <ClientSegmentationList 
          clients={newClients}
          onClientClick={(client) => console.log('Client clicked:', client)}
          onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
        />
      </div>
    );
  },
}; 