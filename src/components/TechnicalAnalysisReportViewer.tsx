
import React from 'react';

interface TechnicalAnalysisReportViewerProps {
  htmlUrl: string | null; 
}

export const TechnicalAnalysisReportViewer: React.FC<TechnicalAnalysisReportViewerProps> = ({ htmlUrl }) => {
  console.log("TechnicalAnalysisReportViewer received htmlUrl:", htmlUrl);

  let isMixedContent = false;
  if (htmlUrl && typeof window !== 'undefined' && window.location.protocol === 'https:' && htmlUrl.startsWith('http://')) {
    isMixedContent = true;
    console.warn("Mixed Content Detected: Main page is HTTPS, iframe URL is HTTP.", htmlUrl);
  }

  return (
    <div className="mt-2">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">View HTML Report</h3>
      <div className="w-full border border-gray-300 rounded-md shadow-inner xl:h-[calc(100vh-470px)] min-h-[340px] flex items-center justify-center bg-gray-50 p-2"> {/* Reduced height */}
        {isMixedContent ? (
          <div className="text-center text-orange-700 bg-orange-100 p-4 rounded-md border border-orange-300">
            <p className="font-semibold mb-2">Cannot Display Report Directly</p>
            <p className="text-sm mb-1">
              This report is served over HTTP and cannot be embedded directly into this secure (HTTPS) page due to browser security policies.
            </p>
            <p className="text-sm">
              You can open it in a new tab instead:
            </p>
            <a
              href={htmlUrl!} // htmlUrl is guaranteed to be non-null here
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block px-4 py-2 bg-light-blue-600 text-white font-medium rounded-md hover:bg-light-blue-700 transition-colors"
            >
              Open HTML Report in New Tab
            </a>
          </div>
        ) : htmlUrl ? (
          <iframe
            key={htmlUrl} 
            src={htmlUrl}
            title="Technical Analysis HTML Report"
            className="w-full h-full border-0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms"
          >
            Loading HTML report...
          </iframe>
        ) : (
          <p className="text-gray-500 italic text-center">
            Technical Analysis HTML report will appear here once generated.
          </p>
        )}
      </div>
    </div>
  );
};
