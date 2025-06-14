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

const ChatGPTIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s8 3.582 8 8z" />
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
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Documentation & Source Code</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">QuantStats vs. Security Performance Report</h3>
              <p className="text-gray-600 text-sm mb-2">
                Detailed documentation on methodology, calculations, reconciliations carried out and reasons for variances, if any
              </p>
              <a href="https://ffn.hosting.tigzig.com/static/docs/SPR_QS_METHODOLOGY.html" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                Methodology, Validations, Recons
              </a>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">User Interface Repository</h3>
              <p className="text-gray-600 text-sm mb-2">
                The user interface is Next.js with the agent in N8N connected to backend MCP servers and link below has got the user interface code as well as the N8N schemas.
              </p>
              <a href="https://rex.tigzig.com/mcp-quantstats-agent" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                User Interface with Next.js
              </a>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">Backend Services - Integrated FastAPI-MCP Servers</h3>
              <div className="space-y-2">
                <a href="https://rex.tigzig.com/mcp-server-quantstats" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                  QuantStats Analysis
                </a>
                
                <a href="https://rex.tigzig.com/mcp-server-ffn" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                  Security Performance Report
                </a>
                
                <a href="https://rex.tigzig.com/mcp-server-technical-analysis" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                  Technical Analysis
                </a>
                
                <a href="https://rex.tigzig.com/mcp-server-yahoo-finance" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 hover:underline text-sm block">
                  Financial Data & Historical Prices
                </a>
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
      case 'price-data': 
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
      className={`py-2 px-3 sm:px-6 font-medium text-center transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-none rounded-md tab-compact
                  ${currentTab === tabId 
                    ? 'tab-active' 
                    : 'tab-inactive hover:bg-indigo-50/80'}`}
      aria-selected={currentTab === tabId}
      role="tab"
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="header-gradient text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile header: single row, compact */}
          <div className="flex items-center justify-between py-2 sm:hidden">
            <div className="flex items-center">
              <img src="./fx_logo.png" alt="FX Logo" className="h-6 w-6 mr-2" />
              <h1 className="text-base font-semibold tracking-tight">REX Portfolio Suite</h1>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="https://rex.tigzig.com/n8n-tech-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200"
              >
                <AIIcon />
                AI
              </a>
              <a
                href="https://chatgpt.com/g/g-680a0fba9cd481919073d474bee520fb-portfolio-analytics-quantstats-technicals-fin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200"
              >
                <ChatGPTIcon />
                GPT
              </a>
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-200 shadow-sm"
              >
                <GitHubIcon />
                Docs
              </button>
            </div>
          </div>
          {/* Desktop header: original layout, only visible on sm+ */}
          <div className="hidden sm:flex items-center justify-between py-2">
            <div className="flex items-center">
              <img src="./fx_logo.png" alt="FX Logo" className="h-6 w-6 mr-2" />
              <h1 className="text-lg font-semibold tracking-tight">
                Portfolio Analysis Suite
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="https://rex.tigzig.com/n8n-tech-analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200"
              >
                <AIIcon />
                Talk to AI
              </a>
              <a
                href="https://chatgpt.com/g/g-680a0fba9cd481919073d474bee520fb-portfolio-analytics-quantstats-technicals-fin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200"
              >
                <ChatGPTIcon />
                Talk to ChatGPT
              </a>
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-200 shadow-sm"
              >
                <GitHubIcon />
                Docs
              </button>
            </div>
          </div>
        </div>
      </header>

      <DocsModal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} />

      <div className="flex-grow flex flex-col items-center w-full py-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-800 shadow-sm">
            <span className="font-semibold">Important:</span> Use Yahoo Finance symbols (case-insensitive) for stocks, ETFs, indices, commodities, crypto, and futures — e.g., AAPL, TCS.NS, TCS.BO, BTC-USD, GC=F, ^GSPC. Need help with Yahoo symbols or parameters? Use the <span className="font-medium">AI</span> or <span className="font-medium">GPT</span> option at the top for smart assistance. For any bugs, issues, or questions, drop a note to <a href="mailto:amar@harolikar.com" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">amar@harolikar.com</a>.
          </div>
          <div className="mb-1 sm:mb-2 border-b-2 border-indigo-200" role="tablist" aria-label="Financial Analysis Tools">
            {/* Mobile: Two rows - forced with CSS */}
            <div className="tab-container-mobile">
              <div className="flex gap-1 mb-0.5">
                <TabButton tabId="quantstats" currentTab={activeTab} onClick={setActiveTab}>
                  QuantStats
                </TabButton>
                <TabButton tabId="ffn-stats" currentTab={activeTab} onClick={setActiveTab}>
                  SPR
                </TabButton>
                <TabButton tabId="technical-analysis" currentTab={activeTab} onClick={setActiveTab}>
                  AI Technical
                </TabButton>
              </div>
              <div className="flex gap-1">
                <TabButton tabId="stock-data" currentTab={activeTab} onClick={setActiveTab}> 
                  Financials
                </TabButton>
                <TabButton tabId="price-data" currentTab={activeTab} onClick={setActiveTab}>
                  Price Data
                </TabButton>
              </div>
            </div>
            {/* Desktop: Single row - forced with CSS */}
            <div className="tab-container-desktop gap-1">
              <TabButton tabId="quantstats" currentTab={activeTab} onClick={setActiveTab}>
                QuantStats
              </TabButton>
              <TabButton tabId="ffn-stats" currentTab={activeTab} onClick={setActiveTab}>
                Security Performance
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
          </div>

          <main className="pt-2 pb-6 px-6 w-full bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] card" role="tabpanel">
            {renderTabContent()}
          </main>
        </div>
      </div>
      
      <footer className="bg-white/50 border-t border-indigo-100 py-1 text-xs w-full">
        <div className="flex items-center justify-center px-4">
          <div className="text-xs text-center">
            <span className="text-black">This is not investment advice. For informational purposes only.</span>
            <span className="text-indigo-950/70"> • </span>
            <span className="text-indigo-600 font-medium">Amar Harolikar</span>
            <span className="text-indigo-950/70"> • </span>
            <span className="text-indigo-600">Applied Gen AI</span>
            <span className="text-indigo-950/70"> • </span>
            <a 
              href="mailto:amar@harolikar.com" 
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              amar@harolikar.com
            </a>
            <span className="text-indigo-950/70"> • </span>
            <a 
              href="https://www.linkedin.com/in/amarharolikar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              LinkedIn
            </a>
            <span className="text-indigo-950/70"> • </span>
            <a 
              href="https://www.tigzig.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Tigzig
            </a>
            <span className="text-indigo-950/70"> • </span>
            <a 
              href="https://www.tigzig.com/about-me-amar-harolikar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              About
            </a>
            <span className="text-indigo-950/70"> • </span>
            <a
              href="https://www.tigzig.com/privacy-policy-tigzig"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Privacy
            </a>
            <span className="text-indigo-950/70"> • </span>
            <a
              href="https://www.tigzig.com/terms-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
