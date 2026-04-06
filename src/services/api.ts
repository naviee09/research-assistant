const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests with timeout
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Reduced timeout from 15s to 10s
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    console.error('API request failed:', error);
    throw error;
  }
};

// Research API
export const researchApi = {
  // Submit a research question
  submitQuestion: async (question: string, userId: string) => {
    return apiRequest('/research', {
      method: 'POST',
      body: JSON.stringify({ question, userId }),
    });
  },

  // Get a specific research report
  getReport: async (id: string) => {
    return apiRequest(`/research/${id}`);
  },

  // Get all research reports for a user
  getReports: async (userId: string) => {
    return apiRequest(`/research?userId=${userId}`);
  },

  // Refresh a research report with new data
  refreshReport: async (id: string, userId: string) => {
    return apiRequest(`/research/${id}/refresh`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (userId: string) => {
    return apiRequest(`/dashboard/stats?userId=${userId}`);
  },

  // Get report history
  getReportHistory: async (userId: string, page: number = 1, limit: number = 3) => {
    return apiRequest(`/dashboard/reports?userId=${userId}&page=${page}&limit=${limit}`);
  },

  // Get user profile
  getProfile: async (userId: string) => {
    return apiRequest(`/dashboard/profile?userId=${userId}`);
  },
};

// Billing API
export const billingApi = {
  // Get user credits
  getCredits: async (userId: string) => {
    return apiRequest(`/billing/credits?userId=${userId}`);
  },

  // Get usage statistics
  getUsageStats: async (userId: string) => {
    return apiRequest(`/billing/usage?userId=${userId}`);
  },

  // Deduct credits
  deductCredits: async (userId: string, amount: number, eventType: string) => {
    return apiRequest(`/billing/deduct`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount, eventType }),
    });
  },

  // Add credits
  addCredits: async (userId: string, amount: number) => {
    return apiRequest(`/billing/add`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  },
};

// Data API
export const dataApi = {
  // Trigger data source updates
  updateDataSources: async () => {
    return apiRequest(`/data/update`, {
      method: 'POST',
    });
  },

  // Check data freshness
  checkDataFreshness: async () => {
    return apiRequest(`/data/freshness`);
  },

  // Initialize Pathway pipeline
  initializePipeline: async () => {
    return apiRequest(`/data/initialize`, {
      method: 'POST',
    });
  },
};

export default {
  researchApi,
  dashboardApi,
  billingApi,
  dataApi,
};