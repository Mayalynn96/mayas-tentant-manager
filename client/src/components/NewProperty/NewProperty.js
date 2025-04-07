import React, { useState } from 'react';
import './NewProperty.css';
import API from '../../utils/API';

function NewProperty({handleClick, properties, setProperties, authState}) {
    const [addressInput, setAddressInput] = useState('');
    const [zipCodeInput, setZipCodeInput] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [countryInput, setCountryInput] = useState('');

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

        const newPropertyObject = {
            "address": addressInput,
            "zipCode": zipCodeInput,
            "city": cityInput,
            "country": countryInput
        }

        console.log(newPropertyObject)

        const newProperty = await API.createNewProperty(newPropertyObject, authState.token);

        console.log(newProperty)

        setProperties([...properties, newProperty.data]);
        setAddressInput('');
        setZipCodeInput('');
        setCityInput('');
        setCountryInput('');

        handleClick();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Add a new property</h2>
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

export default NewProperty;