import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, useNavigate } from "react-router-dom";
import './UnitTenants.css';
import Loading from '../../components/Loading/Loading';
import NewTenant from '../../components/NewTenant/NewTenant';
import EditTenant from '../../components/EditTenant/EditTenant';

function UnitTenants({ authState }) {
    //Setting Pop Up Visibility
    const [addTenantIsVisible, setAddTenantIsVisible] = useState(false);
    const [editTenantIsVisible, setEditTenantIsVisible] = useState(false);
    const [tenantToEdit, setTenantToEdit] = useState('');

    //Handle display for New Tenant
    const handleClickNewTenant = () => {
    setAddTenantIsVisible(!addTenantIsVisible);
    };

    //Handle display for Edit Tenant
    const handleClickEditTenant = (tenant) => {
        if(tenantToEdit === ''){
            setTenantToEdit(tenant)
        } else {
            setTenantToEdit('')
        }

        setEditTenantIsVisible(!editTenantIsVisible);
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
        if (tenants.length === 0) {
            return (
            <div>
                <h3>No tenants in this unit yet</h3>
                <button onClick={handleClickNewTenant}>Add Tenant</button>
            </div>
            )
        } else {
            return (
            <section>
            <h3>This unit has {tenants.length} Tenants</h3>
            <button onClick={handleClickNewTenant}>Add Tenant</button>
            <div id='allTenantsDiv'>
                <div id='allTenantsTitles'>
                    <p className='columnAT'>Honorific</p>
                    <p className='columnBT'>First Name</p>
                    <p className='columnCT'>Last Name</p>
                    <p className='columnDT'>Nbr</p>
                    <p className='columnET'>Move In Date</p>
                    <p className='columnFT'>Move Out Date</p>
                </div>
            {tenants.map(tenant => {
               return (
                <div className='tenantDiv' key={tenant.id}>
                    <p className='columnAT'>{tenant.honorific}</p>
                    <p className='columnBT'>{tenant.firstName}</p>
                    <p className='columnCT'>{tenant.lastName}</p>
                    <p className='columnDT'>{tenant.nbrOfHouseholdMembers}</p>
                    <p className='columnET'>{tenant.moveInDate}</p>
                    <p className='columnFT'>{tenant.moveOutDate}</p>
                    <button onClick={() => handleClickEditTenant(tenant)}>Edit</button>
                    <button>Delete</button>
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
                    {editTenantIsVisible && <EditTenant handleClickEditTenant={handleClickEditTenant} tenants={tenants} setTenants={setTenants} authState={authState} tenantToEdit={tenantToEdit} unitId={unitId}/>}
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