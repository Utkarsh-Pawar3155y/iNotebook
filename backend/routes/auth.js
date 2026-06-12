const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a user and does not require auth
router.post('/', [

    body('name', 'Invalid Name').isLength({ min: 3 }),
    body('password', 'Password length should be greater than 5').isLength({ min: 5 }),
    body('email', 'Invalid Email').isEmail(),

], async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            await user.save();
        }
        catch (error) {
            if (error.code === 11000) {
                return res.send({ error: "Duplicate Email" });
            }
            return res.send({error : "Internal Server error"});
        }

        return res.send(`Hello, ${req.body.name}!`);
    }

    res.send({ errors: result.array() });

});

module.exports = router;