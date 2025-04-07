import React, { useState } from 'react';
import './EditProperty.css';
import API from '../../utils/API';

function EditProperty({handleClick, property, setProperty, authState}) {
    const [addressInput, setAddressInput] = useState(property.address);
    const [zipCodeInput, setZipCodeInput] = useState(property.zipCode);
    const [cityInput, setCityInput] = useState(property.city);
    const [countryInput, setCountryInput] = useState(property.country);

    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.target.id === "addressInput") {
            setAddressInput(e.target.value)
        } else if(e.target.id === "zipCodeInput") {
            setZipCodeInput(e.target.value)
        } else if(e.target.id === "cityInput") {
            setCityInput(e.target.value)
        } else if(e.target.id === "countryInput") {
            setCountryInput(e.target.value)
        } 
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const editedPropertyData = {
            "address": addressInput,
            "zipCode": zipCodeInput,
            "city": cityInput,
            "country": countryInput
        };

        const updatedProperty = await API.updateProperty(property.id, editedPropertyData, authState.token);

        setProperty(updatedProperty.data);

        handleClick();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Update property</h2>
                <form onSubmit={submitForm} id='newPropertyForm'>
                    <div>
                        <input type="text" id="addressInput" placeholder='Address' value={addressInput} onChange={handleInputChange}/>
                        <input type="number" id="zipCodeInput" placeholder='Zip' value={zipCodeInput} onChange={handleInputChange}/>
                        <input type="text" id="cityInput" placeholder='City' value={cityInput} onChange={handleInputChange}/>
                        <input type="text" id="countryInput" placeholder='Country' value={countryInput} onChange={handleInputChange}/> 
                    </div>
                    <div>
                        <button>Save</button>
                    </div>
                </form>
                <div>
                <button onClick={() => {handleClick()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditProperty;