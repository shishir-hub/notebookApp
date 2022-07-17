const express = require('express');
const router = express.Router();
const Notes = require('../modles/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


//Route1: Get all the Notes using: GET "/api/notes/fetchallnotes". requires login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }

});

//Route2: Add a new Note using: POST "/api/notes/addnote". requires login
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 5 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // If any error exits than return bat request and the errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notes = new Notes({
            title, description, tag, user: req.user.id,
        });
        const savedNote = await notes.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }

});

//Route3: Update existing Note using: PUT "/api/notes/updatenote". requires login
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {

        // Create a newNote Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it
        let notes = await Notes.findById(req.params.id);
        if (!notes) { res.status(404).send("Not Found") };

        if (notes.user.toString() !== req.user.id) {
            if (!notes) { res.status(401).send("Not Allowed") };
        }

        notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }

});

//Route4: Delete existing Note using: DELETE "/api/notes/deletenote". requires login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        //Find the note to be deleted and delete it
        let notes = await Notes.findById(req.params.id);
        if (!notes) { res.status(404).send("Not Found") };

        //Allow deletion only if user owns the Note
        if (notes.user.toString() !== req.user.id) {
            if (!notes) { res.status(401).send("Not Allowed") };
        }

        notes = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", notes: notes });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
});

module.exports = router;