import React, { useState, useEffect } from 'react';
import { cabinetService, Formula as FormulaType } from '../services/cabinetService';

// Add Formula type
type Formula = {
  id?: number;
  name: string;
  formulaH: string;
  formulaW: string;
  partTypes: string[];
};

interface CabinetDropdownSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partTypes: string[];
  setPartTypes: (values: string[]) => void;
  materialTypes: string[];
  setMaterialTypes: (values: string[]) => void;
  materialThicknesses: string[];
  setMaterialThicknesses: (values: string[]) => void;
  edgeThicknesses: string[];
  setEdgeThicknesses: (values: string[]) => void;
  accessories: string[];
  setAccessories: (values: string[]) => void;
  edgeTypes: string[];
  setEdgeTypes: (values: string[]) => void;
  formulas: Formula[];
  setFormulas: (values: Formula[]) => void;
}

const sections = [
  { key: 'partTypes', label: 'Cabinet Part Types' },
  { key: 'materialTypes', label: 'Material Types' },
  { key: 'materialThicknesses', label: 'Material Thicknesses' },
  { key: 'edgeThicknesses', label: 'Edge Thicknesses' },
  { key: 'edgeTypes', label: 'Edge Types' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'formulas', label: 'Formulas' },
];

const CabinetDropdownSettingsModal: React.FC<CabinetDropdownSettingsModalProps> = ({
  isOpen,
  onClose,
  partTypes,
  setPartTypes,
  materialTypes,
  setMaterialTypes,
  materialThicknesses,
  setMaterialThicknesses,
  edgeThicknesses,
  setEdgeThicknesses,
  accessories,
  setAccessories,
  edgeTypes,
  setEdgeTypes,
  formulas,
  setFormulas,
}) => {
  const [activeSection, setActiveSection] = useState('partTypes');
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formulaEditIndex, setFormulaEditIndex] = useState<number | null>(null);
  const [formulaName, setFormulaName] = useState('');
  const [formulaH, setFormulaH] = useState('');
  const [formulaW, setFormulaW] = useState('');
  const [formulaPartTypes, setFormulaPartTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dropdowns and formulas on open
  useEffect(() => {
    if (!isOpen) return;
    loadAllData();
  }, [isOpen]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage to ensure we're authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Load all data in parallel
      const results = await Promise.allSettled([
        cabinetService.getDropdown('part-types'),
        cabinetService.getDropdown('material-types'),
        cabinetService.getDropdown('material-thicknesses'),
        cabinetService.getDropdown('edge-thicknesses'),
        cabinetService.getDropdown('edge-types'),
        cabinetService.getDropdown('accessories'),
        cabinetService.getFormulas(),
      ]);
      
      // Process results and handle any errors
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          switch (index) {
            case 0: setPartTypes(result.value); break;
            case 1: setMaterialTypes(result.value); break;
            case 2: setMaterialThicknesses(result.value); break;
            case 3: setEdgeThicknesses(result.value); break;
            case 4: setEdgeTypes(result.value); break;
            case 5: setAccessories(result.value); break;
            case 6: setFormulas(result.value); break;
          }
        } else {
          console.error(`Failed to load data for index ${index}:`, result.reason);
          const sectionName = index < 6 ? sections[index].label : 'Formulas';
          setError(`Failed to load ${sectionName}: ${result.reason.message || 'Unknown error'}`);
        }
      });
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getValues = () => {
    switch (activeSection) {
      case 'partTypes': return partTypes;
      case 'materialTypes': return materialTypes;
      case 'materialThicknesses': return materialThicknesses;
      case 'edgeThicknesses': return edgeThicknesses;
      case 'edgeTypes': return edgeTypes;
      case 'accessories': return accessories;
      case 'formulas': return formulas.map(f => f.name);
      default: return [];
    }
  };
  
  const setValues = (values: string[]) => {
    switch (activeSection) {
      case 'partTypes': setPartTypes(values); break;
      case 'materialTypes': setMaterialTypes(values); break;
      case 'materialThicknesses': setMaterialThicknesses(values); break;
      case 'edgeThicknesses': setEdgeThicknesses(values); break;
      case 'edgeTypes': setEdgeTypes(values); break;
      case 'accessories': setAccessories(values); break;
      case 'formulas': setFormulas(formulas.map(f => ({ ...f, partTypes: values.filter(v => f.partTypes.includes(v)) }))); break;
      default: break;
    }
  };

  // CRUD handlers for dropdowns
  const handleAdd = async () => {
    if (inputValue.trim() && !getValues().includes(inputValue.trim())) {
      setLoading(true);
      setError(null);
      try {
        const type = activeSection === 'partTypes' ? 'part-types' : 
                    activeSection === 'materialTypes' ? 'material-types' :
                    activeSection === 'materialThicknesses' ? 'material-thicknesses' :
                    activeSection === 'edgeThicknesses' ? 'edge-thicknesses' :
                    activeSection === 'edgeTypes' ? 'edge-types' : 'accessories';
                    
        await cabinetService.addDropdown(type as any, inputValue.trim());
        const updated = await cabinetService.getDropdown(type as any);
        setValues(updated);
        setInputValue('');
      } catch (e: any) {
        setError(e.message || 'Failed to add');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setInputValue(getValues()[idx]);
  };
  
  const handleSaveEdit = async () => {
    if (editIndex !== null && inputValue.trim()) {
      setLoading(true);
      setError(null);
      try {
        const type = activeSection === 'partTypes' ? 'part-types' : 
                    activeSection === 'materialTypes' ? 'material-types' :
                    activeSection === 'materialThicknesses' ? 'material-thicknesses' :
                    activeSection === 'edgeThicknesses' ? 'edge-thicknesses' :
                    activeSection === 'edgeTypes' ? 'edge-types' : 'accessories';
                    
        // Assume backend returns array of objects with id and value, so we need to map
        const id = editIndex; // You may need to adjust this if your backend returns ids
        await cabinetService.updateDropdown(type as any, id, inputValue.trim());
        const updated = await cabinetService.getDropdown(type as any);
        setValues(updated);
        setEditIndex(null);
        setInputValue('');
      } catch (e: any) {
        setError(e.message || 'Failed to edit');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleDelete = async (idx: number) => {
    setLoading(true);
    setError(null);
    try {
      const type = activeSection === 'partTypes' ? 'part-types' : 
                  activeSection === 'materialTypes' ? 'material-types' :
                  activeSection === 'materialThicknesses' ? 'material-thicknesses' :
                  activeSection === 'edgeThicknesses' ? 'edge-thicknesses' :
                  activeSection === 'edgeTypes' ? 'edge-types' : 'accessories';
                  
      const id = idx; // You may need to adjust this if your backend returns ids
      await cabinetService.deleteDropdown(type as any, id);
      const updated = await cabinetService.getDropdown(type as any);
      setValues(updated);
      if (editIndex === idx) {
        setEditIndex(null);
        setInputValue('');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  // CRUD handlers for formulas
  const handleAddFormula = async () => {
    if (formulaName.trim() && formulaH.trim() && formulaW.trim() && formulaPartTypes.length > 0) {
      setLoading(true);
      setError(null);
      try {
        await cabinetService.addFormula({ 
          name: formulaName.trim(), 
          formulaH: formulaH.trim(), 
          formulaW: formulaW.trim(), 
          partTypes: formulaPartTypes 
        });
        const updated = await cabinetService.getFormulas();
        setFormulas(updated);
        setFormulaName(''); 
        setFormulaH(''); 
        setFormulaW(''); 
        setFormulaPartTypes([]); 
        setFormulaEditIndex(null);
      } catch (e: any) {
        setError(e.message || 'Failed to add formula');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleEditFormula = (idx: number) => {
    setFormulaEditIndex(idx);
    const f = formulas[idx];
    setFormulaName(f.name);
    setFormulaH(f.formulaH);
    setFormulaW(f.formulaW);
    setFormulaPartTypes(f.partTypes);
  };
  
  const handleSaveEditFormula = async () => {
    if (formulaEditIndex !== null && formulaName.trim() && formulaH.trim() && formulaW.trim() && formulaPartTypes.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const id = formulas[formulaEditIndex]?.id;
        await cabinetService.updateFormula(id, { 
          name: formulaName.trim(), 
          formulaH: formulaH.trim(), 
          formulaW: formulaW.trim(), 
          partTypes: formulaPartTypes 
        });
        const updated = await cabinetService.getFormulas();
        setFormulas(updated);
        setFormulaEditIndex(null);
        setFormulaName(''); 
        setFormulaH(''); 
        setFormulaW(''); 
        setFormulaPartTypes([]);
      } catch (e: any) {
        setError(e.message || 'Failed to edit formula');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleDeleteFormula = async (idx: number) => {
    setLoading(true);
    setError(null);
    try {
      const id = formulas[idx]?.id;
      await cabinetService.deleteFormula(id);
      const updated = await cabinetService.getFormulas();
      setFormulas(updated);
      setFormulaEditIndex(null);
      setFormulaName(''); 
      setFormulaH(''); 
      setFormulaW(''); 
      setFormulaPartTypes([]);
    } catch (e: any) {
      setError(e.message || 'Failed to delete formula');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Cabinet Dropdown Settings</h2>
        
        {/* Section tabs - scrollable container */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => { 
                  setActiveSection(section.key); 
                  setEditIndex(null); 
                  setInputValue(''); 
                  setFormulaEditIndex(null); 
                  setFormulaName(''); 
                  setFormulaH(''); 
                  setFormulaW(''); 
                  setFormulaPartTypes([]); 
                }}
                className={`px-3 py-1 rounded ${activeSection === section.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4 max-h-[50vh] overflow-y-auto">
          {activeSection !== 'formulas' ? (
            <ul className="space-y-2">
              {getValues().map((val, idx) => (
                <li key={val} className="flex items-center justify-between">
                  {editIndex === idx ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 mr-2 flex-1"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button onClick={handleSaveEdit} className="text-blue-600 px-2">Save</button>
                        <button onClick={() => { setEditIndex(null); setInputValue(''); }} className="text-gray-500 px-2">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{val}</span>
                      <div>
                        <button onClick={() => handleEdit(idx)} className="text-blue-600 px-2">Edit</button>
                        <button onClick={() => handleDelete(idx)} className="text-red-600 px-2">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul className="space-y-2 mb-4">
                {formulas.map((f, idx) => (
                  <li key={f.name + idx} className="border rounded p-2 flex flex-col">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{f.name}</span> &nbsp;
                        <span className="text-xs text-gray-500">[H: {f.formulaH}, W: {f.formulaW}]</span>
                        <div className="text-xs text-gray-400">Linked: {f.partTypes.join(', ')}</div>
                      </div>
                      <div>
                        <button onClick={() => handleEditFormula(idx)} className="text-blue-600 px-2">Edit</button>
                        <button onClick={() => handleDeleteFormula(idx)} className="text-red-600 px-2">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mb-2">
                <input
                  className="border rounded px-2 py-1 mr-2 w-full mb-2"
                  value={formulaName}
                  onChange={e => setFormulaName(e.target.value)}
                  placeholder="Formula Name"
                />
                <div className="flex gap-2 mb-2">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    value={formulaH}
                    onChange={e => setFormulaH(e.target.value)}
                    placeholder="Formula for H"
                  />
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    value={formulaW}
                    onChange={e => setFormulaW(e.target.value)}
                    placeholder="Formula for W"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Linked Part Types:</label>
                <select
                  multiple
                  className="border rounded px-2 py-1 w-full"
                  value={formulaPartTypes}
                  onChange={e => setFormulaPartTypes(Array.from(e.target.selectedOptions, o => o.value))}
                  size={3}
                >
                  {partTypes.map(pt => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                {formulaEditIndex === null ? (
                  <button 
                    onClick={handleAddFormula} 
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    disabled={!formulaName || !formulaH || !formulaW || formulaPartTypes.length === 0}
                  >
                    Add Formula
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleSaveEditFormula} 
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      disabled={!formulaName || !formulaH || !formulaW || formulaPartTypes.length === 0}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => { 
                        setFormulaEditIndex(null); 
                        setFormulaName(''); 
                        setFormulaH(''); 
                        setFormulaW(''); 
                        setFormulaPartTypes([]); 
                      }} 
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        
        {activeSection !== 'formulas' && (
          <div className="flex items-center space-x-2 mb-6">
            <input
              className="border rounded px-2 py-1 flex-1"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={`Add new ${sections.find(s => s.key === activeSection)?.label.toLowerCase()}`}
              onKeyDown={e => e.key === 'Enter' && (editIndex === null ? handleAdd() : handleSaveEdit())}
            />
            {editIndex === null ? (
              <button 
                onClick={handleAdd} 
                className="bg-blue-600 text-white px-3 py-1 rounded"
                disabled={!inputValue.trim()}
              >
                Add
              </button>
            ) : null}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
        
        {loading && <div className="text-blue-600 mt-2">Loading...</div>}
      </div>
    </div>
  );
};

export default CabinetDropdownSettingsModal;
