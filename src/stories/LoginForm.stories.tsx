import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '../components/LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Authentication/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

// Empty and Error State
export const EmptyAndErrorState: Story = {
  name: 'Login – Empty and Error State',
  args: {
    error: 'Invalid username or password',
    onSubmit: (data) => console.log('Login submitted:', data),
  },
};

// Loading State
export const LoadingState: Story = {
  name: 'Login – Loading State',
  args: {
    isLoading: true,
    onSubmit: (data) => console.log('Login submitted:', data),
  },
};

// Two-Factor Authentication State
export const TwoFactorState: Story = {
  name: 'Login – Two-Factor Authentication',
  args: {
    requiresTwoFactor: true,
    onSubmit: (data) => console.log('Login with 2FA submitted:', data),
  },
};

// Authenticated State
export const AuthenticatedState: Story = {
  name: 'Login – Authenticated State',
  render: () => {
    return (
      <div className="p-4 max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Authentication Successful
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              User has successfully logged in.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 sm:dark:divide-gray-700">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  SalonAdmin
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-green-600 dark:text-green-400 sm:mt-0 sm:col-span-2 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Authenticated
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last login
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {new Date().toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  },
}; 