const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const dayjs = require('dayjs')

const {
    Tenant,
    Unit
} = require('../models');

// Get all Tenants route
router.get('/', (req, res) => {
    Tenant.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: 'An error occured',
            err: err
        });
    });
});

// Adding new Tenant to Unit
router.post("/", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a Tenant to your Unit" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        
        const unitData = await Unit.findByPk(req.body.unitId, {
            include: [{model: Tenant}]
        })

        if(!unitData){
            return res.status(404).json({ msg: "No Unit under this Id." });
        }

        if(tokenData.id !== unitData.UserId){
            return res.status(403).json({ msg: "This unit doesn't belong to you so you can not add a tenant." });
        }

        for(i=0;i<unitData.Tenants.length;i++){
            if(dayjs(req.body.moveInDate).isBefore(dayjs(unitData.Tenants[i].moveInDate)) && (!req.body.moveOutDate || dayjs(req.body.moveOutDate).isAfter(dayjs(unitData.Tenants[i].moveInDate))) ){
                return res.status(409).json({msg: `please add move out date before ${dayjs(unitData.Tenants[i].moveInDate).format('DD/MM/YYYY')}`})
            }

            if(dayjs(req.body.moveInDate).isAfter(dayjs(unitData.Tenants[i].moveInDate)) && (!unitData.Tenants[i].moveOutDate || dayjs(req.body.moveInDate).isBefore(dayjs(unitData.Tenants[i].moveOutDate)))){
                return res.status(409).json({msg: `There is already a tenant living there from ${dayjs(unitData.Tenants[i].moveInDate).format('DD/MM/YYYY')} please check your dates`})
            }
        }

        const newTenant = await Tenant.create({
            fullName: req.body.fullName,
            moveInDate: req.body.moveInDate,
            moveOutData: req.body.moveOutData,
            UnitId: req.body.unitId,
            UserId: tokenData.id
        });

        res.status(201).json({message: "Tenant creation successful", data: newTenant});
    } catch (err) {
        res.status(500).json({ message: "Error adding Unit.", error: err.message });
    }
})

// Update Unit Route
router.put('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to edit a Tenant" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const tenantData = await Tenant.findByPk(req.params.id)

        const unitData = await Unit.findByPk(req.body.unitId, {
            include: [{model: Tenant}]
        })

        if(!tenantData){
            return res.status(404).json({ msg: "No tenant under this Id." });
        }

        if(tokenData.id !== tenantData.UserId){
            return res.status(403).json({ msg: "This tenant doesn't belong to you." });
        }

        for(i=0;i<unitData.Tenants.length;i++){
            
            if(unitData.Tenants[i].id != req.params.id){
               
                if(dayjs(req.body.moveInDate).isBefore(dayjs(unitData.Tenants[i].moveInDate)) && (!req.body.moveOutDate || dayjs(req.body.moveOutDate).isAfter(dayjs(unitData.Tenants[i].moveInDate))) ){
                    return res.status(409).json({msg: `please add move out date before ${dayjs(unitData.Tenants[i].moveInDate).format('DD/MM/YYYY')}`})
                }
    
                if(dayjs(req.body.moveInDate).isAfter(dayjs(unitData.Tenants[i].moveInDate)) && (!unitData.Tenants[i].moveOutDate || dayjs(req.body.moveInDate).isBefore(dayjs(unitData.Tenants[i].moveOutDate)))){
                    return res.status(409).json({msg: `There is already a tenant living there from ${dayjs(unitData.Tenants[i].moveInDate).format('DD/MM/YYYY')} please check your dates`})
                }
            }
        }

        const updatedTenantData = await tenantData.update({
            fullName: req.body.fullName,
            moveInDate: req.body.moveInDate,
            moveOutDate: req.body.moveOutDate,
            UnitId: req.body.unitId,
            UserId: tokenData.id
        });

        res.status(201).json({msg: "Tenant update successful", data: updatedTenantData});
    } catch (err) {
        res.status(500).json({ msg: "Error updating tenant.", error: err.message });
    }
});

// Delete Unit route
router.delete('/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to delete a Tenant" });
    }
    try {  
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);

        const tenantData = await Tenant.findByPk(req.params.id)

        if(!tenantData){
            return res.status(404).json({ msg: "No tenant under this Id." });
        }

        if(tokenData.id !== tenantData.UserId){
            return res.status(403).json({ msg: "This tenant doesn't belong to you." });
        }

        tenantData.destroy();

        res.status(201).json({msg: "Tenant deletion successful"});
    } catch (err) {
        res.status(500).json({ msg: "Error deleting tenant.", error: err.message });
    }
});

module.exports = router;