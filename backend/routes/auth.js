const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_secret = process.env.JWT_SECRET;

// Create a user and does not require auth
router.post('/createuser', [

    body('name', 'Invalid Name').isLength({ min: 3 }),
    body('password', 'Password length should be greater than 5').isLength({ min: 5 }),
    body('email', 'Invalid Email').isEmail(),

], async (req, res) => {

    const result = validationResult(req);

    //error array catched by express-validator is empty
    if (result.isEmpty()) {

        //bcrypt the password before saving
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        try {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            });
            await user.save();

            //user id used for signing the token
            const data = {
                user: {
                    id: user.id
                }
            }

            //auth token generated
            const authToken = jwt.sign(data, JWT_secret);

            return res.json({ authToken });

        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    error: "Email already exists"
                });
            }
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }

    res.send({ errors: result.array() });

});

module.exports = router;