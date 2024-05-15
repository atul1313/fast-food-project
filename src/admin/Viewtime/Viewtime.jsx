import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import '../../css/admin css/Admin-main.css'


function Viewtime() {
    const [timedata, settimeData] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://onlinefoodordering.ca/RangerAPI/testorder/api/RestTime/GetResttimes');
            settimeData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className='admin-outer'>
            <div className='order-outer'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell>Order Type</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timedata.map((item) => (
                            <TableRow key={item.timId}>
                                <TableCell>{item.timDay}</TableCell>
                                <TableCell>{item.timOrdtype}</TableCell>
                                <TableCell>{item.timFrom}</TableCell>
                                <TableCell>{item.timTo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Viewtime