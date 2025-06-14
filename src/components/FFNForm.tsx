import React from 'react';
import { FFNFormParams } from '../types';

interface FFNFormProps {
  params: FFNFormParams;
  onParamChange: <K extends keyof FFNFormParams>(key: K, value: FFNFormParams[K]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const inputBaseClasses = "block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm disabled:opacity-50";
const labelBaseClasses = "block text-sm font-normal text-black mb-0.5";

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const FFNForm: React.FC<FFNFormProps> = ({
  params,
  onParamChange,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="flex-grow min-w-[120px] sm:min-w-[200px]">
          <label htmlFor="symbols" className={labelBaseClasses}>
            Yahoo Finance Symbols (comma-separated) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="symbols"
            value={params.symbols}
            onChange={(e) => onParamChange('symbols', e.target.value)}
            className={inputBaseClasses}
            placeholder="^NSEI,^GSPC,GC=F"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex-grow min-w-[130px]">
          <label htmlFor="start_date" className={labelBaseClasses}>
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            value={params.start_date}
            onChange={(e) => onParamChange('start_date', e.target.value)}
            className={inputBaseClasses}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex-grow min-w-[130px]">
          <label htmlFor="end_date" className={labelBaseClasses}>
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="end_date"
            value={params.end_date}
            onChange={(e) => onParamChange('end_date', e.target.value)}
            className={inputBaseClasses}
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex-grow min-w-[100px] sm:min-w-[120px] max-w-[150px]">
          <label htmlFor="risk_free_rate" className={labelBaseClasses}>
            Risk-Free Rate (%)
          </label>
          <input
            type="number"
            id="risk_free_rate"
            value={params.risk_free_rate}
            onChange={(e) => onParamChange('risk_free_rate', e.target.value)}
            className={inputBaseClasses}
            placeholder="5"
            step="0.1"
            min="0"
            disabled={isLoading}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-light-blue-600 hover:bg-light-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading && <LoadingSpinner />}
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </form>
  );
}; 