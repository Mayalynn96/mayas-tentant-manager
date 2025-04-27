import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './ExpenseStatement.css';

function ExpenseStatement(){
    const { propertyId } = useParams();
    
    return (
        <div>
            <h1>Expense Statement</h1>
        </div>
    )

};

export default ExpenseStatement;