import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './ExpenseStatement.css';
import API from '../../utils/API';
import Header from '../../components/Header/Header';
import BannerButtons from '../../components/BannerButtons/BannerButtons';

function ExpenseStatement({authState}){

    const {propertyId} = useParams();

    return (
        <main>
            <Header authState={authState}/>
            <BannerButtons />
            <section>
                <h3>Expense Statement</h3>
            </section>
        </main>
    )

};

export default ExpenseStatement;