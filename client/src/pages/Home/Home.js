import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";
import './Home.css';
import Loading from "../../components/Loading/Loading";
import NewProperty from '../../components/NewProperty/NewProperty';

function Home({ authState }) {
    //Set display for adding new property
    const [isVisible, setIsVisible] = useState(false);
    
    //Handle display for adding new property
    const handleClick = () => {
      setIsVisible(!isVisible);
      console.log(isVisible)
    };

    // creating properties const
    const [properties, setProperties] = useState([])

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // redirect to login function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    // redirecting to property
    const gotToProperty = (id) => {
        navigate(`/property/${id}`)
    }

    //Getting Properties
    useEffect(() => {
        const getProperties = async () => {
            if (authState.isLoggedIn) {
                const userProperties = await API.getUserProperties(authState.token);
                setProperties(userProperties);
                console.log(userProperties)
                return 
            }
        }

        getProperties();
    },[authState])

    if (authState.isLoading) {
        return (
            <main>
                <Loading />
            </main>
        )
    } else if (authState.isLoggedIn && !properties[0]) {
        return (
            <main>
                <h1>Welcome {authState.userData.fullName}</h1>
                <p>Please add a property to start</p>
                <div id='allPropertyBtns'>
                <button className='propertyBtn' onClick={() => handleClick()}>Add new Property</button>
                {isVisible && <NewProperty handleClick={handleClick} properties={properties} setProperties={setProperties} authState={authState}/>}
                </div>
            </main>
        )
    } else if (authState.isLoggedIn) {
        return (
            <main>
                <h1>Welcome {authState.userData.fullName}</h1>
                <p>Please add or select your property to start</p>
                <div id='allPropertyBtns'>
                    {isVisible && <NewProperty handleClick={handleClick} properties={properties} setProperties={setProperties} authState={authState}/>}
                    <button className='propertyBtn' onClick={() => handleClick()}>Add new Property</button>
                    {properties.map((property, index) => {
                        return (
                            <button className='propertyBtn' onClick={() => {gotToProperty(property.id)}} key={index}>
                                <p style={{ fontWeight: 'bold' }}>{property.address}</p>
                                <p>{property.zipCode} {property.city}</p>
                                <p>{property.nbrOfAp} Units</p>
                            </button>
                        )
                    })}
                </div>
            </main>
        )
    } else {
        return (
            <main>
                <h1>Welcome to our site!</h1>
                <div>
                    <button onClick={() => {redirectTo("login")}}>login</button>
                    <button onClick={() => {redirectTo("signUp")}}>Sign Up</button>
                </div>
            </main>
        )
    }
}

export default Home;