const express = require('express');
const { getDB } = require('../utils/db');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Create a new nudge
router.post('/', async (req, res) => {
    console.log('Request Headers:', req.headers); // Log the headers
    console.log('Request Body:', req.body); // Log the body
    try {
        const db = getDB();
        const nudge = req.body;
        console.log('Received Nudge:', nudge);
        const result = await db.collection('nudges').insertOne(nudge);
        const insertedNudge = { _id: result.insertedId, ...nudge };
        res.status(201).json(insertedNudge);
    } catch (error) {
        console.error('Error inserting nudge:', error);
        res.status(500).json({ error: error.message });
    }
});


// Get all nudges
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const nudges = await db.collection('nudges').find().toArray();

        // Log the retrieved data for debugging
        console.log('Retrieved Nudges:', nudges);

        res.json(nudges);  // Send the full object as response
    } catch (error) {
        console.error('Error retrieving nudges:', error);
        res.status(500).json({ error: error.message });
    }
});


// Get a single nudge by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const nudge = await db.collection('nudges').findOne({ _id: new ObjectId(id) });
        if (!nudge) return res.status(404).json({ error: 'Nudge not found' });
        res.json(nudge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a nudge by ID
router.put('/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const updates = req.body;
        const result = await db.collection('nudges').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Nudge not found' });
        res.json({ message: 'Nudge updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a nudge by ID
router.delete('/:id', async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const result = await db.collection('nudges').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Nudge not found' });
        res.json({ message: 'Nudge deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
