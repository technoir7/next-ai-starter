"use client";

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, addMinutes, setHours, setMinutes, isBefore } from 'date-fns';
import { ChevronRight, Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

// Define the service provider type
export interface ServiceProvider {
  id: string;
  name: string;
}

// Define the service type
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

// Define the time slot type
export interface TimeSlot {
  time: Date;
  available: boolean;
}

// Define the widget step type
export enum BookingStep {
  SelectProvider,
  SelectService,
  SelectDateTime,
  Confirmation
}

// Define the widget props
interface OnlineBookingWidgetProps {
  providers: ServiceProvider[];
  services: Service[];
  availableTimeSlots?: TimeSlot[];
  onBookingComplete?: (booking: BookingData) => void;
  isLoading?: boolean;
}

// Define the booking data type
export interface BookingData {
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  duration: number;
  price: number;
}

export const OnlineBookingWidget = ({
  providers = [],
  services = [],
  availableTimeSlots = [],
  onBookingComplete = () => {},
  isLoading = false
}: OnlineBookingWidgetProps) => {
  // State for the current booking step
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.SelectProvider);
  
  // State for the selected provider, service, and date/time
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  
  // State for any validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // State for the booking confirmation
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // Filter available time slots based on the selected date
  const availableTimesForDay = selectedDate
    ? availableTimeSlots.filter(
        slot => selectedDate && slot.time.toDateString() === selectedDate.toDateString()
      )
    : [];

  // Handle provider selection
  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setErrors(prev => ({ ...prev, provider: '' }));
    setCurrentStep(BookingStep.SelectService);
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setErrors(prev => ({ ...prev, service: '' }));
    setCurrentStep(BookingStep.SelectDateTime);
  };

  // Handle time slot selection
  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
    setErrors(prev => ({ ...prev, time: '' }));
  };

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
    setErrors(prev => ({ ...prev, date: '' }));
  };

  // Handle booking confirmation
  const handleBookingConfirm = () => {
    // Validate all selections
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedProvider) {
      newErrors.provider = 'Please select a service provider';
    }
    
    if (!selectedService) {
      newErrors.service = 'Please select a service';
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!selectedTime) {
      newErrors.time = 'Please select an available time slot';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create booking data
    const booking: BookingData = {
      providerId: selectedProvider!.id,
      providerName: selectedProvider!.name,
      serviceId: selectedService!.id,
      serviceName: selectedService!.name,
      date: selectedTime!,
      duration: selectedService!.duration,
      price: selectedService!.price
    };
    
    // Set booking confirmation
    setBookingData(booking);
    setIsBooked(true);
    setCurrentStep(BookingStep.Confirmation);
    
    // Call the onBookingComplete callback
    onBookingComplete(booking);
  };

  // Handle reset to start a new booking
  const handleReset = () => {
    setSelectedProvider(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setErrors({});
    setIsBooked(false);
    setBookingData(null);
    setCurrentStep(BookingStep.SelectProvider);
  };

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    if (!selectedDate) return [];
    
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    const slots = [];
    const startHour = isToday ? Math.max(9, today.getHours() + 1) : 9; // Start from 9 AM or next hour if today
    const endHour = 17; // End at 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) { // Every 30 minutes
        const time = setMinutes(setHours(new Date(selectedDate), hour), minute);
        
        // Skip times in the past
        if (isToday && isBefore(time, new Date())) continue;
        
        // Check if this is an available slot
        const isAvailable = availableTimesForDay.some(
          slot => slot.available && slot.time.getTime() === time.getTime()
        );
        
        // if no available slots are provided, assume all slots are available
        const availability = availableTimesForDay.length === 0 ? true : isAvailable;
        
        slots.push({
          time,
          available: availability
        });
      }
    }
    
    return slots;
  };

  // Calculate end time based on selected time and service duration
  const getEndTime = () => {
    if (!selectedTime || !selectedService) return null;
    return addMinutes(selectedTime, selectedService.duration);
  };

  // Render appropriate content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.SelectProvider:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a Service Provider</h3>
            {errors.provider && (
              <div className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.provider}
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleProviderSelect(provider)}
                >
                  <span className="font-medium">{provider.name}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        );
        
      case BookingStep.SelectService:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a Service</h3>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => setCurrentStep(BookingStep.SelectProvider)}
              >
                Change Provider
              </button>
            </div>
            {errors.service && (
              <div className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.service}
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              {services.map(service => (
                <button
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div>
                    <span className="font-medium block">{service.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration} min · ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        );
        
      case BookingStep.SelectDateTime:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Date & Time</h3>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => setCurrentStep(BookingStep.SelectService)}
              >
                Change Service
              </button>
            </div>
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              {errors.date && (
                <div className="text-sm text-red-600 flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.date}
                </div>
              )}
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  minDate={new Date()}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select a date"
                  dateFormat="MMMM d, yyyy"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Times
                </label>
                {errors.time && (
                  <div className="text-sm text-red-600 flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.time}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {generateTimeSlots().map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.available}
                      className={`p-2 border rounded-md flex justify-center items-center text-sm ${
                        selectedTime && selectedTime.getTime() === slot.time.getTime()
                          ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : slot.available
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                      }`}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {format(slot.time, 'h:mm a')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Confirm Booking Button */}
            <div className="pt-4">
              <button
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleBookingConfirm}
                disabled={!selectedProvider || !selectedService || !selectedDate || !selectedTime}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        );
        
      case BookingStep.Confirmation:
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Booking Confirmed!</h3>
            
            {bookingData && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{bookingData.serviceName}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{bookingData.providerName}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{format(bookingData.date, 'MMMM d, yyyy')}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{format(bookingData.date, 'h:mm a')}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{bookingData.duration} minutes</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">${bookingData.price.toFixed(2)}</span>
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your appointment is confirmed for {selectedTime && format(selectedTime, 'MMMM d, yyyy')} at {selectedTime && format(selectedTime, 'h:mm a')} with {selectedProvider?.name}.
            </p>
            
            <div>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={handleReset}
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Widget Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book an Appointment</h2>
        {currentStep !== BookingStep.Confirmation && !isBooked && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select a service provider and pick an available slot.
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading available appointments...</p>
        </div>
      ) : (
        <div className="p-6">
          {/* Step Content */}
          {renderStepContent()}
        </div>
      )}
    </div>
  );
};

export default OnlineBookingWidget; 