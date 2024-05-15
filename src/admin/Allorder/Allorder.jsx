import React, { useContext, useEffect, useState } from 'react'
import '../../css/admin css/Admin-main.css'
import '../../css/admin css/onlineOrder.css'
import axios from 'axios';
import { userContext } from '../../context/Usercontext';
import { Grid, TextField, Button, FormControl } from '@mui/material';

function Allorder() {
    const { cartData, taxes, billData, setCheckOut } = useContext(userContext)
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // seected row data
    const selectedRowClick = (rowData) => {
        setSelectedRow(rowData)
    }

    //selected date data

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    let gsttotal = "0.00"
    let pltTotal = "0.00"
    const totalPrice = cartData.reduce((total, item) => {
        let itemTotal = item.price || 0;
        if (Array.isArray(item.variationsPrice)) {
            itemTotal += (item.variationsPrice.reduce((sum, price) => sum + price, 0))


        }
        if (item.produtDetail.taxId1 === 1) {
            const itemtotal = item.price;
            const gstTaxRate = taxes.find((tax) => tax.id === 1)?.rate;
            if (gstTaxRate) {
                gsttotal = (Number(gsttotal) + (itemtotal * gstTaxRate) / 100).toFixed(2);

                if (parseInt(gsttotal.toString().charAt(4)) >= 5) {
                    gsttotal = (parseFloat(gsttotal)).toFixed(2);
                }
            }
        }
        if (item.produtDetail.taxId2 === 1) {
            const itemtotal = item.price;
            const plttaxtrate = taxes.find((tax) => tax.id === 2)?.rate;
            if (plttaxtrate) {
                pltTotal = (Number(pltTotal) + (itemtotal * plttaxtrate) / 100).toFixed(2);

                if (parseInt(pltTotal.toString().charAt(4)) >= 5) {
                    pltTotal = (parseFloat(pltTotal) + 0.01).toFixed(2);
                }
            }
        }
        return total + itemTotal;
    }, 0);


    // all order customer 
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/OrderSubmition/GetTodayOrders`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleSearch = () => {
        const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('en-US') : null;
        const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-US') : null;


        const apiUrl = `https://onlinefoodordering.ca/RangerAPI/testorder/api/OrderSubmition/GetSearchOrders?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`;


        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setFilteredOrders(data);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    const ordersToRender = filteredOrders.length > 0 ? filteredOrders : orders;

    return (
        <>
            <div className='admin-outer'>
                <div className='order-outer'>
                    <div className='row order-table'>
                        {/* LIST OF ORDER */}
                        <div className="col-lg-6 all-order-list">
                            <FormControl
                                sx={{
                                    m: 1,
                                    p: 0,
                                    minWidth: 120,
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#5559CE'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#5559CE'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#5559CE',
                                            borderWidth: '2px'
                                        }
                                    },
                                    size: 'small'
                                }}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={5}>

                                        <TextField
                                            label="Start Date"
                                            type="date"
                                            size='small'
                                            style={{ color: '#5559ce' }}
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            InputLabelProps={{ shrink: true, style: { color: '#5559CE' } }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <TextField
                                            label="End Date"
                                            type="date"
                                            size='small'
                                            style={{ color: '#5559ce' }}
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            InputLabelProps={{ shrink: true, style: { color: '#5559CE' } }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Button variant="contained" onClick={handleSearch} fullWidth style={{ backgroundColor: '#5e35b1' }}>
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </FormControl>
                            <div className='data-table-outer' style={{ borderRadius: "10px !importent" }}>
                                <table style={{ border: "1px solid #d5d5d5" }} cellPadding={0} cellSpacing={0} width="100%" >
                                    <thead>
                                        <tr>
                                            <th style={{ width: "100px", padding: "10px", border: "1px solid #5e35b1", cursor: 'pointer', color: "#fff", background: "#5e35b1" }}>
                                                Order
                                            </th>
                                            <th style={{ width: "110px", padding: "10px", border: "1px solid #5e35b1", cursor: 'pointer', color: "#fff", background: "#5e35b1" }}>
                                                Type
                                            </th>
                                            <th style={{ width: "180px", padding: "10px", border: "1px solid #5e35b1", cursor: 'pointer', color: "#fff", background: "#5e35b1" }}>
                                                Status
                                            </th>
                                            <th style={{ width: "125px", padding: "10px", border: "1px solid #5e35b1", cursor: 'pointer', color: "#fff", background: "#5e35b1" }}>
                                                Date
                                            </th>
                                            <th style={{ width: "100px", padding: "10px", border: "1px solid #5e35b1", color: "#fff", background: "#5e35b1" }}>Payable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersToRender.map((item) => (
                                            <tr key={item.id} onClick={() => selectedRowClick(item)} className={selectedRow === item ? 'selectedRow' : ''}>
                                                <td style={{ width: "100px", padding: "5px 10px", border: "1px solid #d5d5d5" }}>{item.orderID}</td>
                                                <td style={{ width: "110px", padding: "5px 10px", border: "1px solid #d5d5d5" }}>{item.orderType}</td>
                                                <td style={{ width: "180px", padding: "5px 10px", border: "1px solid #d5d5d5" }}>ORDER ACCEPTED</td>
                                                <td style={{ width: "125px", padding: "5px 10px", border: "1px solid #d5d5d5" }}>{item.onDate}</td>
                                                <td style={{ width: "100px", padding: "5px 10px", border: "1px solid #d5d5d5" }}>{item.subTotal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* BILL PDF */}
                        <div className="col-lg-6 print-pdf">
                            {/* <button className='print_btn'>Print</button> */}
                            {
                                selectedRow && (
                                    <div className='invoice-outer custom-scrollbar'>
                                        <div>
                                            <div className='m-auto text-center'>
                                                <p><b>RANGER POS</b></p>
                                                <p>935 5TH AVE SW</p>
                                                <p>825-735-4000</p>
                                            </div>
                                            <div className='text-center my-3'><h5>{selectedRow.orderType}</h5></div>
                                            <div className='about-company my-2'>
                                                <div className='item'>
                                                    <div>
                                                        <span>INV# : </span>{selectedRow.orderID}
                                                    </div>

                                                    <div>
                                                        <span>Date:</span> {selectedRow.onDate}
                                                    </div>
                                                    <div>
                                                        <span>Time:</span> {selectedRow.onTime}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className='about-company my-2'>
                                                <div className='item'>
                                                    <div>
                                                        <span>Station id:: </span>0
                                                    </div>

                                                    <div>
                                                        <span>Cashior</span> 0
                                                    </div>
                                                    <div>
                                                        <span>Token# : </span>{selectedRow.tokenNumber}
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className='about-user'>
                                                <div style={{ width: "60%" }} className='item'>
                                                    <div className='mb-2'>
                                                        <span>Customer:</span> {selectedRow?.customer?.firstName}
                                                        {selectedRow?.customer?.lastName}
                                                    </div>
                                                    <div className='mb-2'>
                                                        <span>Phone: </span> {selectedRow?.customer?.phoneNo}
                                                    </div>
                                                    <div className='mb-2'>
                                                        <span>Address: </span> {selectedRow?.customer?.ad}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='order-item'>
                                                <table cellPadding={0} cellSpacing={0} width="100%" className='bill-table' >
                                                    <tbody>
                                                        {
                                                            selectedRow && (
                                                                <div className='invoice-outer custom-scrollbar'>
                                                                    <div className='order-item'>
                                                                        <table width="100%" border="1">
                                                                            <thead>
                                                                                <tr className='header-name pb-0'>
                                                                                    <td className='name' style={{ width: '10%', color: '#4e35b1', fontWeight: '600', padding: '10px' }}>Sr No.</td>
                                                                                    <td colSpan="10" style={{ width: '45%', color: '#4e35b1', fontWeight: '600', padding: '10px' }} className='name'>Item Name</td>
                                                                                    <td colSpan="2" style={{ width: '25%', color: '#4e35b1', fontWeight: '600', padding: '10px' }} className='name'>Quantity</td>
                                                                                    <td className='name' style={{ width: '20%', color: '#4e35b1', fontWeight: '600', padding: '10px' }}>Price</td>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {selectedRow.orderDetail.map((item, index) => (
                                                                                    <tr className='products' key={index}>
                                                                                        <td style={{ width: '10%' }}>{index + 1}</td>
                                                                                        <td colSpan="10" style={{ width: '45%' }}>
                                                                                            <div>{item.productCode}</div>
                                                                                            {/* <div>{item.description}</div> */}
                                                                                        </td>
                                                                                        <td colSpan="2" style={{ width: '25%', textAlign: 'center' }}>{item.quantity}</td>
                                                                                        <td style={{ width: '20%', textAlign: 'center' }}>{item.subTotal.toFixed(2)}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                <div className='d-flex justify-content-between total-bill py-2'>
                                                    <div>
                                                        <div><b>Payment Mode :- </b>{selectedRow.paymentType}</div>
                                                    </div>
                                                    <div className='bill'>
                                                        <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>   <b>Sub total:</b></div>
                                                                {selectedRow.subTotal}
                                                            </div>
                                                        </div>
                                                        <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>   <b>TAX </b></div>
                                                                {selectedRow.totalTax1}.00
                                                            </div>
                                                        </div>
                                                        {/* <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>   <b>TAX </b></div>
                                                                {selectedRow.totalTax1}.00
                                                            </div>
                                                        </div> */}
                                                        <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>  <b>Tips </b>
                                                                </div>
                                                                {selectedRow.tip}
                                                            </div>
                                                        </div>
                                                        <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div>
                                                                    <b>Discount(0.00%)</b>
                                                                </div>
                                                                0
                                                            </div>
                                                        </div>
                                                        <div className='subtotal'>
                                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div><b>Total :</b></div>
                                                                {selectedRow.orderTotal}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                )
                            }



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Allorder;