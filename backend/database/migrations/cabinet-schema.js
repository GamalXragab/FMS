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
      formula TEXT NOT NULL,
      description TEXT
    )
  `);

  console.log('Cabinet schema tables created successfully');
};