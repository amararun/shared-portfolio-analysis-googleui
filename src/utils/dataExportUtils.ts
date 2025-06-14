
import { 
  YFinanceApiResponse, 
  YFinanceDataType, 
  YFinanceCompanyProfileData, 
  YFinanceFinancialStatementData, 
  YFinanceFinancialStatementItem,
  YFinanceHistoricalPricesData, // Union type: YFinanceHistoricalDateMap | { error: string }
  YFinanceHistoricalDateMap,
  HistoricalPriceEntry,
  YFinanceCombinedApiResponse
} from '../types';

declare global {
  interface Window {
    XLSX: any; 
  }
}

const triggerDownload = (content: string, fileName: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// --- Formatters for different data types ---

const formatCompanyProfileData = (profileData: YFinanceCompanyProfileData): { headers: string[], rows: (string|number|null)[][] } => {
  if (!profileData.main_info) return { headers: ['Property', 'Value'], rows: [['No main_info available', '']] };
  
  const headers = ['Property', 'Value'];
  const rows = Object.entries(profileData.main_info).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return [formattedKey, value];
  });
  return { headers, rows };
};

const formatFinancialStatementData = (statementData: YFinanceFinancialStatementData): { headers: string[], rows: (string|number|null)[][] } => {
  if (!statementData.dates || !statementData.data || statementData.dates.length === 0 || statementData.data.length === 0) {
    return { headers: ['Metric', ...(statementData.dates || [])], rows: [['No data available', ...Array(statementData.dates?.length || 0).fill('')]] };
  }

  const headers = ['Metric', ...statementData.dates];
  const rows = statementData.data.map((item: YFinanceFinancialStatementItem) => [
    item.metric,
    ...statementData.dates!.map(date => item[date] ?? null)
  ]);
  return { headers, rows };
};

// FIX: Adjusted historical price data formatting for new YFinanceHistoricalPricesData union type
const formatHistoricalPricesForExport = (
  priceDataWithPotentialError: YFinanceHistoricalPricesData,
  symbol: string
): { headers: string[]; rows: (string | number | null)[][] } => {
  const defaultHeaders = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Dividends', 'Stock Splits'];

  if ('error' in priceDataWithPotentialError && typeof priceDataWithPotentialError.error === 'string') {
    return { headers: ['Error'], rows: [[priceDataWithPotentialError.error]] };
  }

  // Type guard: priceDataWithPotentialError is now YFinanceHistoricalDateMap
  const priceDataMap = priceDataWithPotentialError as YFinanceHistoricalDateMap;
  const rows: (string | number | null)[][] = [];
  const upperSymbol = symbol.toUpperCase();

  const sortedDates = Object.keys(priceDataMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (sortedDates.length === 0) {
    return { headers: defaultHeaders, rows: [['No historical dates found', ...Array(defaultHeaders.length - 1).fill('')]] };
  }

  for (const date of sortedDates) {
    const dayCellData = priceDataMap[date]; // Type: { [symbol: string]: HistoricalPriceEntry; } | { error?: string; }

    if (dayCellData && 'error' in dayCellData && typeof dayCellData.error === 'string') {
      // Optionally include a row indicating error for this date, or skip
      // rows.push([date, dayCellData.error, null, null, null, null, null, null]); 
      // Skipping for cleaner data output for now.
      continue; 
    } else if (dayCellData && !('error' in dayCellData)) {
      // Type guard: dayCellData is now { [symbol: string]: HistoricalPriceEntry; }
      const symbolMap = dayCellData as { [symbol: string]: HistoricalPriceEntry };
      const symbolData = symbolMap[upperSymbol];
      if (symbolData) {
        const entry = symbolData as HistoricalPriceEntry; 
        rows.push([
          date,
          entry.Open,
          entry.High,
          entry.Low,
          entry.Close,
          entry.Volume,
          entry.Dividends,
          entry["Stock Splits"],
        ]);
      }
    } else {
      // Data not available for this symbol on this date, or dayCellData is malformed for the symbol
      // Optionally include a row indicating N/A, or skip
      // rows.push([date, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']);
    }
  }

  if (rows.length === 0) { // This means no valid data rows were generated, even if dates existed.
    return { headers: defaultHeaders, rows: [['No valid price data available for export for the given symbol/dates', ...Array(defaultHeaders.length - 1).fill('')]] };
  }
  return { headers: defaultHeaders, rows };
};


// --- Main Export Functions ---

export const exportToCsv = (
  apiResponse: YFinanceCombinedApiResponse,
  fileName: string,
  dataType: YFinanceDataType,
  symbol: string // Symbol is needed to extract data correctly
): void => {
  let formattedData: { headers: string[], rows: (string|number|null)[][] };
  const tickerKey = symbol.toUpperCase();

  if (dataType === YFinanceDataType.HISTORICAL_PRICES) {
    const priceData = apiResponse as YFinanceHistoricalPricesData;
    // FIX: formatHistoricalPricesForExport now handles top-level error.
    // Alerting for error will be based on what formatHistoricalPricesForExport returns.
    formattedData = formatHistoricalPricesForExport(priceData, tickerKey);
    if (formattedData.headers.length === 1 && formattedData.headers[0] === 'Error' && formattedData.rows.length > 0 && formattedData.rows[0].length > 0) {
      alert(`Cannot export CSV: API Error - ${formattedData.rows[0][0]}`);
      return;
    }
  } else {
    const stockData = apiResponse as YFinanceApiResponse;
    const symbolData = stockData[tickerKey];
    if (!symbolData || ('error' in symbolData && symbolData.error)) {
      alert(`Cannot export CSV: No data or error for symbol ${tickerKey}: ${('error' in symbolData && symbolData.error) || 'Unknown reason'}`);
      return;
    }
    if (dataType === YFinanceDataType.COMPANY_PROFILE) {
      formattedData = formatCompanyProfileData(symbolData as YFinanceCompanyProfileData);
    } else {
      formattedData = formatFinancialStatementData(symbolData as YFinanceFinancialStatementData);
    }
  }

  let csvContent = formattedData.headers.map(h => `"${String(h ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
  formattedData.rows.forEach(rowArray => {
    csvContent += rowArray.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',') + '\n';
  });

  triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;');
};


export const exportToExcel = (
  apiResponse: YFinanceCombinedApiResponse,
  fileName: string,
  dataType: YFinanceDataType,
  symbol: string // Symbol is needed
): void => {
  if (typeof window.XLSX === 'undefined') {
    alert('Excel library (XLSX) not loaded. Cannot export to Excel.');
    console.error('XLSX library is not available on window object.');
    return;
  }

  let sheetDataRows: (string|number|null)[][];
  let headers: string[];
  const tickerKey = symbol.toUpperCase();

  if (dataType === YFinanceDataType.HISTORICAL_PRICES) {
    const priceData = apiResponse as YFinanceHistoricalPricesData;
    // FIX: formatHistoricalPricesForExport now handles top-level error.
    const formatted = formatHistoricalPricesForExport(priceData, tickerKey);
    if (formatted.headers.length === 1 && formatted.headers[0] === 'Error' && formatted.rows.length > 0 && formatted.rows[0].length > 0) {
        alert(`Cannot export Excel: API Error - ${formatted.rows[0][0]}`);
        return;
    }
    headers = formatted.headers;
    sheetDataRows = formatted.rows;
  } else {
    const stockData = apiResponse as YFinanceApiResponse;
    const symbolData = stockData[tickerKey];
    if (!symbolData || ('error' in symbolData && symbolData.error)) {
      alert(`Cannot export Excel: No data or error for symbol ${tickerKey}: ${('error' in symbolData && symbolData.error) || 'Unknown reason'}`);
      return;
    }
    let formatted;
    if (dataType === YFinanceDataType.COMPANY_PROFILE) {
      formatted = formatCompanyProfileData(symbolData as YFinanceCompanyProfileData);
    } else {
      formatted = formatFinancialStatementData(symbolData as YFinanceFinancialStatementData);
    }
    headers = formatted.headers;
    sheetDataRows = formatted.rows;
  }

  const sheetDataForLib = [headers, ...sheetDataRows];
  const worksheet = window.XLSX.utils.aoa_to_sheet(sheetDataForLib);
  const workbook = window.XLSX.utils.book_new();
  const sheetName = dataType.replace(/\s+/g, '_').substring(0,30);
  window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const colWidths = headers.map((_, i) => ({
    wch: sheetDataForLib.reduce((w, r) => Math.max(w, String(r[i] || '').length), 10)
  }));
  worksheet['!cols'] = colWidths;

  window.XLSX.writeFile(workbook, fileName, { bookType: 'xlsx', type: 'binary' });
};