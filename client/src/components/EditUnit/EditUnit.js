import React, { useState } from 'react';
import './EditUnit.css';
import API from '../../utils/API';

function EditUnit({handleClickEditUnit, currentUnit, units, setUnits, authState, propertyId}) {
    const [unitNbrInput, setUnitNbrInput] = useState(currentUnit.unitNbr);
    const [sizeInput, setSizeInput] = useState(currentUnit.size);
    const [floorInput, setFloorInput] = useState(currentUnit.floor);

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

        const updatedUnit = await API.updateUnit(currentUnit.id, newUnitObject, authState.token);

        //working on updating the units state
        const newUnitsArray = units.map(obj => obj.id === updatedUnit.data.id ? updatedUnit.data : obj);

        setUnits(newUnitsArray);

        handleClickEditUnit();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Update Unit</h2>
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
                <button onClick={() => {handleClickEditUnit()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditUnit;