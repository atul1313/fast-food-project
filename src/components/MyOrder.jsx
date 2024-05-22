import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography, IconButton, Collapse, Box } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const Row = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.orderID}
                </TableCell>
                <TableCell align="right">{row.onDate}</TableCell>
                <TableCell align="right">{row.orderType}</TableCell>
                <TableCell align="right">{row.paymentType}</TableCell>
                <TableCell align="right">{row.onTime}</TableCell>
                <TableCell align="right">{row.deliveryCharge}</TableCell>
                <TableCell align="right">{row.discount}</TableCell>
                <TableCell align="right">{row.orderTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ margin: '10px 0' }}>
                                <b style={{ fontSize: '22px' }}>Product Details</b>
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <b>No</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Product Name</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Number of Item</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Amount</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.orderDetail && row.orderDetail.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                {entry.productCode}
                                            </TableCell>
                                            <TableCell align="center">
                                                {entry.quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                                {entry.totalValue}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const MyOrder = () => {
    const isLoggedIn = localStorage.getItem('loginUser');
    const isLoggedInMyData = JSON.parse(isLoggedIn);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://onlinefoodordering.ca/RangerAPI/testorder/api/OrderSubmition/GetOrders?customerID=${isLoggedInMyData.clientId}`);
                if (response.status === 200) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row shadow-lg">
                <div className="col p-3 d-flex align-items-center ">
                    <Link to="/"><ArrowBackIcon /></Link>
                    <p className="h5 ms-4 fw-bold">My All Order</p>
                </div>
            </div>
            <div className="container mt-3">
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Order ID</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Order Type</TableCell>
                                <TableCell align="right">Payment method</TableCell>
                                <TableCell align="right">Order timings</TableCell>
                                <TableCell align="right">Delivery charges</TableCell>
                                <TableCell align="right">Discount</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <Row key={row.name} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default MyOrder;
