import type { Meta, StoryObj } from '@storybook/react';
import { GlobalNavigation } from '../components/GlobalNavigation';

const meta: Meta<typeof GlobalNavigation> = {
  title: 'Navigation/GlobalNavigation',
  component: GlobalNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlobalNavigation>;

// Default State Story
export const DefaultState: Story = {
  name: 'Navigation – Default State',
  args: {
    userName: 'SalonAdmin',
    onLogout: () => console.log('Logout clicked'),
  },
};

// Responsive Mobile View (Simulation through viewport adjustment)
export const ResponsiveMobileView: Story = {
  name: 'Navigation – Responsive Mobile View',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    userName: 'SalonAdmin',
    onLogout: () => console.log('Logout clicked'),
  },
  render: (args) => {
    return (
      <div className="relative min-h-screen">
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 m-4 rounded-md">
          <h3 className="text-blue-800 dark:text-blue-200 font-medium">Mobile View Simulation</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            This story simulates the mobile view. The hamburger menu can be clicked to toggle the sidebar.
          </p>
        </div>
        <GlobalNavigation {...args} />
      </div>
    );
  },
}; 