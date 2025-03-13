import type { Meta, StoryObj } from '@storybook/react';
import { CampaignCreatorForm, TargetSegment } from '../components/CampaignCreatorForm';

const meta: Meta<typeof CampaignCreatorForm> = {
  title: 'Marketing/CampaignCreatorForm',
  component: CampaignCreatorForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CampaignCreatorForm>;

// Blank Form
export const BlankForm: Story = {
  name: 'CampaignCreator – Blank Form',
  args: {
    initialData: {},
    onSave: (data) => console.log('Campaign saved:', data),
  },
};

// With Sample Data
export const WithSampleData: Story = {
  name: 'CampaignCreator – With Sample Data',
  args: {
    initialData: {
      name: 'Summer Glow Promo',
      targetSegment: TargetSegment.FrequentBooker,
      messageTemplate: 'Enjoy 20% off your next treatment!',
      scheduleDate: new Date('2025-06-01'),
      offerDetails: 'Valid at all locations until 2025-07-01',
      status: 'draft'
    },
    onSave: (data) => console.log('Campaign saved:', data),
  },
};

// Validation Error State
export const ValidationErrorState: Story = {
  name: 'CampaignCreator – Validation / Error State',
  render: () => {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-md">
          <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Validation Demo</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            Try to submit the form without filling in the required fields to see validation errors.
            The form has the following required fields: Campaign Name, Target Segment, Message Template, Schedule Date, and Offer Details.
          </p>
        </div>
        
        <CampaignCreatorForm 
          initialData={{
            name: '', // Empty field to trigger validation error
            targetSegment: '',  // Empty field to trigger validation error
            messageTemplate: 'This message is too long and will show a validation error when it exceeds the character limit of 160 characters. We need to make it really long to demonstrate this validation rule in action for our Storybook story.',
            scheduleDate: null, // Empty field to trigger validation error
            offerDetails: '' // Empty field to trigger validation error
          }}
          onSave={(data) => console.log('Campaign saved:', data)}
        />
      </div>
    );
  },
}; 