import React, { useCallback } from 'react';
import { PortfolioAnalyzerForm } from './PortfolioAnalyzerForm';
import { fetchAnalysisReport } from '../services/analysisService';
import { AnalysisParams, AnalysisResponse } from '../types';
import { ERROR_MESSAGES } from '../utils/errorMessages';

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
        setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
        setReportUrl(null);
      } else {
        setReportUrl(response.html_url);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
      setReportUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setReportUrl]);

  return (
    <div className="w-full">
      <div className="mt-0 mb-2 sm:mb-3 px-1">
        <p className="text-xs sm:text-sm font-medium text-indigo-700">
          Portfolio performance analysis using QuantStats-Lumi package to generate comprehensive metrics for a security versus a benchmark.
        </p>
      </div>
      
      <PortfolioAnalyzerForm
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
              <span className="text-indigo-600">Generating QuantStats report, this can take up to a minute...</span>
            </div>
          </div>
        )}
        
        {!isLoading && reportUrl && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl min-h-[140px] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 tracking-tight">QuantStats Report for {formParams.symbols.toUpperCase()}</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(reportUrl, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Report
              </button>
              <span className="text-xs text-gray-500 font-medium">(Opens in a new window)</span>
            </div>
          </div>
        )}
        
        {!isLoading && !reportUrl && error && (
          <div className="p-6 text-center border border-red-200 rounded-xl bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-semibold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm leading-relaxed">{error}</p>
         </div>
      )}

        {!isLoading && !reportUrl && !error && (
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <span className="font-normal">No report generated yet. Enter symbols, dates, and click "Generate".</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <p className="text-xs text-gray-700 font-medium mb-2">
          <strong>Important:</strong>
        </p>
        <ol className="text-xs text-gray-600 mt-2 list-decimal list-inside space-y-0.5 leading-snug">
          <li>This is for informational purposes only and should not be considered as investment advice.</li>
          <li>All metrics in this report are generated using the open-source <a href="https://github.com/Lumiwealth/quantstats_lumi" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">QuantStats-LumiWealth Version</a>.</li>
          <li>While widely used for performance and risk analytics, some calculations may rely on assumptions (e.g., trading days, compounding methods) or be subject to version-specific behavior (e.g., variations between QuantStats and FFN reports).</li>
          <li>Key metrics such as total return and CAGR have been manually reviewed for consistency, but users are encouraged to refer to the <a href="https://github.com/Lumiwealth/quantstats_lumi" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">official documentation</a> for full methodology.</li>
          <li>Results should be interpreted in light of the intended use case - acceptable variation may differ depending on the analytical objective or decision context.</li>
          <li>Always validate outputs.</li>
        </ol>
      </div>
    </div>
  );
};
