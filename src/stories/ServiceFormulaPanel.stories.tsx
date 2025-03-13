import type { Meta, StoryObj } from '@storybook/react';
import { ServiceFormulaPanel, type ServiceFormulaData } from '../components/ServiceFormulaPanel';

const meta: Meta<typeof ServiceFormulaPanel> = {
  title: 'Service/ServiceFormulaPanel',
  component: ServiceFormulaPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceFormulaPanel>;

// Empty formula state
export const EmptyFormula: Story = {
  name: 'ServiceExecution – Empty Formula',
  args: {
    initialData: {},
    onSave: (data) => console.log('Formula saved:', data),
    onVoiceCommand: (command) => console.log('Voice command:', command),
  },
};

// Populated formula state
export const PopulatedFormula: Story = {
  name: 'ServiceExecution – Populated Formula',
  args: {
    initialData: {
      name: "Hair Color Deluxe",
      ingredients: "Base Color 20ml, Developer 30ml",
      technique: "Apply evenly starting from roots",
      beforeChecklist: [
        { id: 'before-1', text: 'Client consultation complete', checked: true },
        { id: 'before-2', text: 'Tools and equipment prepared', checked: true },
        { id: 'before-3', text: 'Patch test performed', checked: false }
      ],
      duringChecklist: [
        { id: 'during-1', text: 'Process timing monitored', checked: true },
        { id: 'during-2', text: 'Client comfort checked', checked: true },
        { id: 'during-3', text: 'Mid-process rinse checked', checked: false }
      ],
      afterChecklist: [
        { id: 'after-1', text: 'Results reviewed with client', checked: false },
        { id: 'after-2', text: 'Home care instructions provided', checked: false },
        { id: 'after-3', text: 'Post-application conditioning done', checked: true }
      ]
    },
    onSave: (data) => console.log('Formula saved:', data),
    onVoiceCommand: (command) => console.log('Voice command:', command),
  },
};

// Edit mode state
export const EditMode: Story = {
  name: 'ServiceExecution – Edit Mode',
  render: () => {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-md">
          <h3 className="text-blue-800 dark:text-blue-200 font-medium">Edit Mode Demo</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            This story simulates the edit mode of the service formula panel. Click the edit button (pencil icon) to toggle edit mode.
          </p>
        </div>
        <ServiceFormulaPanel 
          initialData={{
            name: "Hair Color Treatment",
            ingredients: "Color: #5B, Developer: 20 vol, 1:1 ratio",
            technique: "Section hair into quadrants. Apply to roots first, then mid-lengths and ends.",
            beforeChecklist: [
              { id: 'before-1', text: 'Client consultation complete', checked: true },
              { id: 'before-2', text: 'Patch test results verified', checked: true }
            ],
            duringChecklist: [
              { id: 'during-1', text: 'Process timing monitored', checked: false }
            ],
            afterChecklist: [
              { id: 'after-1', text: 'Result photos taken', checked: false }
            ]
          }}
          onSave={(data) => console.log('Formula saved:', data)}
          onVoiceCommand={(command) => console.log('Voice command:', command)}
        />
      </div>
    );
  }
}; 