import React, { useState, useEffect } from 'react';

interface CabinetPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (part: any) => void;
  initialValues?: any;
  partTypes: string[];
  materialTypes: string[];
  materialThicknesses: string[];
  edgeThicknesses: string[];
  accessories: string[];
}

const defaultEdgeBanding = { front: false, back: false, top: false, bottom: false };

const CabinetPartModal: React.FC<CabinetPartModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  partTypes,
  materialTypes,
  materialThicknesses,
  edgeThicknesses,
  accessories
}) => {
  const [partType, setPartType] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [materialThickness, setMaterialThickness] = useState('');
  const [edgeThickness, setEdgeThickness] = useState('');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [edgeBanding, setEdgeBanding] = useState(defaultEdgeBanding);
  const [widthFormula, setWidthFormula] = useState('');
  const [heightFormula, setHeightFormula] = useState('');

  useEffect(() => {
    if (initialValues) {
      setPartType(initialValues.partType || '');
      setMaterialType(initialValues.materialType || '');
      setMaterialThickness(initialValues.materialThickness || '');
      setEdgeThickness(initialValues.edgeThickness || '');
      setSelectedAccessories(initialValues.accessories || []);
      setEdgeBanding(initialValues.edgeBanding || defaultEdgeBanding);
      setWidthFormula(initialValues.widthFormula || '');
      setHeightFormula(initialValues.heightFormula || '');
    } else {
      setPartType('');
      setMaterialType('');
      setMaterialThickness('');
      setEdgeThickness('');
      setSelectedAccessories([]);
      setEdgeBanding(defaultEdgeBanding);
      setWidthFormula('');
      setHeightFormula('');
    }
  }, [initialValues, isOpen]);

  // Simulate auto-loading formulas based on part type
  useEffect(() => {
    if (!initialValues && partType) {
      // Example: load default formulas for demo
      if (partType === 'Side Panel') {
        setWidthFormula('CabinetDepth');
        setHeightFormula('CabinetHeight');
      } else if (partType === 'Bottom') {
        setWidthFormula('CabinetWidth - 2*T');
        setHeightFormula('T');
      } else {
        setWidthFormula('');
        setHeightFormula('');
      }
    }
  }, [partType, initialValues]);

  const handleCheckbox = (edge: keyof typeof defaultEdgeBanding) => {
    setEdgeBanding((prev) => ({ ...prev, [edge]: !prev[edge] }));
  };

  const handleAccessoryChange = (acc: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const handleSave = () => {
    onSave({
      partType,
      materialType,
      materialThickness,
      edgeThickness,
      accessories: selectedAccessories,
      edgeBanding,
      widthFormula,
      heightFormula
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{initialValues ? 'Edit' : 'Add'} Cabinet Part</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cabinet Part Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={partType}
              onChange={e => setPartType(e.target.value)}
            >
              <option value="">Select...</option>
              {partTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={materialType}
              onChange={e => setMaterialType(e.target.value)}
            >
              <option value="">Select...</option>
              {materialTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Thickness</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={materialThickness}
              onChange={e => setMaterialThickness(e.target.value)}
            >
              <option value="">Select...</option>
              {materialThicknesses.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edge Thickness</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={edgeThickness}
              onChange={e => setEdgeThickness(e.target.value)}
            >
              <option value="">Select...</option>
              {edgeThicknesses.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
            <div className="flex flex-wrap gap-2">
              {accessories.map((acc) => (
                <label key={acc} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedAccessories.includes(acc)}
                    onChange={() => handleAccessoryChange(acc)}
                  />
                  <span>{acc}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Edge Banding</label>
            <div className="flex gap-4">
              {(['front', 'back', 'top', 'bottom'] as const).map((edge) => (
                <label key={edge} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={edgeBanding[edge]}
                    onChange={() => handleCheckbox(edge)}
                  />
                  <span className="capitalize">{edge}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width Formula</label>
            <input
              className="w-full border rounded px-3 py-2 font-mono"
              value={widthFormula}
              onChange={e => setWidthFormula(e.target.value)}
              placeholder="e.g., CabinetWidth - 2*T"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height Formula</label>
            <input
              className="w-full border rounded px-3 py-2 font-mono"
              value={heightFormula}
              onChange={e => setHeightFormula(e.target.value)}
              placeholder="e.g., CabinetHeight"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CabinetPartModal; 