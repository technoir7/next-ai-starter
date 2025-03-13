"use client";

import { useState } from 'react';
import { Edit, Save, X, Wand2 } from 'lucide-react';
import { SpeechToTextArea } from './SpeechToTextArea';

// Define the checklist item type
interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

// Define the service formula data type
export interface ServiceFormulaData {
  id?: string;
  name: string;
  ingredients: string;
  technique: string;
  beforeChecklist: ChecklistItem[];
  duringChecklist: ChecklistItem[];
  afterChecklist: ChecklistItem[];
}

// Define the component props
interface ServiceFormulaPanelProps {
  initialData?: Partial<ServiceFormulaData>;
  onSave?: (data: ServiceFormulaData) => void;
  onVoiceCommand?: (command: string) => void;
}

export const ServiceFormulaPanel = ({
  initialData = {},
  onSave = () => {},
  onVoiceCommand = () => {}
}: ServiceFormulaPanelProps) => {
  // State for the service formula data
  const [formulaData, setFormulaData] = useState<ServiceFormulaData>({
    id: initialData.id || '',
    name: initialData.name || '',
    ingredients: initialData.ingredients || '',
    technique: initialData.technique || '',
    beforeChecklist: initialData.beforeChecklist || [
      { id: 'before-1', text: 'Client consultation complete', checked: false },
      { id: 'before-2', text: 'Tools and equipment prepared', checked: false },
      { id: 'before-3', text: 'Patch test performed', checked: false }
    ],
    duringChecklist: initialData.duringChecklist || [
      { id: 'during-1', text: 'Process timing monitored', checked: false },
      { id: 'during-2', text: 'Client comfort checked', checked: false }
    ],
    afterChecklist: initialData.afterChecklist || [
      { id: 'after-1', text: 'Results reviewed with client', checked: false },
      { id: 'after-2', text: 'Home care instructions provided', checked: false },
      { id: 'after-3', text: 'Follow-up appointment scheduled', checked: false }
    ]
  });

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // State for voice command mode
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulaData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checklist item changes
  const handleChecklistChange = (
    listType: 'beforeChecklist' | 'duringChecklist' | 'afterChecklist', 
    itemId: string, 
    isChecked: boolean
  ) => {
    setFormulaData(prev => ({
      ...prev,
      [listType]: prev[listType].map(item => 
        item.id === itemId ? { ...item, checked: isChecked } : item
      )
    }));
  };

  // Handle adding a new checklist item
  const handleAddChecklistItem = (
    listType: 'beforeChecklist' | 'duringChecklist' | 'afterChecklist', 
    text: string
  ) => {
    if (!text.trim()) return;
    
    const newItem: ChecklistItem = {
      id: `${listType}-${Date.now()}`,
      text: text.trim(),
      checked: false
    };
    
    setFormulaData(prev => ({
      ...prev,
      [listType]: [...prev[listType], newItem]
    }));
  };

  // Handle removing a checklist item
  const handleRemoveChecklistItem = (
    listType: 'beforeChecklist' | 'duringChecklist' | 'afterChecklist', 
    itemId: string
  ) => {
    setFormulaData(prev => ({
      ...prev,
      [listType]: prev[listType].filter(item => item.id !== itemId)
    }));
  };

  // Handle save action
  const handleSave = () => {
    // Validate required fields
    if (!formulaData.name || !formulaData.ingredients || !formulaData.technique) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(formulaData);
    setIsEditMode(false);
  };

  // Handle voice command
  const handleVoiceCommand = (text: string) => {
    onVoiceCommand(text);
    setIsVoiceMode(false);
    
    // Simple voice command handling logic
    if (text.toLowerCase().includes('add ingredient')) {
      const ingredientMatch = text.match(/add ingredient (.+)/i);
      if (ingredientMatch && ingredientMatch[1]) {
        const newIngredient = ingredientMatch[1];
        setFormulaData(prev => ({
          ...prev,
          ingredients: prev.ingredients 
            ? `${prev.ingredients}\n${newIngredient}` 
            : newIngredient
        }));
      }
    } else if (text.toLowerCase().includes('add technique')) {
      const techniqueMatch = text.match(/add technique (.+)/i);
      if (techniqueMatch && techniqueMatch[1]) {
        const newTechnique = techniqueMatch[1];
        setFormulaData(prev => ({
          ...prev,
          technique: prev.technique 
            ? `${prev.technique}\n${newTechnique}` 
            : newTechnique
        }));
      }
    } else if (text.toLowerCase().includes('add step')) {
      const stepMatch = text.match(/add step to (before|during|after): (.+)/i);
      if (stepMatch && stepMatch[1] && stepMatch[2]) {
        const listType = `${stepMatch[1].toLowerCase()}Checklist` as 'beforeChecklist' | 'duringChecklist' | 'afterChecklist';
        const stepText = stepMatch[2];
        handleAddChecklistItem(listType, stepText);
      }
    }
  };

  // Voice transcript handler for SpeechToTextArea
  const handleTranscript = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.trim()) {
      handleVoiceCommand(text);
    }
  };

  // Handle speech to text submit
  const handleSpeechSubmit = (text: string): void => {
    if (text) {
      handleVoiceCommand(text);
    }
  };

  // Render the checklist
  const renderChecklist = (
    listType: 'beforeChecklist' | 'duringChecklist' | 'afterChecklist', 
    title: string
  ) => {
    const items = formulaData[listType];
    
    return (
      <div>
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleChecklistChange(listType, item.id, e.target.checked)}
                  disabled={!isEditMode}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor={item.id} 
                  className={`font-medium ${item.checked ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {item.text}
                </label>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(listType, item.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}

          {isEditMode && (
            <li className="mt-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add new item..."
                  className="flex-1 p-1 text-sm border border-gray-300 rounded-l-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handleAddChecklistItem(listType, target.value);
                      target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-2 py-1 text-sm bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  onClick={(e) => {
                    const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                    handleAddChecklistItem(listType, input.value);
                    input.value = '';
                  }}
                >
                  Add
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Panel Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Formula</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsVoiceMode(true)}
            className="p-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
            title="Voice Command"
          >
            <Wand2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (isEditMode) {
                handleSave();
              } else {
                setIsEditMode(true);
              }
            }}
            className={`p-1.5 ${
              isEditMode 
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
            } rounded-full`}
            title={isEditMode ? 'Save' : 'Edit'}
          >
            {isEditMode ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="p-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
              title="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Command Dialog */}
      {isVoiceMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Voice Command</h3>
              <button 
                onClick={() => setIsVoiceMode(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Speak your command. Try phrases like:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                <li>"Add ingredient 20ml Base Color"</li>
                <li>"Add technique Apply evenly from roots to ends"</li>
                <li>"Add step to before: Check client's hair condition"</li>
              </ul>
            </div>
            <SpeechToTextArea 
              value=""
              onChange={handleTranscript}
              isLoading={false}
              placeholder="Speak now..."
              onSubmit={handleSpeechSubmit}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Service Formula Form */}
        <div className="space-y-6">
          {/* Service Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name *
            </label>
            {isEditMode ? (
              <input
                type="text"
                id="name"
                name="name"
                value={formulaData.name}
                onChange={handleInputChange}
                placeholder="Enter formula details here"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                {formulaData.name || <span className="text-gray-400 dark:text-gray-500">No service name provided</span>}
              </div>
            )}
          </div>

          {/* Ingredients/Products */}
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ingredients/Products *
            </label>
            {isEditMode ? (
              <textarea
                id="ingredients"
                name="ingredients"
                value={formulaData.ingredients}
                onChange={handleInputChange}
                placeholder="Enter formula details here"
                rows={4}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-line">
                {formulaData.ingredients || <span className="text-gray-400 dark:text-gray-500">No ingredients provided</span>}
              </div>
            )}
          </div>

          {/* Technique Notes */}
          <div>
            <label htmlFor="technique" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Technique Notes *
            </label>
            {isEditMode ? (
              <textarea
                id="technique"
                name="technique"
                value={formulaData.technique}
                onChange={handleInputChange}
                placeholder="Enter formula details here"
                rows={4}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-line">
                {formulaData.technique || <span className="text-gray-400 dark:text-gray-500">No technique notes provided</span>}
              </div>
            )}
          </div>

          {/* Checklists */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Process Checklist</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before Checklist */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {renderChecklist('beforeChecklist', 'Before')}
              </div>
              
              {/* During Checklist */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {renderChecklist('duringChecklist', 'During')}
              </div>
              
              {/* After Checklist */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {renderChecklist('afterChecklist', 'After')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormulaPanel; 