import React, { useCallback } from 'react';
import { StockDataForm } from './StockDataForm';
import { DataTableView } from './DataTableView';
import { fetchStockData } from '../services/yfinanceService';
import { exportToCsv, exportToExcel } from '../utils/dataExportUtils';
import { StockDataFormParams, YFinanceApiResponse, YFinanceDataType } from '../types';

interface StockDataAnalyzerProps {
  formParams: StockDataFormParams;
  setFormParams: React.Dispatch<React.SetStateAction<StockDataFormParams>>;
  fetchedData: YFinanceApiResponse | null;
  setFetchedData: React.Dispatch<React.SetStateAction<YFinanceApiResponse | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin inline-block -ml-1 mr-2 h-4 w-4 text-light-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const StockDataAnalyzer: React.FC<StockDataAnalyzerProps> = ({
  formParams,
  setFormParams,
  fetchedData,
  setFetchedData,
  isLoading,
  setIsLoading,
  error,
  setError,
}) => {
  const handleParamChange = useCallback(
    <K extends keyof StockDataFormParams>(key: K, value: StockDataFormParams[K]) => {
      setFormParams((prev) => ({ ...prev, [key]: value }));
    },
    [setFormParams]
  );

  const handleSubmit = useCallback(async () => {
    if (!formParams.symbol) {
      setError('Stock Symbol is required.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setFetchedData(null);

    try {
      // Convert only alphabetic characters to uppercase, preserve special characters
      const uppercaseSymbol = formParams.symbol.replace(/[a-zA-Z]+/g, match => match.toUpperCase());
      const response: YFinanceApiResponse = await fetchStockData(uppercaseSymbol, formParams.dataType);
      
      // Check for API-level error within the response structure
      const symbolData = response[uppercaseSymbol]; // Using the converted symbol
      if (!symbolData || (symbolData && 'error' in symbolData && symbolData.error)) {
        setError('Please double-check the Yahoo Finance symbol. Note that it might be different from your local stock exchange symbol (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
        setFetchedData(null);
      } else {
        setFetchedData(response);
      }
    } catch (err) {
      setError('Please double-check the Yahoo Finance symbol. Note that it might be different from your local stock exchange symbol (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
      setFetchedData(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setFetchedData]);

  const handleDownloadCsv = () => {
    if (fetchedData && formParams.symbol) {
      exportToCsv(fetchedData, `${formParams.symbol}_${formParams.dataType.replace(/\s+/g, '_')}.csv`, formParams.dataType, formParams.symbol);
    }
  };

  const handleDownloadExcel = () => {
    if (fetchedData && formParams.symbol) {
      exportToExcel(fetchedData, `${formParams.symbol}_${formParams.dataType.replace(/\s+/g, '_')}.xlsx`, formParams.dataType, formParams.symbol);
    }
  };
  
  const dataAvailable = fetchedData && fetchedData[formParams.symbol.toUpperCase()] && !('error' in fetchedData[formParams.symbol.toUpperCase()]);


  return (
    <div className="w-full">
      <StockDataForm
        params={formParams}
        onParamChange={handleParamChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <div className="mt-3 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          Uses the yfinance Python package in the background. The backend is set up as a FastAPI-MCP wrapper over the yfinance package, with all source codes shared in the documentation.
        </p>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="p-4 text-center text-light-blue-600 border border-light-blue-200 rounded-md bg-light-blue-50 min-h-[140px] flex items-center justify-center">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-light-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching data for {formParams.symbol}...
            </div>
          </div>
        )}
        
        {!isLoading && dataAvailable && (
          <div className="p-3 bg-light-blue-50 border border-light-blue-200 rounded-md min-h-[140px]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Financials for {formParams.symbol.toUpperCase()} - {formParams.dataType}</h3>
            <div className="space-x-3 mb-4">
              <button
                onClick={handleDownloadCsv}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors shadow-sm"
              >
                Download CSV
              </button>
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm"
              >
                Download Excel
              </button>
            </div>
            <DataTableView data={fetchedData} dataType={formParams.dataType} symbol={formParams.symbol} />
          </div>
        )}
        
        {!isLoading && !dataAvailable && error && (
          <div className="p-4 text-center border border-red-200 rounded-md bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-bold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && !dataAvailable && !error && (
          <div className="p-4 text-center text-gray-500 italic border border-gray-200 rounded-md bg-gray-50 min-h-[140px] flex items-center justify-center">
            No data to display. Enter a symbol, select a data type, and click "Generate".
          </div>
        )}
      </div>

    </div>
  );
};
