
import { YFinanceDataType, YFinanceApiResponse, ApiErrorResponse, YFinanceHistoricalPricesData } from '../types';

const API_BASE_URL = 'https://yfin.hosting.tigzig.com';

const getEndpointForDataType = (dataType: YFinanceDataType): string => {
  switch (dataType) {
    case YFinanceDataType.COMPANY_PROFILE:
      return '/get-detailed-info/';
    case YFinanceDataType.INCOME_STATEMENT:
      return '/excel/get-income-statement/';
    case YFinanceDataType.BALANCE_SHEET:
      return '/excel/get-balance-sheet/';
    case YFinanceDataType.QUARTERLY_INCOME_STATEMENT:
      return '/excel/get-quarterly-income-statement/';
    case YFinanceDataType.CASH_FLOW_STATEMENT:
      return '/excel/get-cash-flow/';
    // HISTORICAL_PRICES is handled by a separate function due to different endpoint and params
    default:
      throw new Error(`Unsupported data type for fetchStockData: ${dataType}`);
  }
};

export const fetchStockData = async (symbol: string, dataType: YFinanceDataType): Promise<YFinanceApiResponse> => {
  if (!symbol) {
    throw new Error('Ticker symbol is required.');
  }
  if (dataType === YFinanceDataType.HISTORICAL_PRICES) {
    throw new Error('Use fetchHistoricalPrices for historical price data.');
  }

  const endpointPath = getEndpointForDataType(dataType);
  const queryParams = new URLSearchParams({ tickers: symbol });
  const requestUrl = `${API_BASE_URL}${endpointPath}?${queryParams.toString()}`;

  console.log(`Fetching YFinance stock data from: ${requestUrl}`);

  const response = await fetch(requestUrl);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} - ${response.statusText || '(No status text)'}.`;
    try {
      const errorData: ApiErrorResponse | { error?: string } = await response.json();
      if ('detail' in errorData && Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMessage = errorData.detail.map(d => `${d.loc.join(' -> ')}: ${d.msg}`).join('\n');
      } else if ('error' in errorData && typeof errorData.error === 'string') {
          errorMessage = `API Error: ${errorData.error}`;
      } else {
          errorMessage += ' The server returned an error, but it was not in a recognized detailed JSON format.';
      }
    } catch (e) {
      errorMessage += ' Additionally, the error response body was not in a parsable JSON format. Check network tab.';
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json() as YFinanceApiResponse;
  } catch (e) {
    throw new Error('Failed to parse successful API response. Expected JSON.');
  }
};


export const fetchHistoricalPrices = async (symbol: string, startDate: string, endDate: string): Promise<YFinanceHistoricalPricesData> => {
  if (!symbol) throw new Error('Ticker symbol is required for historical prices.');
  if (!startDate) throw new Error('Start date is required for historical prices.');
  if (!endDate) throw new Error('End date is required for historical prices.');

  const endpointPath = '/get-all-prices/';
  const queryParams = new URLSearchParams({
    tickers: symbol,
    start_date: startDate,
    end_date: endDate,
  });
  const requestUrl = `${API_BASE_URL}${endpointPath}?${queryParams.toString()}`;

  console.log(`Fetching YFinance historical prices from: ${requestUrl}`);
  const response = await fetch(requestUrl);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} - ${response.statusText || '(No status text)'}.`;
    try {
        // The /get-all-prices/ endpoint might return a simple { "error": "message" }
      const errorData: { error?: string } | ApiErrorResponse = await response.json();
      if (typeof errorData === 'object' && errorData !== null && 'error' in errorData && typeof errorData.error === 'string') {
        errorMessage = `API Error: ${errorData.error}`;
      } else if (typeof errorData === 'object' && errorData !== null && 'detail' in errorData && Array.isArray(errorData.detail)) {
         errorMessage = (errorData as ApiErrorResponse).detail.map(d => `${d.loc.join(' -> ')}: ${d.msg}`).join('\n');
      }
      else {
        errorMessage += ' The server returned an error, but it was not in a recognized JSON format.';
      }
    } catch (e) {
      errorMessage += ' Additionally, the error response body was not in a parsable JSON format. Check network tab.';
    }
    throw new Error(errorMessage);
  }

  try {
    // Expects data like: {"2023-10-20": {"AAPL": {"Open": ..., "Close": ...}}} or {"error": "message"}
    return await response.json() as YFinanceHistoricalPricesData;
  } catch (e) {
    throw new Error('Failed to parse successful API response for historical prices. Expected JSON.');
  }
};
