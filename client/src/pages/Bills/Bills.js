import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Bills.css';
import API from '../../utils/API';
import Header from '../../components/Header/Header';
import BannerButtons from '../../components/BannerButtons/BannerButtons';
import NewBill from '../../components/NewBill/NewBill';
import EditBill from '../../components/EditBill/EditBill';

function Bills({ authState }) {
    const [bills, setBills] = useState([]);
    const [billToUpdate, setBillToUpdate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { propertyId } = useParams();
    const [newBillVisible, setNewBillVisible] = useState(false);
    const [editBillIsVisible, setEditBillIsVisible] = useState(false);

    //Handle display for adding new bill
    const handleClickNewBill = () => {
        setNewBillVisible(!newBillVisible);
    };

    //Handle display for Edit bill
    const handleClickEditBill = (bill) => {
        if(billToUpdate === ''){
            setBillToUpdate(bill)
        } else {
            setBillToUpdate('')
        }

        setEditBillIsVisible(!editBillIsVisible);
    };

    useEffect(() => {

        // get Bills if user is logged in
        const getBills = async () => {
            setIsLoading(true)
            if (authState.isLoggedIn) {
                const userBills = await API.getBillsByPropertyId(propertyId, authState.token)
                setBills(userBills.bills)
                setIsLoading(false)
                return
            }
            setIsLoading(false)
        };

        getBills();
    }, [authState, propertyId]);

    function AllBills() {
        const formatter = new Intl.NumberFormat('de-CH', {
            style: 'currency',
            currency: 'CHF'
        });

        if (isLoading) {
            return (
                <div>
                    <h3>Loading...</h3>
                </div>
            )

        } else if (bills.length > 0) {
            return (
                <div>
                    <div id='billsHeader'>
                        <p style={{ "fontWeight": "bold" }} className='columnABills'>Category</p>
                        <p style={{ "fontWeight": "bold" }} className='columnBBills'>SubCategory</p>
                        <p style={{ "fontWeight": "bold" }} className='columnCBills'>Company</p>
                        <p style={{ "fontWeight": "bold" }} className='columnDBills'>Date</p>
                        <p style={{ "fontWeight": "bold" }} className='columnEBills'>Amount</p>
                    </div>
                    {bills.map(bill => {
                        return(
                            <div className='eachBill' key={bill.id}>
                                <p className='columnABills'>{bill.category}</p>
                                <p className='columnBBills'>{bill.subCategory}</p>
                                <p className='columnCBills'>{bill.company}</p>
                                <p className='columnDBills'>{bill.date}</p>
                                <p className='columnEBills'>{formatter.format(bill.amount)}</p>
                                <button onClick={() => handleClickEditBill(bill)}>Edit</button> 
                                <button>Delete</button>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div>
                    <h3>No bills yet!</h3>
                </div>
            )
        }
    }

    return (
        <main>
            {editBillIsVisible && <EditBill handleClickEditBill={handleClickEditBill} bills={bills} setBills={setBills} authState={authState} propertyId={propertyId} billToEdit={billToUpdate}/>}
            {newBillVisible && <NewBill handleClickNewBill={handleClickNewBill} bills={bills} setBills={setBills} authState={authState} propertyId={propertyId}/>}
            <Header authState={authState} />
            <BannerButtons />
            <section>
                <h3>Bills</h3>
                <button onClick={handleClickNewBill}>Add Bill</button>
                <AllBills />
            </section>
        </main>
    )

};

export default Bills;