"use client";

import { useState, useMemo } from 'react';
import { addDays, format, startOfWeek, startOfDay, addHours, isWithinInterval, isSameDay } from 'date-fns';
import { AlertCircle } from 'lucide-react';

// Define appointment status types
export enum AppointmentStatus {
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  NoShow = 'NO_SHOW',
  Cancelled = 'CANCELLED'
}

// Define appointment data structure
export interface AppointmentData {
  id: string;
  date: Date;
  duration: number; // Duration in minutes
  providerId: string;
  providerName: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  status: AppointmentStatus;
  notes?: string;
}

// Define service provider data structure
export interface ServiceProvider {
  id: string;
  name: string;
  color: string;
}

interface AppointmentCalendarProps {
  appointments: AppointmentData[];
  providers: ServiceProvider[];
  startDate?: Date;
  startHour?: number;
  endHour?: number;
  onAppointmentClick?: (appointment: AppointmentData) => void;
  onSlotClick?: (date: Date, providerId: string) => void;
}

export const AppointmentCalendar = ({
  appointments = [],
  providers = [],
  startDate = new Date(),
  startHour = 9,
  endHour = 17,
  onAppointmentClick = () => {},
  onSlotClick = () => {}
}: AppointmentCalendarProps) => {
  // State for calendar navigation and selected date
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startOfDay(startDate), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [conflict, setConflict] = useState<{ isConflict: boolean, message: string }>({ 
    isConflict: false, 
    message: "" 
  });

  // Generate calendar days (week view)
  const calendarDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      return addDays(currentWeekStart, index);
    });
  }, [currentWeekStart]);

  // Generate time slots
  const timeSlots = useMemo(() => {
    return Array.from({ length: (endHour - startHour) * 2 }).map((_, index) => {
      const hour = Math.floor(index / 2) + startHour;
      const minutes = (index % 2) * 30;
      return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    });
  }, [startHour, endHour]);

  // Process appointments for the calendar display
  const calendarAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      // Check if appointment is within the displayed week
      return calendarDays.some(day => isSameDay(day, appointmentDate));
    });
  }, [appointments, calendarDays]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  // Check for conflicts in the appointments
  const checkForConflicts = (appointment: AppointmentData) => {
    // Example conflict check logic
    const conflicts = calendarAppointments.filter(a => 
      a.providerId === appointment.providerId && 
      a.id !== appointment.id &&
      isAppointmentOverlapping(a, appointment)
    );
    
    if (conflicts.length > 0) {
      setConflict({
        isConflict: true,
        message: "Conflict Detected: Please adjust the appointment time."
      });
      
      // Auto-dismiss the error after 5 seconds
      setTimeout(() => {
        setConflict({ isConflict: false, message: "" });
      }, 5000);
    }
  };

  // Helper to check if two appointments overlap
  const isAppointmentOverlapping = (a1: AppointmentData, a2: AppointmentData) => {
    const a1Start = new Date(a1.date);
    const a1End = addHours(a1Start, a1.duration / 60);
    
    const a2Start = new Date(a2.date);
    const a2End = addHours(a2Start, a2.duration / 60);
    
    return isWithinInterval(a1Start, { start: a2Start, end: a2End }) ||
           isWithinInterval(a1End, { start: a2Start, end: a2End }) ||
           isWithinInterval(a2Start, { start: a1Start, end: a1End }) ||
           isWithinInterval(a2End, { start: a1Start, end: a1End });
  };

  // Get appointment position styles for rendering
  const getAppointmentPosition = (appointment: AppointmentData) => {
    const appointmentDate = new Date(appointment.date);
    const dayIndex = calendarDays.findIndex(day => isSameDay(day, appointmentDate));
    
    // Calculate top position based on time
    const hours = appointmentDate.getHours();
    const minutes = appointmentDate.getMinutes();
    const topPercentage = ((hours - startHour) * 60 + minutes) / ((endHour - startHour) * 60) * 100;
    
    // Calculate height based on duration
    const heightPercentage = (appointment.duration / ((endHour - startHour) * 60)) * 100;
    
    // Map provider to the available column
    const providerIndex = providers.findIndex(p => p.id === appointment.providerId);
    const totalProviders = providers.length || 1;
    const widthPercentage = 100 / totalProviders;
    const leftPercentage = (providerIndex / totalProviders) * 100;
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
    };
  };

  // Get status-based style classes for appointments
  const getAppointmentStatusClass = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Confirmed:
        return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200';
      case AppointmentStatus.Pending:
        return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case AppointmentStatus.NoShow:
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200';
      case AppointmentStatus.Cancelled:
        return 'bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  // Handle slot click
  const handleSlotClick = (day: Date, hour: number, minute: number, providerId: string) => {
    const date = new Date(day);
    date.setHours(hour, minute, 0, 0);
    setSelectedDate(date);
    onSlotClick(date, providerId);
  };

  // Handle appointment click
  const handleAppointmentClick = (appointment: AppointmentData) => {
    checkForConflicts(appointment);
    onAppointmentClick(appointment);
  };

  // Helper to parse time string
  const parseTimeString = (timeString: string) => {
    const [hour, minute] = timeString.split(':').map(Number);
    return { hour, minute };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden max-w-6xl mx-auto">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appointment Calendar</h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <div className="text-gray-700 dark:text-gray-300 font-medium">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
          </div>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* Conflict Error Message */}
      {conflict.isConflict && (
        <div className="m-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{conflict.message}</span>
        </div>
      )}

      {/* Provider Headers */}
      <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"></div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${providers.length || 1}, 1fr)` }}>
          {providers.map(provider => (
            <div 
              key={provider.id} 
              className="p-2 text-center font-medium border-r border-gray-200 dark:border-gray-700"
              style={{ borderBottom: `3px solid ${provider.color}` }}
            >
              {provider.name}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative overflow-x-auto">
        <div className="grid grid-cols-[100px_1fr]">
          {/* Time labels */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            {timeSlots.map(time => (
              <div key={time} className="h-16 border-b border-gray-200 dark:border-gray-700 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="grid grid-cols-7">
            {calendarDays.map(day => (
              <div 
                key={day.toString()} 
                className="border-r border-gray-200 dark:border-gray-700 relative"
              >
                {/* Day header */}
                <div className="p-2 text-center font-medium border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <div className="text-sm">{format(day, 'EEE')}</div>
                  <div className={`text-lg ${isSameDay(day, new Date()) ? 'bg-blue-100 dark:bg-blue-900 rounded-full h-8 w-8 flex items-center justify-center mx-auto' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  {timeSlots.map(time => (
                    <div 
                      key={`${day}-${time}`} 
                      className="h-16 border-b border-gray-200 dark:border-gray-700 grid"
                      style={{ gridTemplateColumns: `repeat(${providers.length || 1}, 1fr)` }}
                    >
                      {/* Create slots for each provider */}
                      {providers.map(provider => {
                        const { hour, minute } = parseTimeString(time);
                        return (
                          <div 
                            key={`${day}-${time}-${provider.id}`}
                            className="border-r border-gray-200 dark:border-gray-700 h-full hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleSlotClick(day, hour, minute, provider.id)}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Appointments */}
                {calendarAppointments
                  .filter(appointment => isSameDay(new Date(appointment.date), day))
                  .map(appointment => {
                    const positionStyle = getAppointmentPosition(appointment);
                    const statusClass = getAppointmentStatusClass(appointment.status);
                    
                    return (
                      <div
                        key={appointment.id}
                        className={`absolute rounded p-2 border-l-4 shadow-sm text-xs overflow-hidden cursor-pointer ${statusClass}`}
                        style={{
                          ...positionStyle,
                          zIndex: 20,
                        }}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="font-semibold truncate">{appointment.clientName}</div>
                        <div className="truncate">{appointment.serviceType}</div>
                        <div className="truncate text-xs opacity-75">
                          {format(new Date(appointment.date), 'h:mma')} • {appointment.duration}m
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          <span className="text-sm">Confirmed</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          <span className="text-sm">No-Show</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
          <span className="text-sm">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar; 