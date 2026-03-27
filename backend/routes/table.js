const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { adminAuth, auth } = require('../middleware/auth');

// Get all tables
router.get('/', async (req, res) => {
    const tables = await Table.find();
    res.json(tables);
});

// Admin: Add table
router.post('/', adminAuth, async (req, res) => {
    const table = new Table(req.body);
    await table.save();
    req.app.get('io')?.emit('tableUpdate');
    res.json(table);
});

// Admin: Update table
router.put('/:id', adminAuth, async (req, res) => {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io')?.emit('tableUpdate');
    res.json(table);
});

// Admin: Delete table
router.delete('/:id', adminAuth, async (req, res) => {
    await Table.findByIdAndDelete(req.params.id);
    req.app.get('io')?.emit('tableUpdate');
    res.json({ msg: 'Table deleted' });
});

module.exports = router;
