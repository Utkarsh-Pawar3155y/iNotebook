const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a user and does not require auth
router.post('/', (req, res)=> {
    const user = User(req.body);
    user.save();
    res.send(req.body);
});

module.exports = router;