import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import './UnitTenants.css';
import Loading from '../../components/Loading/Loading';

function UnitTenants({ authState }) {
    //Setting Property Data and Unit Data
    const [property, setProperty] = useState([]);
    const { propertyId } = useParams();
    const [unit, setUnit] = useState([]);
    const { unitId } = useParams();

    // Adding useNavigate to navigate 
    const navigate = useNavigate();

    // redirect function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    };

    // redirecting to property
    const gotToProperty = (id) => {
        navigate(`/property/${id}`)
    }

    useEffect(() => {

        // get Property if user is logged in and nothing is stored in localstorage
        const getProperty = async () => {
            if (authState.isLoggedIn) {
                const userProperty = await API.getPropertyById(propertyId, authState.token)
                setProperty(userProperty);
                return
            } 
        };

        // get Unit if user is logged in and nothing is stored in localstorage
        const getUnit = async () => {
            if (authState.isLoggedIn) {
                const userUnit = await API.getUnitById(unitId, authState.token)
                setUnit(userUnit.unitData);
                return
            } 
        };

        getProperty();
        getUnit();
    }, [authState, propertyId, unitId]);

    if (authState.isLoading) {
        return (
            <main>
                <Loading />
            </main>
        )
    } else if(property.msg){
        return (
            <main>
                <p>{property.msg}</p>
            </main>
        )
    } else if(unit.msg){
        return (
            <main>
                <p>{unit.msg}</p>
            </main>
        )
    } else if (authState.isLoggedIn) {
        return (
            <main id='unitTenants'>
                <header id='UnitHeader'>
                    <h3>{property.address}, {property.zipCode} {property.city}, {property.country} </h3>
                    <h2 id='unitTenantTitle'>Tenants in Unit {unit.unitNbr} Floor {unit.floor}</h2>
                    <div id='bannerBtns'>
                    <button onClick={() => {gotToProperty(property.id)}}>Back to Property</button>
                    <button onClick={() => {redirectTo("home")}}>Home</button>
                    </div>
                </header>
            </main>
        )
    } else {
        return (
            <main>
                <h1>Welcome to our site!</h1>
                <p>It seems you are not logged in.</p>
                <div>
                    <button onClick={() => {redirectTo("login")}}>login</button>
                    <button onClick={() => {redirectTo("signUp")}}>Sign Up</button>
                </div>
            </main>
        )
    }
};

export default UnitTenants;