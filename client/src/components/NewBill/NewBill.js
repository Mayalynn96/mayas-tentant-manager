import React, { useState } from 'react';
import './NewBill.css';
import API from '../../utils/API';

function NewBill({handleClickNewBill, bills, setBills, authState, propertyId}) {
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');

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

        const newBillObject = {
            "category": category,
            "subCategory": subCategory,
            "company": company,
            "date": date,
            "amount": amount,
            "propertyId": propertyId
        };

        const newBill = await API.createNewBill(newBillObject, authState.token);

        setBills([...bills, newBill.data]);
        setCategory('');
        setSubCategory('');
        setCompany('');
        setDate('');
        setAmount('');

        handleClickNewBill();
    }

    return (
        <div id="newBillDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDiv">
                <h2>Add a new Bill to your Property</h2>
                <form onSubmit={submitForm} id='newBillForm'>
                    <div>
                        <input type="text" id="category" placeholder='Category' value={category} onChange={handleInputChange}/>
                        <input type="text" id="subCategory" placeholder='Sub-Category' value={subCategory} onChange={handleInputChange}/>
                        <input type="text" id="company" placeholder='Company' value={company} onChange={handleInputChange}/>
                        <input type="date" id="date" placeholder='Date' value={date} onChange={handleInputChange}/>
                        <input type="text" id="amount" placeholder='Amount' value={amount} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <button>Save</button>
                    </div>
                </form>
                <div>
                <button onClick={() => {handleClickNewBill()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default NewBill;