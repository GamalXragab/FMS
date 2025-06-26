const API = '/api/cabinet';

export type Formula = {
  id?: number;
  name: string;
  formulaH: string;
  formulaW: string;
  partTypes: string[];
};

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Generic CRUD for dropdowns
type DropdownType = 'part-types' | 'material-types' | 'material-thicknesses' | 'edge-thicknesses' | 'edge-types' | 'accessories';

export const cabinetService = {
  getDropdown: (type: DropdownType) => fetchJson(`${API}/${type}`),
  addDropdown: (type: DropdownType, value: string) => fetchJson(`${API}/${type}`, { method: 'POST', body: JSON.stringify({ value }) }),
  updateDropdown: (type: DropdownType, id: number, value: string) => fetchJson(`${API}/${type}/${id}`, { method: 'PUT', body: JSON.stringify({ value }) }),
  deleteDropdown: (type: DropdownType, id: number) => fetchJson(`${API}/${type}/${id}`, { method: 'DELETE' }),

  // Formulas
  getFormulas: () => fetchJson(`${API}/formulas`),
  addFormula: (formula: Formula) => fetchJson(`${API}/formulas`, { method: 'POST', body: JSON.stringify(formula) }),
  updateFormula: (id: number, formula: Formula) => fetchJson(`${API}/formulas/${id}`, { method: 'PUT', body: JSON.stringify(formula) }),
  deleteFormula: (id: number) => fetchJson(`${API}/formulas/${id}`, { method: 'DELETE' }),
}; 
