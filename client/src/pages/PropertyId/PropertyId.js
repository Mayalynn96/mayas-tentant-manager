import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, useNavigate } from "react-router-dom";
import './PropertyId.css';
import Loading from "../../components/Loading/Loading";
import dayjs from 'dayjs';
import NewUnit from '../../components/NewUnit/NewUnit';
import MsgPopUp from '../../components/MsgPopUp/MsgPopUp';
import EditUnit from '../../components/EditUnit/EditUnit';
import BannerButtons from '../../components/BannerButtons/BannerButtons';
import Header from '../../components/Header/Header';

function PropertyId({ authState }) {
    //Set display for Pop Ups
    const [popUpUnitIsVisible, setPopUpUnitIsVisible] = useState(false);
    const [unitToBeDeleted, setUnitToBeDeleted] = useState('');
    const [unitToBeUpdated, setUnitToBeUpdated] = useState('');
    const [addUnitIsVisible, setAddUnitIsVisible] = useState(false);

    //Set display for updating unit
    const [isVisibleUnit, setIsVisibleUnit] = useState(false);

    //Handle display for editing unit
    const handleClickEditUnit = (unit) => {
        if(unitToBeUpdated === ''){
            setUnitToBeUpdated(unit)
        } else {
            setUnitToBeUpdated('')
        }

        setIsVisibleUnit(!isVisibleUnit);
    };
    

    //Setting Unit Data
    const { propertyId } = useParams();
    const [units, setUnits] = useState([]);
    const [hasUnits, setHasUnits] = useState(false)

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // redirect to SingUp function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        // get Property if user is logged in
        const getUnits = async () => {
            if (authState.isLoggedIn) {
                setIsLoading(true)
                const propertyUnits = await API.getUnitsByPropertyId(propertyId, authState.token)
                setUnits(propertyUnits.unitData)
                if(propertyUnits.unitData[0]){
                    setHasUnits(true)
                }
                setIsLoading(false)
                return
            }
        };

        getUnits();
    }, [authState, propertyId]);

    //Handle display for adding new unit
    const handleClickNewUnit = () => {
        setAddUnitIsVisible(!addUnitIsVisible);
    };

    //Handle display for Deleting unit
    const handleUnitPopUp = (unitId) => {
        
        if(unitToBeDeleted === Number){
            setUnitToBeDeleted('')
        } else {
            setUnitToBeDeleted(unitId)
        }

        setPopUpUnitIsVisible(!popUpUnitIsVisible);
    };

    const deleteUnit = async () => {
        const deletedUnit = await API.deleteUnit(unitToBeDeleted, authState.token);
        if(deletedUnit.error){
            console.log(deletedUnit.error);
        }
        
        const leftOverUnits = units.filter(item => item.id !== unitToBeDeleted);
        setUnits(leftOverUnits);
        setPopUpUnitIsVisible(!popUpUnitIsVisible);
        setUnitToBeDeleted(null);

        return
    }

    // redirecting to UnitTenants
    const gotToUnit = (id) => {
        navigate(`/property/${propertyId}/unit/${id}`)
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
                <p>Overview</p>
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
                        const currentTennant = []
                        if (!unit.Tenants || unit.Tenants.length === 0) {
                            return (
                                <p className='columnD'>No tenants yet</p>
                            )
                        } else {
                            for (let i = 0; i < unit.Tenants.length; i++){
                                if(dayjs().isAfter(unit.Tenants[i].moveInDate) && (!unit.Tenants[i].moveOutDate || dayjs().isBefore(unit.Tenants[i].moveOutDate))) {
                                    currentTennant.push(unit.Tenants[i])
                                } 
                            }
                            if(currentTennant.length === 0){
                                return (
                                    <p className='columnD'>No tenant currently living in this Unit</p>
                                )
                            } else {
                                return (
                                    <p className='columnD'>{currentTennant[0].firstName} {currentTennant[0].lastName} household of {currentTennant[0].nbrOfHouseholdMembers} since {currentTennant[0].moveInDate}</p>
                                )
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
        if (!isLoading) {
            return (
                <main id='property'>
                    {isVisibleUnit && <EditUnit handleClickEditUnit={handleClickEditUnit} currentUnit={unitToBeUpdated} units={units} setUnits={setUnits} authState={authState} propertyId={propertyId} />}
                    {popUpUnitIsVisible && <MsgPopUp message={"Are you sure you want to delete this unit? All tenants will be delted as well."} buttonMsg={"Yes, Delete"} handleSubmit={deleteUnit} handleClose={handleUnitPopUp}/>}
                    {addUnitIsVisible && <NewUnit handleClickNewUnit={handleClickNewUnit} units={units} setUnits={setUnits} authState={authState} propertyId={propertyId}/>}   
                    <Header authState={authState}/>
                    <BannerButtons propertyId={propertyId}/>
                    <UnitSection/>
                </main>
            )
        } else if(units.msg){
            return (
                <main>
                    <p>{units.msg}</p>
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