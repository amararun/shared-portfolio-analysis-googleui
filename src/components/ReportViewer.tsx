import React from 'react';

interface ReportViewerProps {
  reportUrl: string | null;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ reportUrl }) => {
  return (
    <div className="mt-1">
      <h3 className="text-lg font-semibold text-gray-700 mb-1">View Report</h3>
      {/* Container for the iframe, maximized height while keeping footer visible */}
      <div className="w-full border border-gray-300 rounded-md shadow-inner xl:h-[calc(100vh-460px)] min-h-[280px] bg-gray-50 overflow-hidden">
        {reportUrl ? (
          <iframe
            key={reportUrl} 
            src={reportUrl}
            title="Portfolio Analysis Report"
            style={{
              width: 'calc(100% / 0.90)',
              height: 'calc(100% / 0.90)',
              transform: 'scale(0.90)',
              transformOrigin: 'top left',
              border: 'none',
            }}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms" 
          >
            Loading report...
          </iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <p className="text-gray-500 italic text-center">
              QuantStats report will appear here once generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
