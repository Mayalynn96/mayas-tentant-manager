const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const {
    Unit,
    Property
} = require('../models');

// Get all Unites route
router.get('/', (req, res) => {
    Unit.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: 'An error occured',
            err: err
        });
    });
});

// Adding new Unit to Property
router.post("/", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a Unit to your Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        
        const propertyData = await Property.findByPk(req.body.propertyId)

        if(!propertyData){
            return res.status(404).json({ msg: "No property under this Id." });
        }

        if(tokenData.id !== propertyData.UserId){
            return res.status(403).json({ msg: "This property doesn't belong to you so you can not add a Unit." });
        }

        const newUnit = await Unit.create({
            unitNbr: req.body.unitNbr,
            size: req.body.size,
            floor: req.body.floor,
            PropertyId: req.body.propertyId,
            UserId: tokenData.id
        });

        res.status(201).json({message: "Unit creation successful", data: newUnit});
    } catch (err) {
        res.status(500).json({ message: "Error adding Unit.", error: err.message });
    }
})

module.exports = router;