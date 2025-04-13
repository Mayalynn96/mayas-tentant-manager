import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import './PropertyId.css';
import Loading from "../../components/Loading/Loading";
import EditProperty from '../../components/EditProperty/EditProperty';
import dayjs from 'dayjs';
import NewUnit from '../../components/NewUnit/NewUnit';
import MsgPopUp from '../../components/MsgPopUp/MsgPopUp';
import EditUnit from '../../components/EditUnit/EditUnit';

function PropertyId({ authState }) {
    //Set display for Pop Ups
    const [popUpUnitIsVisible, setPopUpUnitIsVisible] = useState(false);
    const [unitToBeDeleted, setUnitToBeDeleted] = useState(null);
    const [unitToBeUpdated, setUnitToBeUpdated] = useState(null);
    const [popUpPropertyIsVisible, setPopUpPropertyIsVisible] = useState(false);
    const [addUnitIsVisible, setAddUnitIsVisible] = useState(false);

    //Set display for updating property
    const [isVisible, setIsVisible] = useState(false);
    //Set display for updating unit
    const [isVisibleUnit, setIsVisibleUnit] = useState(false);

    //Handle display for editing property
    const handleClickEditProperty = () => {
        setIsVisible(!isVisible);
    };

    //Handle display for editing unit
    const handleClickEditUnit = (unit) => {
        if(unitToBeUpdated === null){
            setUnitToBeUpdated(unit)
        } else {
            setUnitToBeUpdated(null)
        }

        setIsVisibleUnit(!isVisibleUnit);
    };
    
    //Handle display for deletion Pop Up
    const handleDeleteBttn = () => {
        setPopUpPropertyIsVisible(!popUpPropertyIsVisible);
      };

    //Setting Property Data and Unit Data
    const [property, setProperty] = useState([]);
    const { propertyId } = useParams();
    const [units, setUnits] = useState([]);
    const [hasUnits, setHasUnits] = useState(false)

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // redirect to SingUp function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    useEffect(() => {
        
        // get Property if user is logged in
        const getProperty = async () => {
            if (authState.isLoggedIn) {
                const userProperty = await API.getPropertyById(propertyId, authState.token)
                console.log(userProperty)
                setProperty(userProperty);
                setUnits(userProperty.Units)
                if(userProperty.Units[0]){
                    setHasUnits(true)
                }
                return
            }
        };

        getProperty();
    }, [authState, propertyId]);

    //Handle display for adding new unit
    const handleClickNewUnit = () => {
        setAddUnitIsVisible(!addUnitIsVisible);
        console.log(addUnitIsVisible)
    };

    //Handle display for Deleting unit
    const handleUnitPopUp = (unitId) => {
        
        if(unitToBeDeleted === Number){
            setUnitToBeDeleted(null)
        } else {
            setUnitToBeDeleted(unitId)
        }

        setPopUpUnitIsVisible(!popUpUnitIsVisible);
    };

    const deleteProperty = async () => {
        const deletedProperty = await API.deleteProperty(propertyId, authState.token);
        console.log(deletedProperty);
        redirectTo("home");
        return
    };

    const deleteUnit = async () => {
        const deletedUnit = await API.deleteUnit(unitToBeDeleted, authState.token);
        console.log(deletedUnit);
        
        const leftOverUnits = units.filter(item => item.id !== unitToBeDeleted);
        setUnits(leftOverUnits);
        setPopUpUnitIsVisible(!popUpUnitIsVisible);
        setUnitToBeDeleted(null);

        return
    }

    // redirecting to UnitTenants
    const gotToUnit = (id) => {
        navigate(`/property/${property.id}/unit/${id}`)
    }

    function UnitSection() {
        if(!hasUnits){
            return (
                <section>
                    <p>This property has no units yet!</p>
                    <button onClick={handleClickNewUnit}>Add Unit</button>
                </section>
            )
        }

        return (
            <section>
                <p>Here are your Units!</p>
                <button onClick={handleClickNewUnit}>Add Unit</button>
                <p>Total Units: {units.length}</p>
                <div id="allUnits">
                    <div className='eachUnitHeader'>
                        <p style={{"fontWeight":"bold"}} className='columnA'>Unit Number</p>
                        <p style={{"fontWeight":"bold"}} className='columnB'>Unit Size</p>
                        <p style={{"fontWeight":"bold"}} className='columnC'>floor</p>
                        <p style={{"fontWeight":"bold"}} className='columnD'>Current Tenant</p>
                    </div>
                   {units.map(unit => {
                    
                    function CurrentTenant() {
                        if (!unit.Tenants || unit.Tenants.length === 0) {
                            return (
                                <p className='columnD'>No tenants yet</p>
                            )
                        } else {
                            for (let i = 0; i < unit.Tenants.length; i++){
                                if(dayjs().isAfter(unit.Tenants[i].moveInDate) && (!unit.Tenants[i].moveOutDate || dayjs().isBefore(unit.Tenants[i].moveOutDate))) {
                                    return (
                                        <p className='columnD'>{unit.Tenants[i].firstName} {unit.Tenants[i].lastName} household of {unit.Tenants[i].nbrOfHouseholdMembers} since {unit.Tenants[i].moveInDate}</p>
                                    )
                                } else {
                                    return (
                                        <p className='columnD'>No tenant currently living in this Unit</p>
                                    )
                                }
                            }
                            
                        }
                    }
                    
                    return(
                        <div className='eachUnit' key={unit.id}>
                            <p className='columnA'>{unit.unitNbr}</p>
                            <p className='columnB'>{unit.size} m<sup>2</sup></p>
                            <p className='columnC'>{unit.floor}</p>
                            <CurrentTenant/>
                            <button onClick={() => handleClickEditUnit(unit)}>Edit</button> 
                            <button onClick={() => handleUnitPopUp(unit.id)}>Delete</button>
                            <button onClick={() => gotToUnit(unit.id)}>Tenants</button>
                        </div>
                    )
                   })} 
                </div>
            </section>
        )
    }

    function MainPage() {
        if (property.address) {
            return (
                <main id='property'>
                    {isVisibleUnit && <EditUnit handleClickEditUnit={handleClickEditUnit} currentUnit={unitToBeUpdated} units={units} setUnits={setUnits} authState={authState} propertyId={propertyId} />}
                    {popUpUnitIsVisible && <MsgPopUp message={"Are you sure you want to delete this unit? All tenants will be delted as well."} buttonMsg={"Yes, Delete"} handleSubmit={deleteUnit} handleClose={handleUnitPopUp}/>}
                    {addUnitIsVisible && <NewUnit handleClickNewUnit={handleClickNewUnit} units={units} setUnits={setUnits} authState={authState} propertyId={property.id}/>}
                    {isVisible && <EditProperty handleClickEditProperty={handleClickEditProperty} property={property} setProperty={setProperty} authState={authState}/>}
                    {popUpPropertyIsVisible && 
                    <div id="deletePopUp" className="fade-in" >
                        <div className='moveToFront'>
                            <h2>Are you sure you want to delete this property?</h2>
                            <p>This action is not reversible and all units, tenants and bills will be deleted as well.</p>
                        </div>
                        <div className='moveToFront'>
                            <button onClick={deleteProperty} className='deleteBtnGeneral'>Yes, Delete</button>
                            <button onClick={handleDeleteBttn}>Cancel</button>
                        </div>
                    </div>}
                    <section id='propertyBanner'>
                    <h3 style={{ textTransform: 'capitalize' }}>{property.address}, {property.zipCode} {property.city}, {property.country} </h3>
                    <div id='bannerBtns'>
                    <button onClick={() => {redirectTo("home")}}>Home</button>
                    <button onClick={handleClickEditProperty}>Edit</button>
                    <button onClick={handleDeleteBttn}>Delete</button>
                    </div>
                    </section>
                    <UnitSection/>
                    <Outlet context={[property]} />
                </main>
            )
        } else if(property.msg){
            return (
                <main>
                    <p>{property.msg}</p>
                </main>
            )
        } else {
            return (
                <main>
                    <Loading />
                </main>
            )
        }
    }

    if (authState.isLoading) {
        return (
            <main>
                <Loading />
            </main>
        )
    } else if (authState.isLoggedIn) {
        return (
            <MainPage />
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
}

export default PropertyId;