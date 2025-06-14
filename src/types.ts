export interface AnalysisParams {
  symbols: string;
  benchmark: string; 
  start_date: string;
  end_date: string;
  risk_free_rate: string; 
}

export interface AnalysisServiceParams {
  symbols: string;
  benchmark?: string;
  start_date: string;
  end_date: string;
  risk_free_rate?: number;
}

export interface AnalysisResponse {
  html_url: string;
}

export interface ApiErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail: ApiErrorDetail[];
}

// Types for Technical Analysis
export interface TechnicalAnalysisFormParams {
  ticker: string;
  daily_start_date: string;
  daily_end_date: string;
  weekly_start_date: string;
  weekly_end_date: string;
}

export interface TechnicalAnalysisServiceParams {
  ticker: string;
  daily_start_date: string;
  daily_end_date: string;
  weekly_start_date: string;
  weekly_end_date: string;
}

export interface TechnicalAnalysisResponse {
  pdf_url: string;
  html_url: string;
}

// Types for YFinance Data Features
export enum YFinanceDataType {
  COMPANY_PROFILE = 'Company Profile',
  INCOME_STATEMENT = 'Income Statement',
  BALANCE_SHEET = 'Balance Sheet',
  QUARTERLY_INCOME_STATEMENT = 'Quarterly Income Statement',
  CASH_FLOW_STATEMENT = 'Cash Flow Statement',
  HISTORICAL_PRICES = 'Historical Prices', // New
}

// --- Stock Data (Financials) Types ---
export interface StockDataFormParams {
  symbol: string;
  dataType: YFinanceDataType; // Excludes HISTORICAL_PRICES for this specific form if handled separately
}

export interface YFinanceCompanyProfileMainInfo {
  [key: string]: string | number | null;
}

export interface YFinanceCompanyProfileOfficer {
  name?: string;
  title?: string;
  age?: number;
  yearBorn?: number;
  [key: string]: any; 
}
export interface YFinanceCompanyProfileData {
  main_info?: YFinanceCompanyProfileMainInfo;
  officers?: YFinanceCompanyProfileOfficer[];
  error?: string;
}

export interface YFinanceFinancialStatementItem {
  metric: string;
  [date: string]: string | number;
}

export interface YFinanceFinancialStatementData {
  dates?: string[];
  data?: YFinanceFinancialStatementItem[];
  error?: string;
}

export interface YFinanceApiResponse { // For general stock data (profile, financials)
  [ticker: string]: YFinanceCompanyProfileData | YFinanceFinancialStatementData | { error?: string };
}

// --- Historical Price Data Types ---
export interface PriceDataFormParams { // New
  symbol: string;
  start_date: string;
  end_date: string;
}

export interface HistoricalPriceEntry { // New
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Dividends: number;
  "Stock Splits": number; // Key matches API output
}

// FIX: Changed YFinanceHistoricalPricesData to a union type
// This clearly distinguishes between a successful response with a date map
// and a response that is solely an error object.
export interface YFinanceHistoricalDateMap {
    [date: string]: { // Date string e.g., "2023-10-20"
        [symbol: string]: HistoricalPriceEntry; // Symbol key e.g., "AAPL"
    } | { error?: string }; // Allow for error at the date/symbol level
}

export type YFinanceHistoricalPricesData = YFinanceHistoricalDateMap | { error: string };


// --- Combined Type for shared components like DataTableView / dataExportUtils ---
export type YFinanceCombinedApiResponse = YFinanceApiResponse | YFinanceHistoricalPricesData;

// Types for FFN (Financial Functions) Stats Analysis
export interface FFNFormParams {
  symbols: string;
  start_date: string;
  end_date: string;
  risk_free_rate: string;
}

export interface FFNServiceParams {
  symbols: string;
  start_date: string;
  end_date: string;
  risk_free_rate?: number;
}

export interface FFNResponse {
  html_report_ffn_url: string;
  input_price_data_csv_url: string;
  cumulative_returns_csv_url: string;
  success: string;
}