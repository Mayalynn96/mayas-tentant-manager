import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import './PropertyId.css';
import Loading from "../../components/Loading/Loading";
import EditProperty from '../../components/EditProperty/EditProperty';

function PropertyId({ authState }) {
    //Set display for Pop Up
    const [popUpIsVisible, setPopUpIsVisible] = useState(false);

    //Set display for updating property
    const [isVisible, setIsVisible] = useState(false);

    //Handle display for adding new property
    const handleClick = () => {
        setIsVisible(!isVisible);
        console.log(isVisible)
    };
    
    //Handle display for adding new property
    const handleDeleteBttn = () => {
        setPopUpIsVisible(!popUpIsVisible);
      };

    const [property, setProperty] = useState([]);
    const { propertyId } = useParams();

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
                setProperty(userProperty);
                return
            }
        };

        getProperty();
    }, [authState, propertyId]);

    const deleteProperty = async () => {
        const deletedProperty = await API.deleteProperty(propertyId, authState.token);
        console.log(deletedProperty)
        redirectTo("home")
        return
    }

    if (property.address) {
        return (
            <main id='property'>
                {isVisible && <EditProperty handleClick={handleClick} property={property} setProperty={setProperty} authState={authState}/>}
                {popUpIsVisible && 
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
                <button onClick={handleClick}>Edit</button>
                <button onClick={handleDeleteBttn}>Delete</button>
                </div>
                </section>
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

export default PropertyId;