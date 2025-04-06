const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();

const {
    Property,
    Unit
} = require('../models');

// Get all Properties route
router.get('/', (req, res) => {
    Property.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: 'An error occured',
            err: err
        });
    });
});

// Get all Properties by current User
router.get("/allUserProperties", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to get all user Properties." });
    } try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const userPropertyData = await Property.findAll({
            where: {UserId: tokenData.id}
        })
        res.json(userPropertyData)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error getting all user Properties.", error: err});
    }
})

// Get a property by ID
router.get("/:propertyId", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to get this property." });
    } try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const propertyData = await Property.findByPk(req.params.propertyId, {
            include: {model: Unit}
        })

        if(!propertyData){
            return res.status(404).json({ msg: "No property under this Id." });
        }

        if(tokenData.id !== propertyData.UserId){
            return res.status(403).json({ msg: "This property doesn't belong to you." });
        }

        res.json(propertyData)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error getting this property.", error: err });
    }
})

// Adding new Property
router.post("/", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const newProperty = await Property.create({
            address: req.body.address,
            city: req.body.city,
            zipCode: req.body.zipCode,
            country: req.body.country,
            nbrOfAp: req.body.nbrOfAp,
            UserId: tokenData.id
        });

        res.status(201).json({message: "Property creation successful", data: newProperty});
    } catch (err) {
        res.status(500).json({ message: "Error adding Property.", error: err.message });
    }
})

// Update Property Route
router.put('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to edit a Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const propertyData = await Property.findByPk(req.params.id)

        if(!propertyData){
            return res.status(404).json({ msg: "No property under this Id." });
        }

        if(tokenData.id !== propertyData.UserId){
            return res.status(403).json({ msg: "This property doesn't belong to you." });
        }

        const updatedPopertyData = await propertyData.update({
            address: req.body.address,
            city: req.body.city,
            zipCode: req.body.zipCode,
            country: req.body.country,
            nbrOfAp: req.body.nbrOfAp,
            UserId: tokenData.id
        });

        res.status(201).json({msg: "Property update successful", data: updatedPopertyData});
    } catch (err) {
        res.status(500).json({ msg: "Error updating Property.", error: err.message });
    }
});

// Delete Property route
router.delete('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to delete a Property" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const propertyData = await Property.findByPk(req.params.id)

        if(!propertyData){
            return res.status(404).json({ msg: "No property under this Id." });
        }

        if(tokenData.id !== propertyData.UserId){
            return res.status(403).json({ msg: "This property doesn't belong to you." });
        }

        propertyData.destroy();

        res.status(201).json({msg: "Property deletion successful"});
    } catch (err) {
        res.status(500).json({ msg: "Error deleting Property.", error: err.message });
    }
});

module.exports = router;