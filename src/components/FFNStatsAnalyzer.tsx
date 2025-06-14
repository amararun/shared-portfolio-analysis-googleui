import React, { useCallback } from 'react';
import { FFNForm } from './FFNForm';
import { fetchFFNReport } from '../services/ffnService';
import { FFNFormParams, FFNResponse } from '../types';
import { ERROR_MESSAGES } from '../utils/errorMessages';

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
        setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOLS_ERROR);
        setReportData(null);
      } else {
        setReportData(response);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOLS_ERROR);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setReportData]);

  return (
    <div className="w-full">
      <div className="mt-1 mb-2 sm:mb-3 px-1">
        <p className="text-xs sm:text-sm font-medium text-indigo-700">
          Security Performance Report (SPR) for multi-security comparison with return curves and metrics using custom calculations and FFN package — supports multiple Yahoo symbols.
        </p>
      </div>
      
      <FFNForm
        params={formParams}
        onParamChange={handleParamChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      <div className="mt-4">
        {isLoading && (
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-indigo-600">Generating FFN Stats report, this can take up to a minute...</span>
            </div>
          </div>
        )}
        
        {!isLoading && reportData && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl min-h-[140px] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 tracking-tight">Security Performance Report (SPR) for {formParams.symbols.toUpperCase()}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.open(reportData.html_report_ffn_url, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Report
              </button>
              <button
                onClick={() => window.open(reportData.input_price_data_csv_url, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Price Data CSV
              </button>
              <button
                onClick={() => window.open(reportData.cumulative_returns_csv_url, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Returns CSV
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-3 font-medium">
              (All files open in a new window)
            </div>
          </div>
        )}
        
        {!isLoading && !reportData && error && (
          <div className="p-6 text-center border border-red-200 rounded-xl bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-semibold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm leading-relaxed">{error}</p>
          </div>
        )}
        
        {!isLoading && !reportData && !error && (
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <span className="font-normal">No report generated yet. Enter symbols, dates, and click "Generate".</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <p className="text-xs text-gray-700 font-medium mb-2">
          <strong>Important:</strong>
        </p>
        <div className="text-xs text-gray-600 mt-2 leading-snug">
          <strong>Note:</strong> This report is for informational purposes only and should not be considered as investment advice. Metrics in this report are generated using Security Performance Report (SPR) implementations which use custom calculations as well as{' '}
          <a href="https://github.com/pmorissette/ffn" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">FFN package</a> for some of the metrics. 
          While some of the calculations metrics have been validated for consistency, users are encouraged to refer to{' '}
          <a href="https://github.com/amararun/shared-fastapi-mcp-ffn" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">GitHub Repo for SPR</a>, the{' '}
          <a href="https://github.com/pmorissette/ffn" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">official documentation for FFN</a> and{' '}
          <a href="https://github.com/Lumiwealth/quantstats_lumi" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">QuantStats documentation</a>{' '}
          for full methodology details. For a methodology comparison between QuantStats and Security Performance Review implementations, users are advised to refer to this{' '}
          <a href="https://ffn.hosting.tigzig.com/static/docs/SPR_QS_METHODOLOGY.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">methodology reference document</a>. 
          Always validate outputs and interpret results in light of your specific analytical objectives.
        </div>
      </div>
    </div>
  );
}; 