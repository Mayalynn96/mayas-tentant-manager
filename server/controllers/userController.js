const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');

// Calling models needed for User
const {
    User,
    Property
} = require('../models');

// Creating get all User route
router.get('/', (req, res) => {
    User.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: 'An error occured',
            err: err
        });
    });
});

// Creating Post route to create a new User
router.post('/', (req, res) => {
    User.create(req.body).then((newUser) => {
       // Saving email, name and Id to token
        const token = jwt.sign(
            {
                email: newUser.email,
                id: newUser.id,
                fullName: newUser.fullName
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '12h',
            }
        );
        res.json({
            token,
            user: newUser,
        });
    }).catch((err) => {
        console.log(err);
        res.json({message: "Error adding User.", error: err.errors[0].message });
    });
});

//Verify token validity
router.get("/isValidToken", (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res
            .status(403)
            .json({ isValid: false, msg: "you must be logged in!" });
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        res.json({
            isValid: true,
            user: tokenData,
        });
    } catch (err) {
        res.status(403).json({
            isValid: false,
            msg: "invalid token",
        });
    }
});

// Creating login route
router.post('/login', (req, res) => {
    User.findOne({
        where: {email: req.body.email},
    }).then((foundUser) => {
        //If email has not been founds
        if (!foundUser) {
            return res.status(401).json({
                msg: 'Invalid Login'
            });
        }
        //If password is wrong
        if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.status(401).json({
                msg: 'Invalid Login'
            });
        }
        //We know email and password are correct if no err so we save info to token
        const token = jwt.sign(
            {
                email: foundUser.email,
                id: foundUser.id,
                fullName: foundUser.fullName
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '12h'
            }
        );
        
        res.json({
            token, user: foundUser
        });
    }).catch((err) => {
        console.log(err);
        res.json({ msg: 'Oh no, there seems to be an error'});
    });
});

module.exports = router;