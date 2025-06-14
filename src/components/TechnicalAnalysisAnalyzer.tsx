import React, { useCallback } from 'react';
import { TechnicalAnalysisForm } from './TechnicalAnalysisForm';
import { fetchTechnicalAnalysisReport } from '../services/technicalAnalysisService';
import { TechnicalAnalysisFormParams, TechnicalAnalysisResponse } from '../types';
import { ERROR_MESSAGES } from '../utils/errorMessages';

interface TechnicalAnalysisAnalyzerProps {
  formParams: TechnicalAnalysisFormParams;
  setFormParams: React.Dispatch<React.SetStateAction<TechnicalAnalysisFormParams>>;
  reportData: TechnicalAnalysisResponse | null;
  setReportData: React.Dispatch<React.SetStateAction<TechnicalAnalysisResponse | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TechnicalAnalysisAnalyzer: React.FC<TechnicalAnalysisAnalyzerProps> = ({
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
    <K extends keyof TechnicalAnalysisFormParams>(key: K, value: TechnicalAnalysisFormParams[K]) => {
      setFormParams((prev) => ({ ...prev, [key]: value }));
    },
    [setFormParams]
  );

  const handleSubmit = useCallback(async () => {
    if (!formParams.ticker || !formParams.daily_start_date || !formParams.daily_end_date || !formParams.weekly_start_date || !formParams.weekly_end_date) {
      setError('All fields (Ticker, Daily and Weekly date ranges) are required.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setReportData(null); // Clear previous report data

    try {
      const response: TechnicalAnalysisResponse = await fetchTechnicalAnalysisReport(formParams);
      if (!response.html_url || !response.pdf_url) {
        setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
        setReportData(null);
      } else {
        setReportData(response);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.YAHOO_FINANCE_SYMBOL_ERROR);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, [formParams, setError, setIsLoading, setReportData]);

  const htmlReportUrlForViewer = reportData?.html_url ?? null;
  const pdfReportUrlForLink = reportData?.pdf_url;

  return (
    <div className="w-full">
      <div className="mt-1 mb-2 sm:mb-3 px-1">
        <p className="text-xs sm:text-sm font-medium text-indigo-700">
          AI-generated technical analysis where Gemini performs comprehensive technical charting analysis and provides detailed insights report.
        </p>
      </div>
      
      <TechnicalAnalysisForm
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
              <span className="text-indigo-600">Generating Technical Analysis report, this can take up to a minute...</span>
            </div>
        </div>
      )}

        {!isLoading && (pdfReportUrlForLink || htmlReportUrlForViewer) && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl min-h-[140px] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 tracking-tight">Technical Analysis Report for {formParams.ticker.toUpperCase()}</h3>
            <div className="flex flex-wrap gap-2">
              {pdfReportUrlForLink && (
                <button
                  onClick={() => window.open(pdfReportUrlForLink, '_blank', 'noopener,noreferrer')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View PDF Report
                </button>
              )}
              {htmlReportUrlForViewer && (
                <button
                  onClick={() => window.open(htmlReportUrlForViewer, '_blank', 'noopener,noreferrer')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View HTML Report
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-3 font-medium">
              (Opens in a new window)
        </div>
      </div>
        )}
        
        {!isLoading && !pdfReportUrlForLink && !htmlReportUrlForViewer && error && (
          <div className="p-6 text-center border border-red-200 rounded-xl bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
            <p className="font-semibold text-red-700 mb-2">Error</p>
            <p className="text-red-600 text-sm leading-relaxed">{error}</p>
         </div>
      )}
      
        {!isLoading && !pdfReportUrlForLink && !htmlReportUrlForViewer && !error && (
          <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <span className="font-normal">No report generated yet. Enter ticker and date ranges, then click "Generate".</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <p className="text-xs text-gray-700 font-medium mb-2">
          <strong>Important:</strong>
        </p>
        <ol className="text-xs text-gray-600 mt-2 list-decimal list-inside space-y-0.5 leading-snug">
          <li>This is for informational purposes only and should not be considered as investment advice.</li>
          <li>This is a custom-built solution using a general-use setup.</li>
          <li>The AI Technical Analysis report design pulls data from Yahoo Finance, prepares charts, and utilizes Gemini Vision API for charting analysis.</li>
          <li>All prompts and design can be customized. The backend is set up as a reusable component as a FastAPI-MCP server, with all source codes shared in the documentation link above.</li>
          <li>Results should be interpreted in light of the intended use case - acceptable variation may differ depending on the analytical objective or decision context.</li>
          <li>Always validate outputs.</li>
        </ol>
      </div>
    </div>
  );
};
