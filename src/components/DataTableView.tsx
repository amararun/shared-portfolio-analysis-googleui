import React from 'react';
import { 
  YFinanceCombinedApiResponse, 
  YFinanceDataType, 
  YFinanceCompanyProfileData, 
  YFinanceFinancialStatementData, 
  YFinanceFinancialStatementItem,
  YFinanceHistoricalPricesData, // Union type: YFinanceHistoricalDateMap | { error: string }
  HistoricalPriceEntry,
  YFinanceApiResponse // Keep for casting clarity
} from '../types';

interface DataTableViewProps {
  data: YFinanceCombinedApiResponse | null;
  dataType: YFinanceDataType;
  symbol: string; // Symbol is needed to extract correct data, especially for historical prices
}

// FIX: Changed component definition to React.FC to ensure correct component typing
// and resolve JSX element type mismatches.
export const DataTableView: React.FC<DataTableViewProps> = ({ data, dataType, symbol }) => {
  if (!data) {
    return <p className="text-gray-500 italic">No data to display.</p>;
  }

  // FIX: Explicitly type the return as React.ReactElement for clarity and consistency.
  const renderTableContainer = (content: React.ReactNode): React.ReactElement => (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow max-h-[calc(100vh-530px)] sm:max-h-[calc(100vh-510px)] xl:max-h-[340px] overflow-y-auto"> {/* Added max-height and y-scroll */}
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        {content}
      </table>
    </div>
  );

  if (dataType === YFinanceDataType.HISTORICAL_PRICES) {
    // data is YFinanceHistoricalPricesData, which is YFinanceHistoricalDateMap | { error: string }
    const historicalData = data as YFinanceHistoricalPricesData; 
    const upperSymbol = symbol.toUpperCase();

    // FIX: Handle top-level error for YFinanceHistoricalPricesData (union type)
    if ('error' in historicalData && typeof historicalData.error === 'string') {
      return null; // Let parent component handle the error display
    }

    // At this point, historicalData is YFinanceHistoricalDateMap
    const priceDataMap = historicalData as { [date: string]: { [symbol: string]: HistoricalPriceEntry } | { error?: string } };

    // FIX: Object.keys directly on priceDataMap, no need to filter 'error' key as it's not part of YFinanceHistoricalDateMap
    const dates = Object.keys(priceDataMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (dates.length === 0) {
      return null; // Let parent component handle empty data case
    }
    
    const hasSymbolDataOnAnyDate = dates.some(date => {
        const dayCellData = priceDataMap[date];
        // Check if dayCellData is the data variant (not error) and contains the symbol
      if (!dayCellData || 'error' in dayCellData) return false;
      return upperSymbol in (dayCellData as { [symbol: string]: HistoricalPriceEntry });
    });

    if (!hasSymbolDataOnAnyDate) {
      return null; // Let parent component handle no data case
    }

    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Dividends', 'Stock Splits'];
    
    return renderTableContainer(
      <>
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {dates.map((date) => {
            const dayCellData = priceDataMap[date];
            let contentToRender;

            if (!dayCellData || 'error' in dayCellData) {
              contentToRender = (
                <td colSpan={headers.length - 1} className="px-4 py-2.5 text-center text-gray-400 italic">
                  Data not available
                </td>
              );
            } else {
              const symbolData = dayCellData as { [symbol: string]: HistoricalPriceEntry };
              const dayData = symbolData[upperSymbol];
              if (!dayData) {
              contentToRender = (
                <td colSpan={headers.length - 1} className="px-4 py-2.5 text-center text-gray-400 italic">
                    Data not available
                </td>
              );
              } else {
                contentToRender = (
                  <>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.Open.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.High.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.Low.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.Close.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.Volume.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData.Dividends.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{dayData["Stock Splits"].toLocaleString()}</td>
                  </>
                );
              }
            }

            return (
              <tr key={date} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-800">{date}</td>
                {contentToRender}
              </tr>
            );
          })}
        </tbody>
      </>
    );

  } else { // Handles COMPANY_PROFILE, INCOME_STATEMENT, etc.
    const stockData = data as YFinanceApiResponse; // Cast to general financials type
    const tickerKey = symbol.toUpperCase();
    const symbolData = stockData[tickerKey];

    if (!symbolData) {
      return null; // Let parent component handle the error display
    }
    if ('error' in symbolData && symbolData.error) {
      return null; // Let parent component handle the error display
    }

    // At this point, symbolData is either YFinanceCompanyProfileData or YFinanceFinancialStatementData
    let headers: string[] = [];
    let rows: (string | number | null)[][] = [];

    if (dataType === YFinanceDataType.COMPANY_PROFILE) {
      const profileData = symbolData as YFinanceCompanyProfileData;
      const mainInfo = profileData.main_info;
      if (!mainInfo || Object.keys(mainInfo).length === 0) {
        return (
         <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
            <span className="font-normal">No company profile information available.</span>
          </div>
        );
      }
      headers = ['Property', 'Value'];
      rows = Object.entries(mainInfo).map(([key, value]) => [key, value]);
    } else { // Financial statements
      const statementData = symbolData as YFinanceFinancialStatementData;
      const dates = statementData.dates;
      const items = statementData.data;
      if (!dates || !items || dates.length === 0 || items.length === 0) {
         return (
            <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
              <span className="font-normal">No financial statement data available.</span>
            </div>
          );
      }
      headers = ['Metric', ...dates];
      rows = items.map((item: YFinanceFinancialStatementItem, index: number) => [item.metric, ...dates.map((date) => typeof item[date] === 'number' ? (item[date] as number).toLocaleString() : item[date])]);
    }

      return renderTableContainer(
        <>
          <thead className="bg-gray-50">
            <tr>
            {headers.map((header, index) => (
              <th key={header} scope="col" className={`px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider ${index === 0 ? 'text-left sticky left-0 bg-gray-50 z-10' : 'text-right'}`}>
                {header}
              </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cell} className={`px-4 py-2.5 whitespace-nowrap ${cellIndex === 0 ? 'font-medium text-gray-800 sticky left-0 bg-white hover:bg-gray-50 z-0' : 'text-right'}`}>
                  {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      );
  }

  const isDataAvailable = dataType !== YFinanceDataType.HISTORICAL_PRICES && dataType !== YFinanceDataType.COMPANY_PROFILE;
  const error = data && 'error' in data && data.error ? data.error : null;

  return (
    <>
      {renderTableContainer(
        <>
          {isDataAvailable && !error && (
            <>
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={header} scope="col" className={`px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider ${index === 0 ? 'text-left sticky left-0 bg-gray-50 z-10' : 'text-right'}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={cell} className={`px-4 py-2.5 whitespace-nowrap ${cellIndex === 0 ? 'font-medium text-gray-800 sticky left-0 bg-white hover:bg-gray-50 z-0' : 'text-right'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </>
      )}
      
      {!isDataAvailable && !error && (
        <div className="p-6 text-center text-indigo-600 border border-indigo-200 rounded-xl bg-indigo-50 min-h-[140px] flex items-center justify-center">
          <span className="font-normal">No data to display.</span>
        </div>
      )}
      
      {error && (
        <div className="p-6 text-center border border-red-200 rounded-xl bg-red-50 min-h-[140px] flex flex-col items-center justify-center">
          <p className="font-semibold text-red-700 mb-2">Error</p>
          <p className="text-red-600 text-sm leading-relaxed">{error}</p>
        </div>
      )}
    </>
  );
};
