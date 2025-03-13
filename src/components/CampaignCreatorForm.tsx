"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Users, MessageSquare, Tag, AlertCircle } from 'lucide-react';

// Define the campaign data structure
export interface CampaignData {
  id?: string;
  name: string;
  targetSegment: string;
  messageTemplate: string;
  scheduleDate: Date | null;
  offerDetails: string;
  status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
}

// Define the segment options (matching the client segmentation types)
export enum TargetSegment {
  HighValue = 'HIGH_VALUE',
  FrequentBooker = 'FREQUENT_BOOKER',
  AtRisk = 'AT_RISK',
  NewClient = 'NEW_CLIENT',
  AllClients = 'ALL_CLIENTS'
}

// The segment display configuration
const segmentConfig = {
  [TargetSegment.HighValue]: {
    label: 'High Value Clients',
    description: 'Clients with high total spending'
  },
  [TargetSegment.FrequentBooker]: {
    label: 'Frequent Bookers',
    description: 'Clients who book regularly'
  },
  [TargetSegment.AtRisk]: {
    label: 'At Risk Clients',
    description: 'Clients who haven\'t booked in a while'
  },
  [TargetSegment.NewClient]: {
    label: 'New Clients',
    description: 'Recently acquired clients'
  },
  [TargetSegment.AllClients]: {
    label: 'All Clients',
    description: 'Send to your entire client base'
  }
};

// Form errors interface
interface FormErrors {
  name?: string;
  targetSegment?: string;
  messageTemplate?: string;
  scheduleDate?: string;
  offerDetails?: string;
}

// Props interface
interface CampaignCreatorFormProps {
  initialData?: Partial<CampaignData>;
  onSave?: (data: CampaignData) => void;
  isLoading?: boolean;
}

export const CampaignCreatorForm = ({
  initialData = {},
  onSave = () => {},
  isLoading = false
}: CampaignCreatorFormProps) => {
  // State for form data
  const [formData, setFormData] = useState<CampaignData>({
    id: initialData.id || '',
    name: initialData.name || '',
    targetSegment: initialData.targetSegment || '',
    messageTemplate: initialData.messageTemplate || '',
    scheduleDate: initialData.scheduleDate || null,
    offerDetails: initialData.offerDetails || '',
    status: initialData.status || 'draft'
  });

  // State for form errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // State for message template character count
  const [charCount, setCharCount] = useState<number>(formData.messageTemplate.length);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Update character count for message template
    if (name === 'messageTemplate') {
      setCharCount(value.length);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, scheduleDate: date }));
    
    // Clear error when date is updated
    if (errors.scheduleDate) {
      setErrors(prev => ({ ...prev, scheduleDate: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.targetSegment) {
      newErrors.targetSegment = 'Please select a target segment';
    }
    
    if (!formData.messageTemplate.trim()) {
      newErrors.messageTemplate = 'Message template is required';
    } else if (formData.messageTemplate.length > 160) {
      newErrors.messageTemplate = 'Message template cannot exceed 160 characters';
    }
    
    if (!formData.scheduleDate) {
      newErrors.scheduleDate = 'Schedule date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (formData.scheduleDate < today) {
        newErrors.scheduleDate = 'Schedule date cannot be in the past';
      }
    }
    
    if (!formData.offerDetails.trim()) {
      newErrors.offerDetails = 'Offer details are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Generate placeholder message based on selected segment
  const getMessagePlaceholder = (): string => {
    const segmentLabel = formData.targetSegment ? 
      segmentConfig[formData.targetSegment as TargetSegment]?.label : 
      'your clients';
    
    return `Hi {clientName}, we have a special offer for ${segmentLabel.toLowerCase()}! 
Enter your message here...`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Creator</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Design and schedule marketing campaigns for your clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Campaign Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Campaign Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter campaign name"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isLoading}
            />
            {errors.name && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>
        </div>

        {/* Target Segment */}
        <div>
          <label htmlFor="targetSegment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Segment *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="targetSegment"
              name="targetSegment"
              value={formData.targetSegment}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                errors.targetSegment ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isLoading}
            >
              <option value="">Select target segment</option>
              {Object.values(TargetSegment).map((segment) => (
                <option key={segment} value={segment}>
                  {segmentConfig[segment].label}
                </option>
              ))}
            </select>
            {errors.targetSegment && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.targetSegment}
              </div>
            )}
          </div>
          {formData.targetSegment && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {segmentConfig[formData.targetSegment as TargetSegment]?.description}
            </p>
          )}
        </div>

        {/* Message Template */}
        <div>
          <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message Template *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="messageTemplate"
              name="messageTemplate"
              value={formData.messageTemplate}
              onChange={handleChange}
              placeholder={getMessagePlaceholder()}
              rows={4}
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                errors.messageTemplate ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isLoading}
              maxLength={160}
            />
            <div className="mt-1 flex justify-between items-center">
              <span className={`text-xs ${charCount > 160 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {charCount}/160 characters
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Use {'{clientName}'} to personalize
              </span>
            </div>
            {errors.messageTemplate && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.messageTemplate}
              </div>
            )}
          </div>
        </div>

        {/* Schedule Date */}
        <div>
          <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Schedule Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              id="scheduleDate"
              selected={formData.scheduleDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              placeholderText="Select schedule date"
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                errors.scheduleDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isLoading}
            />
            {errors.scheduleDate && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.scheduleDate}
              </div>
            )}
          </div>
        </div>

        {/* Offer Details */}
        <div>
          <label htmlFor="offerDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Offer Details *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="offerDetails"
              name="offerDetails"
              value={formData.offerDetails}
              onChange={handleChange}
              placeholder="Enter offer details, such as discount amounts, validity periods, and redemption instructions"
              rows={3}
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                errors.offerDetails ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isLoading}
            />
            {errors.offerDetails && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.offerDetails}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            onClick={() => setFormData({
              id: initialData.id || '',
              name: '',
              targetSegment: '',
              messageTemplate: '',
              scheduleDate: null,
              offerDetails: '',
              status: 'draft'
            })}
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Campaign'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreatorForm; 