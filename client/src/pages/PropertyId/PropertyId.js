import React, { useState, useEffect } from 'react';
import API from "../../utils/API";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import './PropertyId.css';
import Loading from "../../components/Loading/Loading";

function PropertyId({ authState }) {
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
                <section id='propertyBanner'>
                <h3 style={{ textTransform: 'capitalize' }}>{property.address}, {property.zipCode} {property.city}, {property.country} </h3>
                <div id='bannerBtns'>
                <button onClick={() => {redirectTo("home")}}>Go back</button>
                <button>Edit</button>
                <button onClick={deleteProperty}>Delete</button>
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