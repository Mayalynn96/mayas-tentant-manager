import React, { useState } from 'react';
import './EditBill.css';
import API from '../../utils/API';

function EditBill({handleClickEditBill, bills, setBills, authState, propertyId, billToEdit}) {
    const [category, setCategory] = useState(billToEdit.category);
    const [subCategory, setSubCategory] = useState(billToEdit.subCategory);
    const [company, setCompany] = useState(billToEdit.company);
    const [date, setDate] = useState(billToEdit.date)
    const [amount, setAmount] = useState(billToEdit.amount);

    const handleInputChange = (e) => {
        e.preventDefault();
        if(e.target.id === "category") {
            setCategory(e.target.value)
        } else if(e.target.id === "subCategory") {
            setSubCategory(e.target.value)
        } else if(e.target.id === "company") {
            setCompany(e.target.value)
        } else if(e.target.id === "date") {
            setDate(e.target.value)
        } else if(e.target.id === "amount") {
            setAmount(e.target.value)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const updatedBillObject = {
            "category": category,
            "subCategory": subCategory,
            "company": company,
            "date": date,
            "amount": amount,
            "propertyId": propertyId
        };

        console.log(updatedBillObject)
        const updatedBill = await API.updateBill(billToEdit.id, updatedBillObject, authState.token);
        console.log(updatedBill)

        //Updating the bills state
        const EditBillsArray = bills.map(obj => obj.id === updatedBill.data.id ? updatedBill.data : obj);

        setBills(EditBillsArray)
    

        handleClickEditBill();
    }

    return (
        <div id="newPropertyDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Edit Tenant</h2>
                <form onSubmit={submitForm} id='EditBillForm'>
                    <div id='editBillFormDiv'>
                        <label htmlFor="category">Category:</label>
                        <input type="text" id="category" placeholder='Category' value={category} onChange={handleInputChange}/>
                        <label htmlFor="subCategory">Sub-Category:</label>
                        <input type="text" id="subCategory" placeholder='Sub-Category' value={subCategory} onChange={handleInputChange}/>
                        <label htmlFor="company">Company:</label>
                        <input type="text" id="company" placeholder='Company' value={company} onChange={handleInputChange}/>
                        <label htmlFor="date">Date:</label>
                        <input type="date" id="date" value={date} onChange={handleInputChange}/>
                        <label htmlFor="amount">Amount:</label>
                        <input type="number" id="amount" placeholder="Amount" value={amount} onChange={handleInputChange}/>
                    </div>
                    <div id='editBillSaveDiv'>
                        <button>Save</button>
                    </div>
                </form>
                <div>
                <button onClick={() => {handleClickEditBill()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditBill;