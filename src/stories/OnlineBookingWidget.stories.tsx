import type { Meta, StoryObj } from '@storybook/react';
import { OnlineBookingWidget, type ServiceProvider, type Service, type TimeSlot } from '../components/OnlineBookingWidget';
import { addDays, setHours, setMinutes } from 'date-fns';

const meta: Meta<typeof OnlineBookingWidget> = {
  title: 'Appointments/OnlineBookingWidget',
  component: OnlineBookingWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OnlineBookingWidget>;

// Sample service providers
const sampleProviders: ServiceProvider[] = [
  { id: 'stylist-a', name: 'Stylist A' },
  { id: 'stylist-b', name: 'Stylist B' },
];

// Sample services
const sampleServices: Service[] = [
  { id: 'haircut', name: 'Haircut', duration: 45, price: 35 },
  { id: 'color', name: 'Color Treatment', duration: 90, price: 75 },
  { id: 'highlights', name: 'Highlights', duration: 120, price: 95 },
  { id: 'blowout', name: 'Blowout', duration: 30, price: 25 },
];

// Generate some sample available time slots
const generateAvailableTimeSlots = (): TimeSlot[] => {
  const tomorrow = addDays(new Date(), 1);
  const slots: TimeSlot[] = [];
  
  // Add some available slots for tomorrow
  for (let hour = 9; hour < 17; hour++) {
    for (let minute of [0, 30]) {
      // Make some slots unavailable randomly
      const available = Math.random() > 0.3;
      
      slots.push({
        time: setMinutes(setHours(tomorrow, hour), minute),
        available
      });
    }
  }
  
  // Add more slots for other days
  for (let day = 2; day < 5; day++) {
    const date = addDays(new Date(), day);
    
    for (let hour = 9; hour < 17; hour += 2) { // Fewer slots for other days
      slots.push({
        time: setHours(date, hour),
        available: true
      });
    }
  }
  
  return slots;
};

// Sample time slots
const sampleTimeSlots = generateAvailableTimeSlots();

// Default/Empty State
export const DefaultState: Story = {
  name: 'BookingWidget – Default State',
  args: {
    providers: sampleProviders,
    services: sampleServices,
    onBookingComplete: (data) => console.log('Booking completed:', data),
  },
};

// With Data State
export const WithDataState: Story = {
  name: 'BookingWidget – With Data',
  args: {
    providers: sampleProviders,
    services: sampleServices,
    availableTimeSlots: sampleTimeSlots,
    onBookingComplete: (data) => console.log('Booking completed:', data),
  },
};

// Validation Errors State
export const ValidationErrorsState: Story = {
  name: 'BookingWidget – Validation Errors',
  render: () => {
    return (
      <div className="space-y-4 max-w-md">
        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-md">
          <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">Validation Demo</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            Try to click the "Confirm Booking" button without completing all the required selections to see validation errors.
          </p>
        </div>
        
        <OnlineBookingWidget 
          providers={sampleProviders}
          services={sampleServices}
          availableTimeSlots={sampleTimeSlots}
          onBookingComplete={(data) => console.log('Booking completed:', data)}
        />
      </div>
    );
  },
}; 