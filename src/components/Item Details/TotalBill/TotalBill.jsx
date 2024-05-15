import React, { useContext, useState } from 'react'
import '../../../css/checkout.css'
import { userContext } from '../../../context/Usercontext';
import axios from 'axios';
import Clover from './Clover';
import { Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import Paypal from '../../payment/Paypal';

function TotalBill({ totalPrice, tip, handlePercentageButtonClick, handleInputChange, setPayment, payment, clientData, data, orderType, gsttotal, pltTotal, setCheckOut, setCurrent, reqObj, setData, setIsModalOpen }) {

    const { cartData, settings, setCartData, setOrderType, setAddVerify, setBillData, setCart } = useContext(userContext)
    const [check, setCheck] = useState(false);
    const totalAmount = (parseFloat(totalPrice) + parseFloat(tip) + parseFloat(gsttotal) + parseFloat(pltTotal)).toFixed(2);
    


        
    const handlePaymentChange = (e) => {
        setPayment(e.target.value);
    };

    const orderSubmit = async (e) => {
        e.preventDefault();
        const params = {
            "clientId": clientData.clientId,
            "clientName": data.firstName + data.lastName,
            "phoneNumber": data.phone,
            "paymentType": payment,
            "taxId1": "",
            "taxId2": "",
            "taxId3": 0,
            "taxId4": 0,
            "taxId5": 0,
            "taxId6": 0,
            "totalTax1": "",
            "totalTax2": "",
            "totalTax3": 0,
            "totalTax4": 0,
            "totalTax5": 0,
            "totalTax6": 0,
            "stationId": 0,
            "subTotal": totalPrice,
            "orderTotal": totalAmount,
            "promoCode": "",
            "serviceCharge": "",
            "promoDiscount": 0,
            "serviceFee": 0,
            "bagFee": 0,
            "tip": tip,
            "OrderDetails": cartData.map(item => {
                return {
                    id: item.produtDetail.productId,
                    productId: item.produtDetail.productId,
                    productCode: item.produtDetail.productCode,
                    name: item.produtDetail.productName,
                    quantity: item.qty,
                    price: item.produtDetail.price,
                    variationsPrice: 0,
                    totalUnitPrice: item.price,
                    subTotal: item.price,
                    taxId1: item.produtDetail.taxId1,
                    taxId2: item.produtDetail.taxId2,
                    taxId3: item.produtDetail.taxId3,
                    taxId4: item.produtDetail.taxId4,
                    taxId5: item.produtDetail.taxId5,
                    taxId6: item.produtDetail.taxId6,
                    taxRate1: item.produtDetail.taxRate1,
                    taxRate2: item.produtDetail.taxRate2,
                    taxRate3: item.produtDetail.taxRate3,
                    taxRate4: item.produtDetail.taxRate4,
                    taxRate5: item.produtDetail.taxRate5,
                    taxRate6: item.produtDetail.taxRate6,
                    taxPerUnit1: item.produtDetail.taxPerUnit1,
                    taxPerUnit2: item.produtDetail.taxPerUnit2,
                    taxPerUnit3: item.produtDetail.taxPerUnit3,
                    taxPerUnit4: item.produtDetail.taxPerUnit4,
                    taxPerUnit5: item.produtDetail.taxPerUnit5,
                    taxPerUnit6: item.produtDetail.taxPerUnit6,
                    totalTax1: item.produtDetail.totalTax1,
                    totalTax2: item.produtDetail.totalTax2,
                    totalTax3: item.produtDetail.totalTax3,
                    totalTax4: item.produtDetail.totalTax4,
                    totalTax5: item.produtDetail.totalTax5,
                    totalTax6: item.produtDetail.totalTax6,
                    itemTotal: item.price,
                    status: "new"
                };
            }),
            "id": 0,
            "suitNo": data.suitno,
            "buzzerNo": data.buzzerno,
            "roomNo": data.roomno,
            "firstName": data.firstname,
            "lastName": data.lastname,
            "phoneNo": data.phone,
            "email": data.email,
            "address": clientData.address,
            "orderDesc": data.firstName,
            "date": data.date,
            "time": data.time,
            "orderType": orderType,
            "onDate": data.date,
            "onTime": data.time
        }
        axios.post(`${process.env.REACT_APP_URL}/api/OrderSubmition`, params)
            .then((response) => {
                if (response.status === 200) {
                    setCurrent(0);
                    setCheckOut(false);
                    setCartData([]);
                    setAddVerify([]);
                    setBillData([]);
                    setOrderType("");
                    setData(reqObj);
                    setIsModalOpen(true);
                    setCart(false)
                    localStorage.removeItem('cartData')
                    localStorage.removeItem('orderType')
                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 5000);

                }
            })
            .catch((error) => {
                console.log("Error submitting", error);
            })
    }

    const [showRadioOptions, setShowRadioOptions] = useState(false);


    const handleshowClick = () => {
        setCheck(true);
        setShowRadioOptions(true);
    };
    const handleButtonClick = (e) => {
        setPayment(e.target.value);
        orderSubmit(e);
    };

   

  

    return (
        <>


            <div className='total-box'>
                <div className="item">
                    <div className="title">Subtotal:</div>
                    <div className="amount">${(totalPrice).toFixed(2)}</div>
                </div>
                <div className="item">
                    <div className="title">GST:</div>
                    <div className="amount">${parseFloat(gsttotal).toFixed(2)}</div>
                </div>
                <div className="item">
                    <div className="title">PLT:</div>
                    <div className="amount">${parseFloat(pltTotal).toFixed(2)}</div>
                </div>
                <div className="item">
                    <div className="title">Tip:</div>
                    <div className="amount">${tip > 0 ? parseFloat(tip).toFixed(2) : '0.00'}</div>
                </div>
                <div className="item">
                    <div className="title">Total:</div>
                    <div className="amount">${isNaN(totalAmount) ? '0.00' : totalAmount}</div>
                </div>

                <div className="tips-outer item">
                    <div className="title">Tips:</div>
                    <div className='tips'>
                        <button value="10" onClick={handlePercentageButtonClick}>10%</button>
                        <button value="15" onClick={handlePercentageButtonClick}>15%</button>
                        <button value="20" onClick={handlePercentageButtonClick}>20%</button>
                        <input
                            className='text-start'
                            placeholder='Enter Your Tip'
                            type="number"
                            value={tip}
                            onChange={handleInputChange}
                            style={{ width: '200px' }}
                        />
                    </div>
                </div>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12} sm={12}>
                        <div className='payment'>
                            <form onSubmit={orderSubmit}>
                                <button type="submit" onClick={handleButtonClick}>PAY AT COUNTER</button>
                            </form>
                            <button value="payNow" onClick={handleshowClick}>PAY NOW</button>
                        </div>
                    </Grid>
                    {
                        showRadioOptions && (
                            <Grid item xs={12} sm={12}>
                                <RadioGroup
                                    name="payment"
                                    value={payment}
                                    onChange={handlePaymentChange}
                                    sx={{ flexDirection: 'row', justifyContent: 'center' }}
                                >
                                    <FormControlLabel value="paypal" checked={payment === 'paypal'}
                                        name="payment" control={<Radio />} label="Paypal" />
                                    <FormControlLabel value="clover" checked={payment === 'clover'}
                                        name="payment" control={<Radio />} label="Clover" />
                                </RadioGroup>
                            </Grid>
                        )
                    }


                    <Grid item xs={12}>
                        {check && payment === 'paypal' && settings.PaypalPickup === "0" && settings.PaypalDelivery === "1" && (
                            <Paypal totalAmount={totalAmount} />
                        )}
                        {check && payment === 'clover' && settings.CloverDelivery === "0" && settings.CloverPickup === "1" && (
                            <Clover totalAmount={totalAmount} setCheckOut={setCheckOut} />
                        )}
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default TotalBill;