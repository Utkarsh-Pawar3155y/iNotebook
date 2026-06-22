const express = require('express');
const router = express.Router();
const fetchuser = require('../middlewares/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes using: GET /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});

//ROUTE 2: Add the notes using: POST /api/notes/addnote - requires login
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atlest 5 char').isLength({ min: 5 })
], async (req, res) => {

    try {



        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();

        res.json(savedNote);

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
});

module.exports = router;