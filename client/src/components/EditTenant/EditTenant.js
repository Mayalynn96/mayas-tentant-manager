import React, { useState } from 'react';
import './EditTenant.css';
import API from '../../utils/API';

function EditTenant({handleClickEditTenant, tenants, setTenants, authState, unitId, tenantToEdit}) {
    const [honorificInput, setHonorificInput] = useState(tenantToEdit.honorific);
    const [firstNameInput, setFirstNameInput] = useState(tenantToEdit.firstName);
    const [lastNameInput, setLastNameInput] = useState(tenantToEdit.lastName);
    const [nbrOfHouseholdMembersInput, setNbrOfHouseholdMembersInput] = useState(tenantToEdit.nbrOfHouseholdMembers)
    const [moveInDateInput, setMoveInDateInput] = useState(tenantToEdit.moveInDate);
    const [moveOutDateInput, setMoveOutDateInput] = useState(tenantToEdit.moveOutDate);

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

        const updatedTenantObject = {
            "honorific": honorificInput,
            "firstName": firstNameInput,
            "lastName": lastNameInput,
            "nbrOfHouseholdMembers": nbrOfHouseholdMembersInput,
            "moveInDate": moveInDateInput,
            "moveOutDate": moveOutDateFinal(),
            "unitId": unitId
        };

        console.log(updatedTenantObject)
        const updatedTenant = await API.updateTenant(tenantToEdit.id, updatedTenantObject, authState.token);
        console.log(updatedTenant)

        //Updating the tenants state
        const newTenantsArray = tenants.map(obj => obj.id === updatedTenant.data.id ? updatedTenant.data : obj);

        setTenants(newTenantsArray)
    

        handleClickEditTenant();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Edit Tenant</h2>
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
                <button onClick={() => {handleClickEditTenant()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditTenant;