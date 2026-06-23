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


//ROUTE 3: Update the existing note: PUT /api/notes/updatenote - requires login
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;

    //create a new note object
    const newNote = {};
    if(title){
        newNote.title = title;
    }
    if(tag){
        newNote.tag = tag;
    }
    if(description){
        newNote.description = description;
    }

    let note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).send("Not Found");
    }

    if(note.user.toString() != req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id , {$set: newNote}, {new:true});

    res.json({note});

});


//ROUTE 4: Delete the existing note: DELETE /api/notes/deletenote - requires login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    let note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).send("Not Found");
    }

    if(note.user.toString() != req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({"Success": "Note has been deleted", note: note});

});


module.exports = router;