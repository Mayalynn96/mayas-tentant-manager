import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, useNavigate } from "react-router-dom";
import './Header.css';
import EditProperty from '../EditProperty/EditProperty';

function Header({ authState }) {
    //Set display for updating property
    const [isVisible, setIsVisible] = useState(false);
    const [popUpPropertyIsVisible, setPopUpPropertyIsVisible] = useState(false);
     //Setting Property Data
    const [property, setProperty] = useState([]);
    const { propertyId } = useParams();

    //Handle display for editing property
    const handleClickEditProperty = () => {
        setIsVisible(!isVisible);
    };

    //Handle display for deletion Pop Up
    const handleDeleteBttn = () => {
        setPopUpPropertyIsVisible(!popUpPropertyIsVisible);
    };

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // redirect to SingUp function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    useEffect(() => {
        // get Property if user is logged in
        const getProperty = async () => {
            console.log(authState.authState)
            if (authState.isLoggedIn) {
                const userProperty = await API.getPropertyById(propertyId, authState.token)
                setProperty(userProperty);
                console.log(userProperty)
                console.log("isLogged in")
                return
            }
        };

        getProperty();
    }, [authState, propertyId]);

    const deleteProperty = async () => {
        const deletedProperty = await API.deleteProperty(propertyId, authState.token);
        if (deleteProperty.error) {
            console.log(deletedProperty.error);
        }
        redirectTo("home");
        return
    };

    return (
        <section id='headerSection'>
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
                    <button onClick={() => { redirectTo("home") }}>Home</button>
                    <button onClick={handleClickEditProperty}>Edit</button>
                    <button onClick={handleDeleteBttn}>Delete</button>
                </div>
            </section>
        </section>
    )
}

export default Header;