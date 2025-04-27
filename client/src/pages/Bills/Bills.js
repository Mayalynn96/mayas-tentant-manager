import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Bills.css';
import API from '../../utils/API';

function Bills(authState){
    const [property, setProperty] = useState({});
    const [bills, setBills] = useState([]);
    const {propertyId} = useParams();
    useEffect(() => {
        
        // get Bills if user is logged in
        const getProperty = async () => {
            if (authState.isLoggedIn) {
                const userBills = await API.getBillsByPropertyId(propertyId, authState.token)
                setProperty(userBills.property);
                setBills(userBills.bills)
                return
            }
        };

        getProperty();
    }, [authState, propertyId]);

    return (
        <div>
            <h1>Bills</h1>
        </div>
    )

};

export default Bills;