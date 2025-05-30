import { FFNServiceParams, FFNResponse } from '../types';

const API_BASE_URL = 'https://ffn.hosting.tigzig.com';

export const fetchFFNReport = async (params: FFNServiceParams): Promise<FFNResponse> => {
  const requestPayload = {
    symbols: params.symbols,
    start_date: params.start_date,
    end_date: params.end_date,
    risk_free_rate: params.risk_free_rate || 0.0,
  };

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}; 