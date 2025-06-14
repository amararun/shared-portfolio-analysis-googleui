
import { AnalysisServiceParams, AnalysisResponse, ApiErrorResponse } from '../types';

const API_BASE_URL = 'https://quantstats.hosting.tigzig.com'; // Correct API host
const API_PATH = '/analyze'; // API path

export const fetchAnalysisReport = async (params: AnalysisServiceParams): Promise<AnalysisResponse> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('symbols', params.symbols);
  queryParams.append('start_date', params.start_date);
  queryParams.append('end_date', params.end_date);

  if (params.benchmark !== undefined && params.benchmark.trim() !== '') {
    queryParams.append('benchmark', params.benchmark);
  }
  
  if (params.risk_free_rate !== undefined) {
    queryParams.append('risk_free_rate', params.risk_free_rate.toString());
  }

  let requestUrlObj: URL;
  try {
    // Construct the full URL using the API_BASE_URL and API_PATH
    requestUrlObj = new URL(API_PATH, API_BASE_URL);
    requestUrlObj.search = queryParams.toString();
  } catch (e) {
    console.error("Failed to construct API URL:", e);
    throw new Error(`Failed to construct API URL: ${e instanceof Error ? e.message : String(e)}`);
  }
  
  const requestUrl = requestUrlObj.toString();
  
  const response = await fetch(requestUrl);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} - ${response.statusText || '(No status text)'}.`;
    try {
        // Try to parse the error body as JSON, as per the API's expected error format
        const errorData: ApiErrorResponse = await response.json();
        if (errorData.detail && errorData.detail.length > 0) {
            errorMessage = errorData.detail.map(d => `${d.loc.join(' -> ')}: ${d.msg}`).join('\n');
        } else {
            // JSON parsed, but no 'detail' array or it's empty, or format doesn't match.
            errorMessage += ' The server returned an error, but it was not in the expected detailed JSON format.';
        }
    } catch (e) {
        // Failed to parse as JSON. This happens if the error response (e.g., a 404 page) is HTML or plain text.
        errorMessage += ' Additionally, the error response body was not in the expected JSON format (e.g., it might be HTML or plain text). Check your browser\'s network inspection tab for the raw server response.';
    }
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json() as AnalysisResponse;
  } catch (e) {
    throw new Error('Failed to parse successful API response. Expected JSON.');
  }
};
