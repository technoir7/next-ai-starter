import type { Meta, StoryObj } from '@storybook/react';
import { NotificationReminder, type NotificationSettings, type ReminderDemoClient } from '../components/NotificationReminder';
import { addDays } from 'date-fns';

const meta: Meta<typeof NotificationReminder> = {
  title: 'Notifications/NotificationReminder',
  component: NotificationReminder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationReminder>;

// Sample clients for upcoming appointments
const sampleClients: ReminderDemoClient[] = [
  {
    id: '1',
    name: 'Emily Smith',
    email: 'emily.smith@example.com',
    phone: '555-123-4567',
    appointmentDate: addDays(new Date(), 2),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-987-6543',
    appointmentDate: addDays(new Date(), 1),
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '555-456-7890',
    appointmentDate: addDays(new Date(), 3),
  },
];

// Settings Default State
export const SettingsDefault: Story = {
  name: 'Reminders – Settings Default',
  args: {
    demoClients: sampleClients,
    onSettingsChange: (settings) => console.log('Settings changed:', settings),
    onSendReminder: (clientId, channels) => console.log('Reminder sent to client:', clientId, 'via channels:', channels),
  },
};

// Active Notifications State
export const ActiveNotifications: Story = {
  name: 'Reminders – Active Notifications',
  args: {
    initialSettings: {
      sms: true,
      email: true,
      push: false,
      daysBeforeAppointment: 1,
      reminderTime: '10:00',
      customMessage: 'Hi {clientName}, this is a reminder about your appointment on {appointmentDate}. We look forward to seeing you!',
    },
    demoClients: sampleClients,
    onSettingsChange: (settings) => console.log('Settings changed:', settings),
    onSendReminder: (clientId, channels) => console.log('Reminder sent to client:', clientId, 'via channels:', channels),
  },
};

// Reminder Alert Simulation
export const ReminderAlertSimulation: Story = {
  name: 'Reminders – Reminder Alert Simulation',
  render: () => {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-md">
          <h3 className="text-blue-800 dark:text-blue-200 font-medium">Reminder Alert Demo</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            This story demonstrates the reminder alert functionality. Click the "Send Reminder" button to see the alert appear.
          </p>
        </div>
        
        <NotificationReminder 
          initialSettings={{
            sms: true,
            email: true,
            push: true,
            daysBeforeAppointment: 1,
            reminderTime: '09:00',
            customMessage: 'Hi {clientName}, just a friendly reminder about your appointment tomorrow at {appointmentDate}. Looking forward to seeing you!',
          }}
          demoClients={sampleClients}
          onSettingsChange={(settings) => console.log('Settings changed:', settings)}
          onSendReminder={(clientId, channels) => {
            console.log('Reminder sent to client:', clientId, 'via channels:', channels);
            // In a real implementation, this would trigger an API call to send the reminder
          }}
        />
      </div>
    );
  },
}; 