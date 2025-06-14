import React, { useCallback } from 'react';
import { PriceDataForm } from './PriceDataForm';
import { DataTableView } from './DataTableView';
import { fetchHistoricalPrices } from '../services/yfinanceService';
import { exportToCsv, exportToExcel } from '../utils/dataExportUtils';
import { PriceDataFormParams, YFinanceHistoricalPricesData, YFinanceDataType } from '../types';
import { ERROR_MESSAGES } from '../utils/errorMessages';

interface PriceDataAnalyzerProps {
  formParams: PriceDataFormParams;
  setFormParams: React.Dispatch<React.SetStateAction<PriceDataFormParams>>;
  fetchedData: YFinanceHistoricalPricesData | null;
  setFetchedData: React.Dispatch<React.SetStateAction<YFinanceHistoricalPricesData | null>>;
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

export const PriceDataAnalyzer: React.FC<PriceDataAnalyzerProps> = ({
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
    <K extends keyof PriceDataFormParams>(key: K, value: PriceDataFormParams[K]) => {
      setFormParams((prev) => ({ ...prev, [key]: value }));
    },
    [setFormParams]
  );

  const handleSubmit = useCallback(async () => {
    if (!formParams.symbol || !formParams.start_date || !formParams.end_date) {
      setError('Symbol, Start Date, and End Date are required.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setFetchedData(null);

    try {
      // Convert only alphabetic characters to uppercase, preserve special characters
      const uppercaseSymbol = formParams.symbol.replace(/[a-zA-Z]+/g, match => match.toUpperCase());
      const response = await fetchHistoricalPrices(uppercaseSymbol, formParams.start_date, formParams.end_date);
      
      // FIX: Adjusted for YFinanceHistoricalPricesData union type
      if (response && 'error' in response && typeof response.error === 'string') {
        setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
        setFetchedData(null);
      } else {
        // response is YFinanceHistoricalDateMap
        // Check if the response (which is now YFinanceHistoricalDateMap) is empty
        const dataKeys = Object.keys(response);
        if (dataKeys.length === 0) {
          setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
          setFetchedData(null);
        } else {
          setFetchedData(response);
        }
      }
    } catch (err) {
      setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
      setFetchedData(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setFetchedData]);

  const handleDownloadCsv = () => {
    if (fetchedData && formParams.symbol) {
      exportToCsv(fetchedData, `${formParams.symbol}_historical_prices.csv`, YFinanceDataType.HISTORICAL_PRICES, formParams.symbol);
    }
  };

  const handleDownloadExcel = () => {
    if (fetchedData && formParams.symbol) {
      exportToExcel(fetchedData, `${formParams.symbol}_historical_prices.xlsx`, YFinanceDataType.HISTORICAL_PRICES, formParams.symbol);
    }
  };
  
  // FIX: Adjusted for YFinanceHistoricalPricesData union type
  const dataAvailable = fetchedData && !('error' in fetchedData) && Object.keys(fetchedData).length > 0;

  return (
    <div className="w-full">
      <div className="mt-1 mb-2 sm:mb-3 px-1">
        <p className="text-xs sm:text-sm font-medium text-indigo-700">
          Pull historical price data from Yahoo Finance for any security including stocks, ETFs, indices, commodities, and cryptocurrencies.
        </p>
      </div>
      
      <PriceDataForm
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
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-indigo-600">Fetching historical price data for {formParams.symbol}, this can take up to a minute...</span>
            </div>
        </div>
      )}

        {!isLoading && dataAvailable && (
          <div className="p-3 bg-light-blue-50 border border-light-blue-200 rounded-md min-h-[140px]">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Historical Prices for {formParams.symbol.toUpperCase()}</h3>
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
            <DataTableView data={fetchedData} dataType={YFinanceDataType.HISTORICAL_PRICES} symbol={formParams.symbol} />
          </div>
        )}
        
        {!isLoading && !dataAvailable && error && (
          <div className="p-4 text-center border border-red-200 rounded-md bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-bold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
        {!isLoading && !dataAvailable && !error && (
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
              <span className="font-normal">No data to display. Enter a symbol, select dates, and click "Generate".</span>
            </div>
        )}
      </div>
    </div>
  );
};
