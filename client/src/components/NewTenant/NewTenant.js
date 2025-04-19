import React, { useState } from 'react';
import './NewTenant.css';
import API from '../../utils/API';

function NewTenant({handleClickNewTenant, tenants, setTenants, authState, unitId}) {
    const [honorificInput, setHonorificInput] = useState('');
    const [firstNameInput, setFirstNameInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [nbrOfHouseholdMembersInput, setNbrOfHouseholdMembersInput] = useState('')
    const [moveInDateInput, setMoveInDateInput] = useState('');
    const [moveOutDateInput, setMoveOutDateInput] = useState('');

    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.target.id === "honorificInput") {
            setHonorificInput(e.target.value)
        } else if(e.target.id === "firstNameInput") {
            setFirstNameInput(e.target.value)
        } else if(e.target.id === "lastNameInput") {
            setLastNameInput(e.target.value)
        } else if(e.target.id === "nbrOfHouseholdMembersInput") {
            setNbrOfHouseholdMembersInput(e.target.value)
        } else if(e.target.id === "moveInDateInput") {
            setMoveInDateInput(e.target.value)
        } else if(e.target.id === "moveOutDateInput") {
            setMoveOutDateInput(e.target.value)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const moveOutDateFinal = () => {
            if(moveOutDateInput === ''){
                return null
            } else {
                return moveOutDateInput
            }
        }

        const newTenantObject = {
            "honorific": honorificInput,
            "firstName": firstNameInput,
            "lastName": lastNameInput,
            "nbrOfHouseholdMembers": nbrOfHouseholdMembersInput,
            "moveInDate": moveInDateInput,
            "moveOutDate": moveOutDateFinal(),
            "unitId": unitId
        };

        console.log(newTenantObject)
        const newTenant = await API.createNewTenant(newTenantObject, authState.token);
        console.log(newTenant)

        setTenants([...tenants, newTenant.data]);
        setHonorificInput('');
        setFirstNameInput('');
        setLastNameInput('');
        setNbrOfHouseholdMembersInput('')
        setMoveInDateInput('');
        setMoveOutDateInput('');

        handleClickNewTenant();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Add a new unit to your property</h2>
                <form onSubmit={submitForm} id='newTenantForm'>
                    <div id='newTenantFormDiv'>
                        <label htmlFor="honorificInput">Honorific:</label>
                        <input type="text" id="honorificInput" placeholder='Honorific' value={honorificInput} onChange={handleInputChange}/>
                        <label htmlFor="firstNameInput">First Name:</label>
                        <input type="text" id="firstNameInput" placeholder='First Name' value={firstNameInput} onChange={handleInputChange}/>
                        <label htmlFor="lastNameInput">Last Name:</label>
                        <input type="text" id="lastNameInput" placeholder='Last Name' value={lastNameInput} onChange={handleInputChange}/>
                        <label htmlFor="nbrOfHouseholdMembersInput">Number of Household Members:</label>
                        <input type="text" id="nbrOfHouseholdMembersInput" placeholder='Nbr of Household Mbrs' value={nbrOfHouseholdMembersInput} onChange={handleInputChange}/>
                        <label htmlFor="moveInDateInput">Move In Date:</label>
                        <input aria-label="Date" type="Date" id="moveInDateInput" value={moveInDateInput} onChange={handleInputChange}/>
                        <label htmlFor="moveOutDateInput">Move Out Date if applicable:</label>
                        <input aria-label="Date" type="Date" id="moveOutDateInput" value={moveOutDateInput} onChange={handleInputChange}/>
                    </div>
                    <div id='newTenantSaveDiv'>
                        <button>Save</button>
                    </div>
                </form>
                <div>
                <button onClick={() => {handleClickNewTenant()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default NewTenant;