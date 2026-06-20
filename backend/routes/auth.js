const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');

const JWT_secret = process.env.JWT_SECRET;

//ROUTE 1: Create a user and does not require auth
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

//ROUTE 2: Authenticate  a user using: POST " /api/auth/login "
router.post('/login', [

    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array()} );
    }

     const {email, password} = req.body;

     try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Try to login with correct credentials"});
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_secret);

        return res.json({ authToken });

     } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
     }

});

//ROUTE 3: Get loggeed in user details /api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {

    try{

        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        return res.send(user);

    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }

});

module.exports = router;