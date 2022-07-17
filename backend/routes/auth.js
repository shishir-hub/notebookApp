const express = require('express');
const User = require('../modles/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'shishiri$@bAda$$'; //secret digital signature

//Route1: Create a user using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('email', 'Enter a valid Email').isEmail(),
    body('name', 'Name must be at least 5 characters').isLength({ min: 4 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    // If any error exits than return bat request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Checking whether the email already exists or not.

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User already exists with this email." });
        }
        //Hashing the password as sequire password and the secPass ie, hashed is stored in the db
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        //Creating toke with signature and sending it to the client for signin
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken);
        res.json(authToken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }

});

//Route2: Authenticate a user using: POST "/api/auth/login". Doesn't require login
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank.').exists(),
], async (req, res) => {

    // If any error exits than return bat request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Try to login with correct credentials." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try to login with correct credentials." });
        }

        //Creating toke with signature and sending it to the client for signin
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json(authToken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
});


//Route3: Get user details using: POST "/api/auth/getuser". Doesn't require login.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
});


module.exports = router