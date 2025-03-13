import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentCalendar, AppointmentStatus, type AppointmentData, type ServiceProvider } from '../components/AppointmentCalendar';

const meta: Meta<typeof AppointmentCalendar> = {
  title: 'Appointments/AppointmentCalendar',
  component: AppointmentCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppointmentCalendar>;

// Sample service providers
const sampleProviders: ServiceProvider[] = [
  { id: 'stylist-a', name: 'Stylist A', color: '#4F46E5' },
  { id: 'stylist-b', name: 'Stylist B', color: '#EC4899' },
];

// Sample appointments for populated state
const sampleAppointments: AppointmentData[] = [
  {
    id: 'appt-1',
    date: new Date('2025-05-25T10:00:00'),
    duration: 60, // 60 minutes
    providerId: 'stylist-a',
    providerName: 'Stylist A',
    clientId: 'client-1',
    clientName: 'Emily Smith',
    serviceType: 'Haircut',
    status: AppointmentStatus.Confirmed,
  },
  {
    id: 'appt-2',
    date: new Date('2025-05-25T11:30:00'),
    duration: 90, // 90 minutes
    providerId: 'stylist-b',
    providerName: 'Stylist B',
    clientId: 'client-2',
    clientName: 'John Doe',
    serviceType: 'Color Treatment',
    status: AppointmentStatus.Confirmed,
  },
  {
    id: 'appt-3',
    date: new Date('2025-05-26T14:00:00'),
    duration: 45, // 45 minutes
    providerId: 'stylist-a',
    providerName: 'Stylist A',
    clientId: 'client-3',
    clientName: 'Lisa Johnson',
    serviceType: 'Blowout',
    status: AppointmentStatus.Pending,
  },
  {
    id: 'appt-4',
    date: new Date('2025-05-27T09:30:00'),
    duration: 120, // 120 minutes
    providerId: 'stylist-b',
    providerName: 'Stylist B',
    clientId: 'client-4',
    clientName: 'Robert Williams',
    serviceType: 'Color and Cut',
    status: AppointmentStatus.Confirmed,
  },
  {
    id: 'appt-5',
    date: new Date('2025-05-28T13:00:00'),
    duration: 60, // 60 minutes
    providerId: 'stylist-a',
    providerName: 'Stylist A',
    clientId: 'client-5',
    clientName: 'Sarah Davis',
    serviceType: 'Haircut',
    status: AppointmentStatus.NoShow,
  },
];

// Set a fixed date for the stories (May 25, 2025)
const storyStartDate = new Date('2025-05-25T00:00:00');

// Empty State
export const EmptyState: Story = {
  name: 'Calendar – Empty State',
  args: {
    appointments: [],
    providers: sampleProviders,
    startDate: storyStartDate,
    startHour: 9,
    endHour: 18,
    onAppointmentClick: (appointment) => console.log('Appointment clicked:', appointment),
    onSlotClick: (date, providerId) => console.log('Slot clicked:', date, providerId),
  },
};

// Populated State
export const PopulatedState: Story = {
  name: 'Calendar – Populated State',
  args: {
    appointments: sampleAppointments,
    providers: sampleProviders,
    startDate: storyStartDate,
    startHour: 9,
    endHour: 18,
    onAppointmentClick: (appointment) => console.log('Appointment clicked:', appointment),
    onSlotClick: (date, providerId) => console.log('Slot clicked:', date, providerId),
  },
};

// Error/Conflict State
export const ConflictState: Story = {
  name: 'Calendar – Error/Conflict State',
  render: () => {
    // Create appointments with conflict
    const conflictingAppointments = [
      ...sampleAppointments,
      {
        id: 'appt-conflict',
        date: new Date('2025-05-25T10:15:00'), // Overlaps with first appointment
        duration: 60,
        providerId: 'stylist-a',
        providerName: 'Stylist A',
        clientId: 'client-6',
        clientName: 'Michael Brown',
        serviceType: 'Beard Trim',
        status: AppointmentStatus.Pending,
      }
    ];
    
    return (
      <div className="p-4">
        <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Conflict Detection Demo</h3>
          <p className="text-sm text-yellow-600">
            This example demonstrates the conflict detection. Click on the "Michael Brown" appointment 
            (which overlaps with "Emily Smith") to see the conflict message appear.
          </p>
        </div>
        
        <AppointmentCalendar 
          appointments={conflictingAppointments}
          providers={sampleProviders}
          startDate={storyStartDate}
          startHour={9}
          endHour={18}
          onAppointmentClick={(appointment) => console.log('Appointment clicked:', appointment)}
          onSlotClick={(date, providerId) => console.log('Slot clicked:', date, providerId)}
        />
      </div>
    );
  },
}; 