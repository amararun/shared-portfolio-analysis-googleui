import React from 'react';
import { StockDataFormParams, YFinanceDataType } from '../types';

interface StockDataFormProps {
  params: StockDataFormParams;
  onParamChange: <K extends keyof StockDataFormParams>(
    key: K,
    value: StockDataFormParams[K]
  ) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const inputBaseClasses = "block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm disabled:opacity-50";
const labelBaseClasses = "block text-sm font-normal text-black mb-0.5"; // Changed to font-normal for sharper appearance

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const StockDataForm: React.FC<StockDataFormProps> = ({
  params,
  onParamChange,
  onSubmit,
  isLoading,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onParamChange(name as keyof StockDataFormParams, value as StockDataFormParams[keyof StockDataFormParams]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="flex-grow min-w-[150px] sm:min-w-[200px]">
          <label htmlFor="symbol" className={labelBaseClasses}>
            Yahoo Finance Symbol <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="symbol"
            id="symbol"
            value={params.symbol}
            onChange={handleInputChange}
            className={inputBaseClasses}
            placeholder="e.g., AAPL, MSFT"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex-grow min-w-[200px] sm:min-w-[250px]">
          <label htmlFor="dataType" className={labelBaseClasses}>
            Data Type <span className="text-red-500">*</span>
          </label>
          <select
            name="dataType"
            id="dataType"
            value={params.dataType}
            onChange={handleInputChange}
            className={inputBaseClasses}
            required
            disabled={isLoading}
          >
            {Object.values(YFinanceDataType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div className="pt-4"> {/* Aligns button better */}
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
