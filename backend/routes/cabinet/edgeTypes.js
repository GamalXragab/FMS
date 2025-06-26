import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all edge types
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_edge_types ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching edge types:', err);
    res.status(500).json({ error: 'Failed to fetch edge types' });
  }
});

// Add new edge type
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_edge_types (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ id: result.id, name });
  } catch (err) {
    console.error('Error adding edge type:', err);
    res.status(500).json({ error: 'Failed to add edge type' });
  }
});

// Update edge type
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_edge_types SET name = ? WHERE id = ?',
      [name, id]
    );
    res.json({ id, name });
  } catch (err) {
    console.error('Error updating edge type:', err);
    res.status(500).json({ error: 'Failed to update edge type' });
  }
});

// Delete edge type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_edge_types WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting edge type:', err);
    res.status(500).json({ error: 'Failed to delete edge type' });
  }
});

export default router;