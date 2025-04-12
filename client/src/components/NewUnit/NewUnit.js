import React, { useState } from 'react';
import './NewUnit.css';
import API from '../../utils/API';

function NewUnit({handleClickNewUnit, units, setUnits, authState, propertyId}) {
    const [unitNbrInput, setUnitNbrInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [floorInput, setFloorInput] = useState('');

    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.target.id === "unitNbrInput") {
            setUnitNbrInput(e.target.value)
        } else if(e.target.id === "sizeInput") {
            setSizeInput(e.target.value)
        } else if(e.target.id === "floorInput") {
            setFloorInput(e.target.value)
        } 
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const newUnitObject = {
            "unitNbr": unitNbrInput,
            "size": sizeInput,
            "floor": floorInput,
            "propertyId": propertyId
        };

        const newUnit = await API.createNewUnit(newUnitObject, authState.token);

        setUnits([...units, newUnit.data]);
        setUnitNbrInput('');
        setSizeInput('');
        setFloorInput('');

        handleClickNewUnit();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Add a new unit to your property</h2>
                <form onSubmit={submitForm} id='newPropertyForm'>
                    <div>
                        <input type="text" id="unitNbrInput" placeholder='Unit Number' value={unitNbrInput} onChange={handleInputChange}/>
                        <input type="number" id="sizeInput" placeholder='Size' value={sizeInput} onChange={handleInputChange}/>
                        <input type="text" id="floorInput" placeholder='Floor' value={floorInput} onChange={handleInputChange}/>
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

export default NewUnit;