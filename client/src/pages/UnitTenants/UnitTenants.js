import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, useNavigate } from "react-router-dom";
import './UnitTenants.css';
import Loading from '../../components/Loading/Loading';
import NewTenant from '../../components/NewTenant/NewTenant';

function UnitTenants({ authState }) {
    //Setting Pop Up Visibility
    const [addTenantIsVisible, setAddTenantIsVisible] = useState(false);
    //Handle display for New Tenant
    const handleClickNewTenant = () => {
    setAddTenantIsVisible(!addTenantIsVisible);
    };

    //Setting Property Data and Unit Data
    const [property, setProperty] = useState([]);
    const { propertyId } = useParams();
    const [unit, setUnit] = useState([]);
    const [tenants, setTenants] = useState([]);
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
                if(userUnit.unitData.Tenants){
                    setTenants(userUnit.unitData.Tenants)
                }
                return
            } 
        };

        getProperty();
        getUnit();
    }, [authState, propertyId, unitId]);

    function AllTenants(){
        console.log(tenants)
        if (tenants.length === 0) {
            return (
            <h3>No tenants in this unit yet</h3>
            )
        } else {
            return (
            <section>
            <h3>This unit has {tenants.length} Tenants</h3>
            <div>
            {tenants.map(tenant => {
               return (
                <div key={tenant.id}>
                    <p>{tenant.firstName}</p>
                </div>
               ) 
            })}
            </div>
            </section>
            )
        }
    }

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
                    <div id="unitHeaderBanner">
                    <h3>{property.address}, {property.zipCode} {property.city}, {property.country} </h3>
                    <h2 id='unitTenantTitle'>Unit {unit.unitNbr} Floor {unit.floor}</h2>
                    </div>
                    <div id='bannerBtns'>
                    <button onClick={() => {gotToProperty(property.id)}}>Back to Property</button>
                    <button onClick={() => {redirectTo("home")}}>Home</button>
                    </div>
                </header>
                <section>
                    <AllTenants />
                    <button onClick={handleClickNewTenant}>Add Tenant</button>
                    {addTenantIsVisible && <NewTenant handleClickNewTenant={handleClickNewTenant} tenants={tenants} setTenants={setTenants} unitId={unitId} authState={authState}/>}
                </section>
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