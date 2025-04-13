const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const {
    Unit,
    Property,
    Tenant
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

// Get Unit by Id
router.get('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to edit a Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const unitData = await Unit.findByPk(req.params.id, {
            include: [{model: Tenant}]
        })

        if(!unitData){
            return res.status(404).json({ msg: "No unit under this Id." });
        }

        if(tokenData.id !== unitData.UserId){
            return res.status(403).json({ msg: "This unit doesn't belong to you." });
        }

        res.status(201).json({unitData});
    } catch (err) {
        res.status(500).json({ msg: "Error updating Unit.", error: err.message });
    }
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

// Update Unit Route
router.put('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to edit a Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const unitData = await Unit.findByPk(req.params.id)

        if(!unitData){
            return res.status(404).json({ msg: "No unit under this Id." });
        }

        if(tokenData.id !== unitData.UserId){
            return res.status(403).json({ msg: "This unit doesn't belong to you." });
        }

        const updatedUnitData = await unitData.update({
            unitNbr: req.body.unitNbr,
            size: req.body.size,
            floor: req.body.floor,
            PropertyId: req.body.propertyId,
            UserId: tokenData.id
        });

        res.status(201).json({msg: "Unit update successful", data: updatedUnitData});
    } catch (err) {
        res.status(500).json({ msg: "Error updating Unit.", error: err.message });
    }
});

// Delete Unit route
router.delete('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to delete a Unit" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const unitData = await Unit.findByPk(req.params.id)

        if(!unitData){
            return res.status(404).json({ msg: "No unit under this Id." });
        }

        if(tokenData.id !== unitData.UserId){
            return res.status(403).json({ msg: "This unit doesn't belong to you." });
        }

        unitData.destroy();

        res.status(201).json({msg: "Unit deletion successful"});
    } catch (err) {
        res.status(500).json({ msg: "Error deleting Unit.", error: err.message });
    }
});

module.exports = router;