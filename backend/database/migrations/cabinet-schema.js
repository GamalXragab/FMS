import { runStatement } from '../connection.js';

export const createCabinetSchema = async () => {
  // Cabinet Part Types
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_part_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      default_width_formula TEXT,
      default_height_formula TEXT
    )
  `);

  // Material Types
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_material_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Material Thicknesses
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_material_thicknesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL UNIQUE
    )
  `);

  // Edge Thicknesses
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_edge_thicknesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL UNIQUE
    )
  `);

  // Edge Types
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_edge_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Accessories
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Cabinet Parts
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_type_id INTEGER NOT NULL,
      material_type_id INTEGER NOT NULL,
      material_thickness_id INTEGER NOT NULL,
      edge_thickness_id INTEGER NOT NULL,
      accessories TEXT, -- JSON array of accessory IDs
      edge_banding TEXT, -- JSON object {front, back, top, bottom}
      width_formula TEXT,
      height_formula TEXT,
      custom_width_formula TEXT,
      custom_height_formula TEXT,
      FOREIGN KEY (part_type_id) REFERENCES cabinet_part_types(id),
      FOREIGN KEY (material_type_id) REFERENCES cabinet_material_types(id),
      FOREIGN KEY (material_thickness_id) REFERENCES cabinet_material_thicknesses(id),
      FOREIGN KEY (edge_thickness_id) REFERENCES cabinet_edge_thicknesses(id)
    )
  `);

  // Cabinet Formulas
  await runStatement(`
    CREATE TABLE IF NOT EXISTS cabinet_formulas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      formulaH TEXT NOT NULL,
      formulaW TEXT NOT NULL,
      part_types TEXT,
      description TEXT
    )
  `);

  // Insert default data
  await insertDefaultData();

  console.log('Cabinet schema tables created successfully');
};

// Function to insert default data
async function insertDefaultData() {
  // Insert default part types if they don't exist
  const defaultPartTypes = ['Side Panel', 'Bottom', 'Back', 'Door', 'Shelf'];
  for (const name of defaultPartTypes) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_part_types (name) VALUES (?)
    `, [name]);
  }

  // Insert default material types if they don't exist
  const defaultMaterialTypes = ['Plywood', 'MDF', 'Particle Board', 'Solid Wood'];
  for (const name of defaultMaterialTypes) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_material_types (name) VALUES (?)
    `, [name]);
  }

  // Insert default material thicknesses if they don't exist
  const defaultMaterialThicknesses = ['12mm', '16mm', '18mm', '25mm'];
  for (const value of defaultMaterialThicknesses) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_material_thicknesses (value) VALUES (?)
    `, [value]);
  }

  // Insert default edge thicknesses if they don't exist
  const defaultEdgeThicknesses = ['0.5mm', '1mm', '2mm'];
  for (const value of defaultEdgeThicknesses) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_edge_thicknesses (value) VALUES (?)
    `, [value]);
  }

  // Insert default edge types if they don't exist
  const defaultEdgeTypes = ['PVC', 'ABS', 'Wood Veneer', 'Melamine'];
  for (const name of defaultEdgeTypes) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_edge_types (name) VALUES (?)
    `, [name]);
  }

  // Insert default accessories if they don't exist
  const defaultAccessories = ['Hinges', 'Drawer Slides', 'Handles', 'Shelf Pins'];
  for (const name of defaultAccessories) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_accessories (name) VALUES (?)
    `, [name]);
  }

  // Insert default formulas if they don't exist
  const defaultFormulas = [
    {
      name: 'Standard Side Panel',
      formulaH: 'CabinetHeight',
      formulaW: 'CabinetDepth',
      part_types: JSON.stringify(['Side Panel']),
      description: 'Standard formula for cabinet side panels'
    },
    {
      name: 'Standard Bottom',
      formulaH: 'T',
      formulaW: 'CabinetWidth - 2*T',
      part_types: JSON.stringify(['Bottom']),
      description: 'Standard formula for cabinet bottom panels'
    },
    {
      name: 'Standard Back',
      formulaH: 'CabinetHeight',
      formulaW: 'CabinetWidth',
      part_types: JSON.stringify(['Back']),
      description: 'Standard formula for cabinet back panels'
    }
  ];

  for (const formula of defaultFormulas) {
    await runStatement(`
      INSERT OR IGNORE INTO cabinet_formulas (name, formulaH, formulaW, part_types, description) 
      VALUES (?, ?, ?, ?, ?)
    `, [formula.name, formula.formulaH, formula.formulaW, formula.part_types, formula.description]);
  }
}