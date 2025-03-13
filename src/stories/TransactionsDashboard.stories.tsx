import type { Meta, StoryObj } from '@storybook/react';
import { TransactionsDashboard, type TransactionData } from '../components/TransactionsDashboard';

const meta: Meta<typeof TransactionsDashboard> = {
  title: 'Financial/TransactionsDashboard',
  component: TransactionsDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionsDashboard>;

// Sample transaction data
const sampleTransactions: TransactionData[] = [
  {
    id: '1',
    date: new Date('2025-05-20T10:30:00'),
    type: 'Service',
    amount: 75.00,
    paymentMethod: 'Card',
    tip: 10.00,
    notes: 'Rebooked',
    clientName: 'Emily Smith',
    serviceName: 'Haircut'
  },
  {
    id: '2',
    date: new Date('2025-05-20T14:15:00'),
    type: 'Retail',
    amount: 35.50,
    paymentMethod: 'Cash',
    notes: 'Upsell completed',
    clientName: 'Emily Smith',
    productName: 'Shampoo Deluxe'
  },
  {
    id: '3',
    date: new Date('2025-05-21T09:00:00'),
    type: 'Service',
    amount: 120.00,
    paymentMethod: 'Card',
    tip: 20.00,
    clientName: 'John Doe',
    serviceName: 'Color Treatment'
  },
  {
    id: '4',
    date: new Date('2025-05-21T11:45:00'),
    type: 'Service',
    amount: 45.00,
    paymentMethod: 'Card',
    tip: 5.00,
    notes: 'New client referral',
    clientName: 'Sarah Wilson',
    serviceName: 'Manicure'
  },
  {
    id: '5',
    date: new Date('2025-05-22T13:30:00'),
    type: 'Retail',
    amount: 28.99,
    paymentMethod: 'Cash',
    clientName: 'Michael Johnson',
    productName: 'Styling Gel'
  }
];

// Empty Dashboard
export const EmptyState: Story = {
  name: 'TransactionsDashboard – Empty',
  args: {
    transactions: [],
    isLoading: false,
    onDateRangeChange: (startDate, endDate) => console.log('Date range changed:', startDate, endDate),
    onSearchChange: (query) => console.log('Search changed:', query),
    onExport: () => console.log('Export requested')
  },
};

// Populated Dashboard
export const WithTransactions: Story = {
  name: 'TransactionsDashboard – With Transactions',
  args: {
    transactions: sampleTransactions,
    isLoading: false,
    onDateRangeChange: (startDate, endDate) => console.log('Date range changed:', startDate, endDate),
    onSearchChange: (query) => console.log('Search changed:', query),
    onExport: () => console.log('Export requested')
  },
};

// Filtering/Error State
export const FilteringErrorState: Story = {
  name: 'TransactionsDashboard – Filtering / Error State',
  render: () => {
    return (
      <div className="space-y-4 max-w-6xl">
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-md">
          <h3 className="text-blue-800 dark:text-blue-200 font-medium">Filtering Demo</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            Try filtering transactions by date range, search term, or transaction type. 
            When no records match your criteria, an error message will appear.
          </p>
        </div>
        
        <TransactionsDashboard 
          transactions={sampleTransactions}
          onDateRangeChange={(startDate, endDate) => console.log('Date range changed:', startDate, endDate)}
          onSearchChange={(query) => console.log('Search changed:', query)}
          onExport={() => console.log('Export requested')}
        />
      </div>
    );
  },
}; 