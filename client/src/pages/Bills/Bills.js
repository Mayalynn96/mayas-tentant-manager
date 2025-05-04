import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Bills.css';
import API from '../../utils/API';
import Header from '../../components/Header/Header';
import BannerButtons from '../../components/BannerButtons/BannerButtons';

function Bills({ authState }) {
    const [bills, setBills] = useState([]);
    const { propertyId } = useParams();
    useEffect(() => {

        // get Bills if user is logged in
        const getBills = async () => {
            if (authState.isLoggedIn) {
                const userBills = await API.getBillsByPropertyId(propertyId, authState.token)
                setBills(userBills.bills)
                return
            }
        };

        getBills();
    }, [authState, propertyId]);

    function AllBills() {
        console.log(bills.length)
        if (bills.length > 0) {
            return (
                <div>
                    <div>
                        <p style={{ "fontWeight": "bold" }} className='columnA'>Category</p>
                        <p style={{ "fontWeight": "bold" }} className='columnB'>SubCategory</p>
                        <p style={{ "fontWeight": "bold" }} className='columnC'>Company</p>
                        <p style={{ "fontWeight": "bold" }} className='columnD'>Date</p>
                        <p style={{ "fontWeight": "bold" }} className='columnE'>Amount</p>
                    </div>
                </div>
            )
        }
    }

    return (
        <main>
            <Header authState={authState} />
            <BannerButtons />
            <section>
                <h3>Bills</h3>
                <AllBills />
            </section>
        </main>
    )

};

export default Bills;