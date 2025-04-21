const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const {
    Unit,
    Property,
    Tenant,
    Bill
} = require('../models');

// Get all Bills route
router.get('/', (req, res) => {
    Bill.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: 'An error occured',
            err: err
        });
    });
});


// Adding new Bill to Property
router.post("/", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a Bill to your Property" });
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

        const newUnit = await Bill.create({
            category: req.body.category,
            subCategory: req.body.subCategory,
            company: req.body.company,
            date: req.body.date,
            amount: req.body.amount,
            PropertyId: req.body.propertyId,
            UserId: tokenData.id
        });

        res.status(201).json({message: "Bill creation successful", data: newUnit});
    } catch (err) {
        res.status(500).json({ message: "Error adding Bill.", error: err.message });
    }
})

// Update Bill Route
router.put('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to edit a Bill" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const billData = await Bill.findByPk(req.params.id)

        if(!billData){
            return res.status(404).json({ msg: "No bill under this Id." });
        }

        if(tokenData.id !== billData.UserId){
            return res.status(403).json({ msg: "This bill doesn't belong to you." });
        }

        const updatedBillData = await billData.update({
            category: req.body.category,
            subCategory: req.body.subCategory,
            company: req.body.company,
            date: req.body.date,
            amount: req.body.amount,
            PropertyId: req.body.propertyId,
            UserId: tokenData.id
        });

        res.status(201).json({msg: "Tenant update successful", data: updatedBillData});
    } catch (err) {
        res.status(500).json({ msg: "Error updating Tenant.", error: err.message });
    }
});

// Delete Bill route
router.delete('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to delete a Bill" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const billData = await Bill.findByPk(req.params.id)

        if(!billData){
            return res.status(404).json({ msg: "No bill under this Id." });
        }

        if(tokenData.id !== billData.UserId){
            return res.status(403).json({ msg: "This bill doesn't belong to you." });
        }

        billData.destroy();

        res.status(201).json({msg: "Bill deletion successful"});
    } catch (err) {
        res.status(500).json({ msg: "Error deleting Bill.", error: err.message });
    }
});

module.exports = router;