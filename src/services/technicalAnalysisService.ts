import { TechnicalAnalysisServiceParams, TechnicalAnalysisResponse, ApiErrorResponse } from '../types';

const API_BASE_URL = 'https://ta.hosting.tigzig.com';
const API_PATH = '/api/technical-analysis';

export const fetchTechnicalAnalysisReport = async (params: TechnicalAnalysisServiceParams): Promise<TechnicalAnalysisResponse> => {
  const requestUrl = `${API_BASE_URL}${API_PATH}`;
  
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} - ${response.statusText || '(No status text)'}.`;
    try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData.detail && errorData.detail.length > 0) {
            errorMessage = errorData.detail.map(d => `${d.loc.join(' -> ')}: ${d.msg}`).join('\n');
        } else {
            errorMessage += ' The server returned an error, but it was not in the expected detailed JSON format.';
        }
    } catch (e) {
        errorMessage += ' Additionally, the error response body was not in the expected JSON format. Check network tab.';
    }
    throw new Error(errorMessage);
  }
  
  try {
    return await response.json() as TechnicalAnalysisResponse;
  } catch (e) {
    throw new Error('Failed to parse successful API response. Expected JSON.');
  }
};