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

module.exports = router;