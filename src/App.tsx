import React, { useState } from 'react';
import { QuantStatsAnalyzer } from './components/QuantStatsAnalyzer';
import { FFNStatsAnalyzer } from './components/FFNStatsAnalyzer';
import { TechnicalAnalysisAnalyzer } from './components/TechnicalAnalysisAnalyzer';
import { StockDataAnalyzer } from './components/StockDataAnalyzer';
import { PriceDataAnalyzer } from './components/PriceDataAnalyzer'; // New Import
import { 
  AnalysisParams, 
  FFNFormParams,
  FFNResponse,
  TechnicalAnalysisFormParams, 
  TechnicalAnalysisResponse as TAResponse,
  StockDataFormParams,
  YFinanceDataType,
  YFinanceApiResponse,
  PriceDataFormParams, // New Import
  YFinanceHistoricalPricesData // New Import
} from './types';
import { getYesterdayDateString, getMonthsAgoDateString, getYearsAgoDateString } from './utils/dateUtils';

type Tab = 'quantstats' | 'ffn-stats' | 'technical-analysis' | 'stock-data' | 'price-data';

const AIIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const GitHubIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.308.678.92.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

const DocsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Documentation & Source Code</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              This application's user interface was built with Google AI Studio Build and is supported by a backend of integrated FastAPI-MCP servers.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">User Interface Repository</h3>
                <a href="https://github.com/amararun/shared-portfolio-analysis-googleui" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-light-blue-600 hover:text-light-blue-800 hover:underline">
                  Portfolio Analysis Suite UI
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Backend Services - Integrated FastAPI-MCP Servers</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700">QuantStats Analysis</h4>
                    <a href="https://rex.tigzig.com/mcp-server-quantstats" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-light-blue-600 hover:text-light-blue-800 hover:underline">
                      FastAPI-MCP Server - Documentation & Repository
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">FFN Stats Analysis</h4>
                    <a href="https://rex.tigzig.com/mcp-server-ffn" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-light-blue-600 hover:text-light-blue-800 hover:underline">
                      FastAPI-MCP Server - Documentation & Repository
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Technical Analysis</h4>
                    <a href="https://rex.tigzig.com/mcp-server-technical-analysis" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-light-blue-600 hover:text-light-blue-800 hover:underline">
                      FastAPI-MCP Server - Documentation & Repository
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Financial Data & Historical Prices</h4>
                    <a href="https://rex.tigzig.com/mcp-server-yahoo-finance" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-light-blue-600 hover:text-light-blue-800 hover:underline">
                      FastAPI-MCP Server - Documentation & Repository
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('quantstats');
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  const initialYesterday = getYesterdayDateString();

  // State for QuantStatsAnalyzer
  const [qsFormParams, setQsFormParams] = useState<AnalysisParams>({
    symbols: '^NSEI', 
    benchmark: '^GSPC',
    start_date: getYearsAgoDateString(10, initialYesterday), 
    end_date: initialYesterday, 
    risk_free_rate: '5',
  });
  const [qsReportUrl, setQsReportUrl] = useState<string | null>(null);
  const [qsIsLoading, setQsIsLoading] = useState<boolean>(false);
  const [qsError, setQsError] = useState<string | null>(null);

  // State for FFNStatsAnalyzer
  const [ffnFormParams, setFfnFormParams] = useState<FFNFormParams>({
    symbols: '^NSEI,^GSPC,GC=F',
    start_date: getYearsAgoDateString(10, initialYesterday),
    end_date: initialYesterday,
    risk_free_rate: '5',
  });
  const [ffnReportData, setFfnReportData] = useState<FFNResponse | null>(null);
  const [ffnIsLoading, setFfnIsLoading] = useState<boolean>(false);
  const [ffnError, setFfnError] = useState<string | null>(null);

  // State for TechnicalAnalysisAnalyzer
  const [taFormParams, setTaFormParams] = useState<TechnicalAnalysisFormParams>({
    ticker: '^GSPC',
    daily_start_date: getMonthsAgoDateString(6, initialYesterday),
    daily_end_date: initialYesterday,
    weekly_start_date: getYearsAgoDateString(3, initialYesterday),
    weekly_end_date: initialYesterday,
  });
  const [taReportData, setTaReportData] = useState<TAResponse | null>(null);
  const [taIsLoading, setTaIsLoading] = useState<boolean>(false);
  const [taError, setTaError] = useState<string | null>(null);

  // State for StockDataAnalyzer (YFinance Financials)
  const [sdFormParams, setSdFormParams] = useState<StockDataFormParams>({
    symbol: 'AAPL',
    dataType: YFinanceDataType.COMPANY_PROFILE,
  });
  const [sdFetchedData, setSdFetchedData] = useState<YFinanceApiResponse | null>(null);
  const [sdIsLoading, setSdIsLoading] = useState<boolean>(false);
  const [sdError, setSdError] = useState<string | null>(null);

  // State for PriceDataAnalyzer (YFinance Historical Prices) - New
  const [priceDataFormParams, setPriceDataFormParams] = useState<PriceDataFormParams>({
    symbol: 'GOOG',
    start_date: getYearsAgoDateString(1, initialYesterday),
    end_date: initialYesterday,
  });
  const [pdFetchedData, setPdFetchedData] = useState<YFinanceHistoricalPricesData | null>(null);
  const [pdIsLoading, setPdIsLoading] = useState<boolean>(false);
  const [pdError, setPdError] = useState<string | null>(null);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'quantstats':
        return (
          <QuantStatsAnalyzer
            formParams={qsFormParams}
            setFormParams={setQsFormParams}
            reportUrl={qsReportUrl}
            setReportUrl={setQsReportUrl}
            isLoading={qsIsLoading}
            setIsLoading={setQsIsLoading}
            error={qsError}
            setError={setQsError}
          />
        );
      case 'ffn-stats':
        return (
          <FFNStatsAnalyzer
            formParams={ffnFormParams}
            setFormParams={setFfnFormParams}
            reportData={ffnReportData}
            setReportData={setFfnReportData}
            isLoading={ffnIsLoading}
            setIsLoading={setFfnIsLoading}
            error={ffnError}
            setError={setFfnError}
          />
        );
      case 'technical-analysis':
        return (
          <TechnicalAnalysisAnalyzer
            formParams={taFormParams}
            setFormParams={setTaFormParams}
            reportData={taReportData}
            setReportData={setTaReportData}
            isLoading={taIsLoading}
            setIsLoading={setTaIsLoading}
            error={taError}
            setError={setTaError}
          />
        );
      case 'stock-data':
        return (
          <StockDataAnalyzer
            formParams={sdFormParams}
            setFormParams={setSdFormParams}
            fetchedData={sdFetchedData}
            setFetchedData={setSdFetchedData}
            isLoading={sdIsLoading}
            setIsLoading={setSdIsLoading}
            error={sdError}
            setError={setSdError}
          />
        );
      case 'price-data': // New Case
        return (
          <PriceDataAnalyzer
            formParams={priceDataFormParams}
            setFormParams={setPriceDataFormParams}
            fetchedData={pdFetchedData}
            setFetchedData={setPdFetchedData}
            isLoading={pdIsLoading}
            setIsLoading={setPdIsLoading}
            error={pdError}
            setError={setPdError}
          />
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabId: Tab; currentTab: Tab; onClick: (tabId: Tab) => void; children: React.ReactNode }> = 
    ({ tabId, currentTab, onClick, children }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`py-3 px-6 font-medium text-center transition-all duration-150
                  ${currentTab === tabId 
                    ? 'tab-active' 
                    : 'tab-inactive hover:bg-blue-50/50'}`}
      aria-selected={currentTab === tabId}
      role="tab"
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-light-blue-50 flex flex-col">
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <img src="./fx_logo.png" alt="FX Logo" className="h-6 w-6 mr-2" />
              <h1 className="text-lg font-semibold">
                Portfolio Analysis Suite
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="https://rex.tigzig.com/n8n-tech-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md text-gray-900 bg-gradient-to-r from-amber-200 to-yellow-100 hover:from-amber-300 hover:to-yellow-200 border border-amber-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-150"
              >
                <AIIcon />
                Talk to AI
              </a>
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-blue-700 focus:ring-green-400 transition-colors"
              >
                <GitHubIcon />
                Docs
              </button>
            </div>
          </div>
        </div>
      </header>

      <DocsModal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} />

      <div className="flex-grow flex flex-col items-center w-full py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <span className="font-semibold">Important:</span> All forms accept Yahoo Finance symbols (case-insensitive). Compatible with stocks, ETFs, indices, commodities, crypto, and futures available on Yahoo Finance. Example formats: AAPL (US stocks), TCS.NS (NSE India), TCS.BO (BSE India), BTC-USD (crypto), GC=F (Gold futures), ^GSPC (S&P 500 index).
          </div>
          <div className="mb-1 flex border-b-2 border-light-blue-200" role="tablist" aria-label="Financial Analysis Tools">
            <TabButton tabId="quantstats" currentTab={activeTab} onClick={setActiveTab}>
              QuantStats
            </TabButton>
            <TabButton tabId="ffn-stats" currentTab={activeTab} onClick={setActiveTab}>
              Stats - FFN
            </TabButton>
            <TabButton tabId="technical-analysis" currentTab={activeTab} onClick={setActiveTab}>
              AI Technical
            </TabButton>
            <TabButton tabId="stock-data" currentTab={activeTab} onClick={setActiveTab}> 
              Financials
            </TabButton>
            <TabButton tabId="price-data" currentTab={activeTab} onClick={setActiveTab}>
              Price Data
            </TabButton>
          </div>

          <main className="mt-1 w-full bg-white p-4 sm:p-6 rounded-b-xl rounded-tr-xl shadow-xl min-h-[600px]" role="tabpanel">
            {renderTabContent()}
          </main>
        </div>
      </div>
      
      <div className="w-full bg-gray-50 border-t border-b border-gray-200 py-2 px-4 sm:px-6 lg:px-8 mt-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Disclaimer:</span> This is not investment advice. Always validate outputs independently. For bugs, issues, or questions, please email <a href="mailto:amar@harolikar.com" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">amar@harolikar.com</a> or DM on <a href="https://www.linkedin.com/in/amarharolikar" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:text-light-blue-800 hover:underline">LinkedIn</a>.
          </p>
        </div>
      </div>
      
      <footer className="bg-white border-t border-light-blue-200 py-2 text-xs text-light-blue-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span>Amar Harolikar</span>
              <span className="text-light-blue-400">•</span>
              <span>Specialist - Decision Sciences & Applied Generative AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://www.linkedin.com/in/amarharolikar" target="_blank" rel="noopener noreferrer"
                className="text-light-blue-600 hover:text-light-blue-700 hover:underline">LinkedIn</a>
              <a href="https://rex.tigzig.com" target="_blank" rel="noopener noreferrer"
                className="text-light-blue-600 hover:text-light-blue-700 hover:underline">rex.tigzig.com</a>
              <a href="https://tigzig.com" target="_blank" rel="noopener noreferrer"
                className="text-light-blue-600 hover:text-light-blue-700 hover:underline">tigzig.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
