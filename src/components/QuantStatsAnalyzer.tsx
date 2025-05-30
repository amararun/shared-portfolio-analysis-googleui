import React, { useCallback } from 'react';
import { PortfolioAnalyzerForm } from './PortfolioAnalyzerForm';
import { fetchAnalysisReport } from '../services/analysisService';
import { AnalysisParams, AnalysisResponse } from '../types';

interface QuantStatsAnalyzerProps {
  formParams: AnalysisParams;
  setFormParams: React.Dispatch<React.SetStateAction<AnalysisParams>>;
  reportUrl: string | null;
  setReportUrl: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const QuantStatsAnalyzer: React.FC<QuantStatsAnalyzerProps> = ({
  formParams,
  setFormParams,
  reportUrl,
  setReportUrl,
  isLoading,
  setIsLoading,
  error,
  setError,
}) => {
  const handleParamChange = useCallback(
    <K extends keyof AnalysisParams>(key: K, value: AnalysisParams[K]) => {
      setFormParams((prev) => ({ ...prev, [key]: value }));
    },
    [setFormParams]
  );

  const handleSubmit = useCallback(async () => {
    if (!formParams.symbols || !formParams.start_date || !formParams.end_date) {
      setError('Symbol, Start Date, and End Date are required.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setReportUrl(null); // Clear previous report URL

    try {
      const serviceParams = {
        symbols: formParams.symbols,
        start_date: formParams.start_date,
        end_date: formParams.end_date,
        benchmark: formParams.benchmark.trim() === '' ? undefined : formParams.benchmark,
        risk_free_rate: formParams.risk_free_rate.trim() === '' ? undefined : parseFloat(formParams.risk_free_rate),
      };
      
      const response: AnalysisResponse = await fetchAnalysisReport(serviceParams);
      if (!response.html_url) {
        setError('Please double-check the Yahoo Finance symbol. Note that it might be different from your local stock exchange symbol (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
        setReportUrl(null);
      } else {
        setReportUrl(response.html_url);
      }
    } catch (err) {
      setError('Please double-check the Yahoo Finance symbol. Note that it might be different from your local stock exchange symbol (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com or DM on LinkedIn.');
      setReportUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setReportUrl]);

  return (
    <div className="w-full">
      <PortfolioAnalyzerForm
        params={formParams}
        onParamChange={handleParamChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <div className="mt-3 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> All metrics in this report are generated using the open-source <a href="https://github.com/Lumiwealth/quantstats_lumi" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">QuantStats-LumiWealth Version</a>. While widely used for performance and risk analytics, some calculations may rely on assumptions (e.g., trading days, compounding methods) or be subject to version-specific behavior. Key metrics such as total return and CAGR have been manually reviewed for consistency, but users are encouraged to refer to the <a href="https://github.com/Lumiwealth/quantstats_lumi" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">official documentation</a> for full methodology.
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
              Generating QuantStats report, this may take a few minutes...
            </div>
          </div>
        )}
        
        {!isLoading && reportUrl && (
          <div className="p-3 bg-light-blue-50 border border-light-blue-200 rounded-md min-h-[140px]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">QuantStats Report for {formParams.symbols.toUpperCase()}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(reportUrl, '_blank', 'noopener,noreferrer')}
                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Report
              </button>
              <span className="text-xs text-gray-500">(Opens in a new window)</span>
            </div>
          </div>
        )}
        
        {!isLoading && !reportUrl && error && (
          <div className="p-4 text-center border border-red-200 rounded-md bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-bold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && !reportUrl && !error && (
          <div className="p-4 text-center text-gray-500 italic border border-gray-200 rounded-md bg-gray-50 min-h-[140px] flex items-center justify-center">
            No report generated yet. Enter symbols, dates, and click "Generate".
          </div>
        )}
      </div>
    </div>
  );
};
