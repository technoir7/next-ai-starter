import type { Meta, StoryObj } from '@storybook/react';
import { ClientProfileForm } from '../components/ClientProfileForm';

const meta: Meta<typeof ClientProfileForm> = {
  title: 'Client/ClientProfileForm',
  component: ClientProfileForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClientProfileForm>;

// Empty State
export const EmptyState: Story = {
  name: 'ClientProfile – Empty State',
  args: {
    initialData: {},
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};

// Populated State
export const PopulatedState: Story = {
  name: 'ClientProfile – Populated State',
  args: {
    initialData: {
      firstName: "Emily",
      lastName: "Smith",
      email: "emily.smith@example.com",
      phone: "555-1234",
      address: "123 Beauty Ave, Suite 100",
      hairType: "Curly",
      skinType: "Sensitive",
      allergies: "None",
      preferredTreatments: "Color & Trim",
      birthday: new Date("1990-05-15"),
    },
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};

// Error State
export const ErrorState: Story = {
  name: 'ClientProfile – Error State',
  render: () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Form Validation Errors</h3>
          <p className="text-sm text-gray-500 mb-4">
            This story simulates form validation errors. Try submitting the form without filling in required fields.
          </p>
        </div>
        <ClientProfileForm 
          initialData={{
            firstName: "",
            lastName: "",
            email: "invalid-email",
            phone: "abc123", // Invalid phone format
          }}
          onSubmit={(data) => console.log('Form submitted:', data)}
        />
      </div>
    );
  },
}; 