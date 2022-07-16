const express = require('express');
const User = require('../modles/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');


// Create a user using: POST "/api/auth". Doesn't require Auth
router.post('/', [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Name must be at least 5 characters').isLength({ min: 4 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    }).then(user => res.json(user)).catch(err => {
        console.log(err)
        res.json({ error: "User already exists with that eamil." })
    });
})

module.exports = router