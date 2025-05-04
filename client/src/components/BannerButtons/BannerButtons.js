import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './BannerButtons.css';

function BannerButtons(){
    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // redirect to SingUp function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    const { propertyId } = useParams();

    return (
        <div id='BannerButtons'>
            <button onClick={() => redirectTo(`property/${propertyId}`)}>Overview</button>
            <button onClick={() => redirectTo(`property/${propertyId}/bills`)}>Bills</button>
            <button onClick={() => redirectTo(`property/${propertyId}/expense-statement`)}>Generate Expense Statement</button>
        </div>
    )

};

export default BannerButtons;