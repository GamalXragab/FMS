const API = '/api/cabinet';

export type Formula = {
  id?: number;
  name: string;
  formulaH: string;
  formulaW: string;
  partTypes: string[];
};

async function fetchJson(url: string, options?: RequestInit) {
  // Get the auth token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }
  
  // Create headers with auth token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  try {
    const res = await fetch(url, { 
      headers, 
      credentials: 'include', 
      ...options,
      // Merge headers if options already has headers
      headers: {
        ...headers,
        ...(options?.headers || {})
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'Request failed');
      } catch (e) {
        throw new Error(errorText || `HTTP error ${res.status}`);
      }
    }
    
    return res.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Generic CRUD for dropdowns
type DropdownType = 'part-types' | 'material-types' | 'material-thicknesses' | 'edge-thicknesses' | 'edge-types' | 'accessories';

// Helper function to determine the correct payload structure for each dropdown type
function getDropdownPayload(type: DropdownType, value: string) {
  // These types use 'value' property
  if (type === 'material-thicknesses' || type === 'edge-thicknesses' || type === 'edge-types') {
    return { value };
  }
  // These types use 'name' property
  return { name: value };
}

export const cabinetService = {
  // Get all items of a dropdown type
  getDropdown: async (type: DropdownType): Promise<string[]> => {
    try {
      const data = await fetchJson(`${API}/${type}`);
      // Map the response to get just the names/values
      return Array.isArray(data) ? data.map(item => item.name || item.value) : [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  },
  
  // Add a new item to a dropdown
  addDropdown: async (type: DropdownType, value: string) => {
    const payload = getDropdownPayload(type, value);
    return fetchJson(`${API}/${type}`, { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  },
  
  // Update an existing dropdown item
  updateDropdown: async (type: DropdownType, id: number, value: string) => {
    const payload = getDropdownPayload(type, value);
    return fetchJson(`${API}/${type}/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(payload) 
    });
  },
  
  // Delete a dropdown item
  deleteDropdown: async (type: DropdownType, id: number) => {
    return fetchJson(`${API}/${type}/${id}`, { method: 'DELETE' });
  },

  // Formulas
  getFormulas: async (): Promise<Formula[]> => {
    try {
      const data = await fetchJson(`${API}/formulas`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching formulas:', error);
      return [];
    }
  },
  
  addFormula: (formula: Formula) => 
    fetchJson(`${API}/formulas`, { 
      method: 'POST', 
      body: JSON.stringify(formula) 
    }),
    
  updateFormula: (id: number | undefined, formula: Formula) => {
    if (!id) throw new Error('Formula ID is required for updates');
    return fetchJson(`${API}/formulas/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(formula) 
    });
  },
  
  deleteFormula: (id: number | undefined) => {
    if (!id) throw new Error('Formula ID is required for deletion');
    return fetchJson(`${API}/formulas/${id}`, { method: 'DELETE' });
  },
};