"use client";

import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, PhoneCall, Settings, Smartphone, Check, X } from 'lucide-react';

export interface NotificationSettings {
  sms: boolean;
  email: boolean;
  push: boolean;
  daysBeforeAppointment: number;
  reminderTime: string;
  customMessage: string;
}

export interface ReminderDemoClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentDate: Date;
}

interface NotificationReminderProps {
  initialSettings?: Partial<NotificationSettings>;
  demoClients?: ReminderDemoClient[];
  onSettingsChange?: (settings: NotificationSettings) => void;
  onSendReminder?: (clientId: string, channels: { sms?: boolean; email?: boolean; push?: boolean }) => void;
}

export const NotificationReminder = ({
  initialSettings = {},
  demoClients = [],
  onSettingsChange = () => {},
  onSendReminder = () => {}
}: NotificationReminderProps) => {
  // Default settings
  const defaultSettings: NotificationSettings = {
    sms: false,
    email: false,
    push: false,
    daysBeforeAppointment: 1,
    reminderTime: '10:00',
    customMessage: 'This is a reminder for your upcoming appointment at our salon.'
  };

  // State for notification settings
  const [settings, setSettings] = useState<NotificationSettings>({
    ...defaultSettings,
    ...initialSettings
  });

  // State for UI
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [lastReminder, setLastReminder] = useState<{
    clientName: string;
    channels: string[];
    timestamp: Date;
  } | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  
  // Handle settings change
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'daysBeforeAppointment') {
      newValue = parseInt(value, 10);
    }
    
    const updatedSettings = {
      ...settings,
      [name]: newValue
    };
    
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };
  
  // Send a reminder to a client
  const handleSendReminder = (client: ReminderDemoClient) => {
    const channels = {
      sms: settings.sms,
      email: settings.email,
      push: settings.push
    };
    
    // Call the onSendReminder callback
    onSendReminder(client.id, channels);
    
    // Create a list of channels used
    const channelList = [];
    if (settings.sms) channelList.push('SMS');
    if (settings.email) channelList.push('Email');
    if (settings.push) channelList.push('Push');
    
    // Update the last reminder state
    setLastReminder({
      clientName: client.name,
      channels: channelList,
      timestamp: new Date()
    });
    
    // Show the success alert
    setAlertVisible(true);
    
    // Hide the alert after 5 seconds
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };
  
  // Calculate days until appointment
  const getDaysUntilAppointment = (appointmentDate: Date): number => {
    const now = new Date();
    const diffTime = appointmentDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Format appointment date
  const formatAppointmentDate = (date: Date): string => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appointment Reminders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and send automated appointment reminders
          </p>
        </div>
        <button
          onClick={() => setIsSettingsVisible(!isSettingsVisible)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          aria-label="Toggle settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {isSettingsVisible && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Settings</h3>
          
          <div className="space-y-4">
            {/* Channel toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sms"
                  name="sms"
                  checked={settings.sms}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="sms" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MessageSquare className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  SMS Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="email"
                  name="email"
                  checked={settings.email}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="push"
                  name="push"
                  checked={settings.push}
                  onChange={handleSettingChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="push" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Push Notifications
                </label>
              </div>
            </div>
            
            {/* Timing settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="daysBeforeAppointment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Days before appointment
                </label>
                <select
                  id="daysBeforeAppointment"
                  name="daysBeforeAppointment"
                  value={settings.daysBeforeAppointment}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value={0}>Same day</option>
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reminder time
                </label>
                <input
                  type="time"
                  id="reminderTime"
                  name="reminderTime"
                  value={settings.reminderTime}
                  onChange={handleSettingChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
            
            {/* Custom message */}
            <div>
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom message template
              </label>
              <textarea
                id="customMessage"
                name="customMessage"
                rows={3}
                value={settings.customMessage}
                onChange={handleSettingChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your custom reminder message here..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                You can use placeholders like {'{clientName}'}, {'{appointmentDate}'}, {'{serviceName}'} in your message.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {alertVisible && lastReminder && (
        <div className="p-4 mx-4 mt-4 mb-0 rounded-md bg-green-50 dark:bg-green-900">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400 dark:text-green-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Reminder Sent Successfully
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Reminder sent to {lastReminder.clientName} via {lastReminder.channels.join(', ')} at {lastReminder.timestamp.toLocaleTimeString()}.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    onClick={() => setAlertVisible(false)}
                    className="bg-green-50 dark:bg-green-900 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-green-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setAlertVisible(false)}
                  className="inline-flex bg-green-50 dark:bg-green-900 rounded-md p-1.5 text-green-500 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-green-900"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments / Reminders */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Appointments</h3>
        
        {demoClients.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {demoClients.map((client) => (
              <li key={client.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{client.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Appointment: {formatAppointmentDate(client.appointmentDate)}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center mr-3 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <PhoneCall className="h-3.5 w-3.5 mr-1" />
                        {client.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-500 dark:text-gray-400">
                      {getDaysUntilAppointment(client.appointmentDate)} days until appointment
                    </span>
                    <button
                      onClick={() => handleSendReminder(client)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={!settings.sms && !settings.email && !settings.push}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Send Reminder
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming appointments</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are no appointments to send reminders for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationReminder; 