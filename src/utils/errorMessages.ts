// Error messages used across the application
export const ERROR_MESSAGES = {
  YAHOO_FINANCE_SYMBOL_ERROR: 'Please double-check the Yahoo Finance symbol. Note that it might be different from your local stock exchange symbol (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com. ',
  
  YAHOO_FINANCE_SYMBOLS_ERROR: 'Please double-check the Yahoo Finance symbols. Note that they might be different from your local stock exchange symbols (e.g., TCS (NSE) would be TCS.NS or TCS.BO in Yahoo Finance). If the error persists, please email amar@harolikar.com .',
  
  REQUIRED_FIELDS: 'Symbol, Start Date, and End Date are required.',
  
  SYMBOLS_REQUIRED_FIELDS: 'Symbols, Start Date, and End Date are required.',
} as const; 