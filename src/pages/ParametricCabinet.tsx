import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import CabinetPartModal from './CabinetPartModal';
import CabinetDropdownSettingsModal from './CabinetDropdownSettingsModal';

interface CabinetPart {
  id: number;
  partType: string;
  materialType: string;
  materialThickness: string;
  edgeThickness: string;
  accessories: string[];
  edgeBanding: {
    front: boolean;
    back: boolean;
    top: boolean;
    bottom: boolean;
  };
  widthFormula: string;
  heightFormula: string;
}

interface Formula {
  id: number;
  name: string;
  formula: string;
  description?: string;
}

const ParametricCabinet: React.FC = () => {
  const [cabinetParts, setCabinetParts] = useState<CabinetPart[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dropdown state (admin-configurable)
  const [partTypes, setPartTypes] = useState<string[]>(['Side Panel', 'Bottom', 'Back', 'Door', 'Shelf']);
  const [materialTypes, setMaterialTypes] = useState<string[]>(['Plywood', 'MDF', 'Particle Board', 'Solid Wood']);
  const [materialThicknesses, setMaterialThicknesses] = useState<string[]>(['12mm', '16mm', '18mm', '25mm']);
  const [edgeThicknesses, setEdgeThicknesses] = useState<string[]>(['0.5mm', '1mm', '2mm']);
  const [accessories, setAccessories] = useState<string[]>(['Hinges', 'Drawer Slides', 'Handles', 'Shelf Pins']);
  const [edgeTypes, setEdgeTypes] = useState<string[]>(['PVC', 'ABS', 'Wood Veneer', 'Melamine']);
  const [formulas, setFormulas] = useState<Formula[]>([]);

  const handleAddPart = () => {
    setShowAddModal(true);
  };

  const handleSavePart = (partData: Omit<CabinetPart, 'id'>) => {
    const newPart: CabinetPart = {
      ...partData,
      id: Date.now() // Simple ID generation for demo
    };
    setCabinetParts(prev => [...prev, newPart]);
  };

  const handleEditPart = (id: number) => {
    // TODO: Implement edit functionality
    console.log('Edit part:', id);
  };

  const handleDeletePart = (id: number) => {
    setCabinetParts(prev => prev.filter(part => part.id !== id));
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parametric Cabinet</h1>
          <p className="text-gray-600 mt-1">Configure cabinet parts with dynamic formulas</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleOpenSettings}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button
            onClick={handleAddPart}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Cabinet Part
          </button>
        </div>
      </div>

      {/* Cabinet Parts Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cabinet Part Configurations</h2>
        </div>
        
        {cabinetParts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cabinet parts configured</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first cabinet part configuration.
            </p>
            <button
              onClick={handleAddPart}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Cabinet Part
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Part Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thickness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edge Banding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Width Formula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Height Formula
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cabinetParts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {part.partType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.materialType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.materialThickness}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-1">
                        {part.edgeBanding.front && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Front</span>
                        )}
                        {part.edgeBanding.back && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Back</span>
                        )}
                        {part.edgeBanding.top && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Top</span>
                        )}
                        {part.edgeBanding.bottom && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Bottom</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {part.widthFormula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {part.heightFormula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditPart(part.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePart(part.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CabinetPartModal */}
      <CabinetPartModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePart}
        partTypes={partTypes}
        materialTypes={materialTypes}
        materialThicknesses={materialThicknesses}
        edgeThicknesses={edgeThicknesses}
        accessories={accessories}
      />

      {/* CabinetDropdownSettingsModal */}
      <CabinetDropdownSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        partTypes={partTypes}
        setPartTypes={setPartTypes}
        materialTypes={materialTypes}
        setMaterialTypes={setMaterialTypes}
        materialThicknesses={materialThicknesses}
        setMaterialThicknesses={setMaterialThicknesses}
        edgeThicknesses={edgeThicknesses}
        setEdgeThicknesses={setEdgeThicknesses}
        accessories={accessories}
        setAccessories={setAccessories}
        edgeTypes={edgeTypes}
        setEdgeTypes={setEdgeTypes}
        formulas={formulas}
        setFormulas={setFormulas}
      />
    </div>
  );
};

export default ParametricCabinet;
