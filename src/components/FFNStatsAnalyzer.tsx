import React, { useCallback } from 'react';
import { FFNForm } from './FFNForm';
import { fetchFFNReport } from '../services/ffnService';
import { FFNFormParams, FFNResponse } from '../types';

interface FFNStatsAnalyzerProps {
  formParams: FFNFormParams;
  setFormParams: React.Dispatch<React.SetStateAction<FFNFormParams>>;
  reportData: FFNResponse | null;
  setReportData: React.Dispatch<React.SetStateAction<FFNResponse | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FFNStatsAnalyzer: React.FC<FFNStatsAnalyzerProps> = ({
  formParams,
  setFormParams,
  reportData,
  setReportData,
  isLoading,
  setIsLoading,
  error,
  setError,
}) => {
  const handleParamChange = useCallback(
    <K extends keyof FFNFormParams>(key: K, value: FFNFormParams[K]) => {
      setFormParams((prev) => ({ ...prev, [key]: value }));
    },
    [setFormParams]
  );

  const handleSubmit = useCallback(async () => {
    if (!formParams.symbols || !formParams.start_date || !formParams.end_date) {
      setError('Symbols, Start Date, and End Date are required.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setReportData(null); // Clear previous report data

    try {
      const serviceParams = {
        symbols: formParams.symbols,
        start_date: formParams.start_date,
        end_date: formParams.end_date,
        risk_free_rate: formParams.risk_free_rate.trim() === '' ? undefined : parseFloat(formParams.risk_free_rate),
      };
      
      const response: FFNResponse = await fetchFFNReport(serviceParams);
      if (!response.html_report_ffn_url) {
        setError('Please double-check the Yahoo Finance symbols. Note that they might be different from your local stock exchange symbols (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
        setReportData(null);
      } else {
        setReportData(response);
      }
    } catch (err) {
      setError('Please double-check the Yahoo Finance symbols. Note that they might be different from your local stock exchange symbols (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setReportData]);

  return (
    <div className="w-full">
      <FFNForm
        params={formParams}
        onParamChange={handleParamChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <div className="mt-3 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> All metrics in this report are generated using the open-source <a href="https://github.com/pmorissette/ffn" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">FFN library</a>. While FFN is widely used for performance and risk analytics, some calculations may rely on assumptions (e.g., trading days, compounding methods) or exhibit version-specific behavior. In this implementation, input data is sourced from Yahoo Finance, with basic preprocessing applied (e.g., removal of zero or NaN values). For multi-security analysis, date mismatches due to differing exchange calendars are forward-filled for up to five days to align time- an industry-accepted practice with minimal impact on results. Key metrics such as total return and CAGR have been manually reviewed for consistency. For full methodology and codebase, please refer to the <a href="https://github.com/pmorissette/ffn" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">linked documentation</a>.
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
              Generating FFN Stats report, this may take a few minutes...
            </div>
          </div>
        )}
        
        {!isLoading && reportData && (
          <div className="p-3 bg-light-blue-50 border border-light-blue-200 rounded-md min-h-[140px]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">FFN Stats Report for {formParams.symbols.toUpperCase()}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.open(reportData.html_report_ffn_url, '_blank', 'noopener,noreferrer')}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Report
              </button>
              <button
                onClick={() => window.open(reportData.input_price_data_csv_url, '_blank', 'noopener,noreferrer')}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Price Data CSV
              </button>
              <button
                onClick={() => window.open(reportData.cumulative_returns_csv_url, '_blank', 'noopener,noreferrer')}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Returns CSV
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              (All files open in a new window)
            </div>
          </div>
        )}
        
        {!isLoading && !reportData && error && (
          <div className="p-4 text-center border border-red-200 rounded-md bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-bold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && !reportData && !error && (
          <div className="p-4 text-center text-gray-500 italic border border-gray-200 rounded-md bg-gray-50 min-h-[140px] flex items-center justify-center">
            No report generated yet. Enter symbols, dates, and click "Generate".
          </div>
        )}
      </div>
    </div>
  );
}; 