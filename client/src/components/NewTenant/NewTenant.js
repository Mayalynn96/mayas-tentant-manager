import React, { useState } from 'react';
import './NewTenant.css';
import API from '../../utils/API';

function NewTenant({handleClickNewUnit, units, setUnits, authState, propertyId}) {
    const [honorificInput, setHonorificInput] = useState('');
    const [firstNameInput, setFirstNameInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [moveInDateInput, setMoveInDateInput] = useState('');

    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.target.id === "honorificInput") {
            setHonorificInput(e.target.value)
        } else if(e.target.id === "firstNameInput") {
            setFirstNameInput(e.target.value)
        } else if(e.target.id === "lastNameInput") {
            setLastNameInput(e.target.value)
        } else if(e.target.id === "moveInDateInput") {
            setMoveInDateInput(e.target.value)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const newUnitObject = {
            "honorific": honorificInput,
            "firstName": firstNameInput,
            "lastName": lastNameInput,
            "moveInDate": moveInDateInput
        };

        const newUnit = await API.createNewUnit(newUnitObject, authState.token);

        setUnits([...units, newUnit.data]);
        setHonorificInput('');
        setFirstNameInput('');
        setLastNameInput('');
        setMoveInDateInput('');

        handleClickNewUnit();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Add a new unit to your property</h2>
                <form onSubmit={submitForm} id='newPropertyForm'>
                    <div>
                        <input type="text" id="honorificInput" placeholder='Honorific' value={honorificInput} onChange={handleInputChange}/>
                        <input type="text" id="firstNameInput" placeholder='First Name' value={firstNameInput} onChange={handleInputChange}/>
                        <input type="text" id="lastNameInput" placeholder='Last Name' value={lastNameInput} onChange={handleInputChange}/>
                        <input typ="Date" id="moveInDateInput" placeholder='DD/MM/YYYY' value={moveInDateInput} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <button>Save</button>
                    </div>
                </form>
                <div>
                <button onClick={() => {handleClickNewUnit()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default NewTenant;