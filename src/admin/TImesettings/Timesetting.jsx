import React, { useEffect, useState } from 'react';
import '../../css/admin css/Timesetting.css';
import {    Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { Form, Modal, notification } from 'antd';

function Timesetting() {
    const openNotification = (type, message) => {
        notification[type]({
            message: message,
        });
    };
    const [selectedDay, setSelectedDay] = useState('');
    const [open24Hours, setOpen24Hours] = useState(false);
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());
    const [orderType, setOrderType] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [timedata, setTimedata] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleSubmit = () => {
        const formData = {
            timOrdtype: orderType,
            timDay: selectedDay,
            TimIs24Hr: open24Hours ? 1 : 0,
            timFrom: startTime.format('MM-DD-YYYY HH:mm:ss'),
            timTo: endTime.format('DD-MM-YYYY HH:mm:ss')
        };
        axios.post("https://onlinefoodordering.ca/RangerAPI/testorder/api/RestTime/AddResttime", formData)
            .then((response) => {
                if (response.status === 200) {
                    openNotification('success', 'Timing set Successfully!!');
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://onlinefoodordering.ca/RangerAPI/testorder/api/RestTime/GetResttimes');
            setTimedata(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleEdit = (item) => {
        setSelectedRow(item);
        setSelectedDay(item.timDay);
        setOrderType(item.timOrdtype);
        setOpen24Hours(item.timOpen24);
        setStartTime(dayjs(item.timFrom));
        setEndTime(dayjs(item.timTo));
        setOpenModal(true);
    };
    const handleupdate = () => {
        const requestBody = {
            timId: selectedRow.timId,
            timDay: selectedDay,
            timOrdtype: orderType,
            timFrom: startTime.format('MM-DD-YYYY HH:mm:ss'),
            timTo: endTime.format('DD-MM-YYYY HH:mm:ss')
        };
        axios.post('https://onlinefoodordering.ca/RangerAPI/testorder/api/RestTime/UpdateResttime', requestBody)
            .then(response => {
                if (response.status === 200) {
                    openNotification('success', 'Timing update Successfully!');
                    setOpenModal(false);
                    fetchData();
                }
            })
            .catch(error => {
                console.error('Error updating row data:', error);
            });
    };

    return (
        <div className='timing-outer'>
            <div className="delivery-time-title">
                Restaurant Delivery Timings
            </div>
            <div className="timing-content mx-2 p-3">
                <Grid className='mb-4'>
                    <Grid container spacing={2} alignItems={'end'}>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="days-label" style={{ color: '#5559ce' }}>
                                    Day
                                </InputLabel>
                                <Select
                                    labelId="days-label"
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    label="Day"
                                    InputLabelProps={{
                                        style: { color: '#5559CE' }
                                    }}
                                >
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={open24Hours} onChange={(e) => setOpen24Hours(e.target.checked)} />}
                                label="Open 24 hours"
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={12} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} row>
                                    <Grid item md={5} sm={6} xs={12} >
                                        <TimePicker
                                            label="From"
                                            size="small"
                                            value={startTime}
                                            onChange={(newValue) => setStartTime(newValue)}
                                        />
                                    </Grid>
                                    <Grid item md={5} sm={6} xs={12} >
                                        <TimePicker
                                            label="To"
                                            size="small"
                                            value={endTime}
                                            onChange={(newValue) => setEndTime(newValue)}
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={12} sx={{ padding: '0', }}>
                            <Grid>
                                <InputLabel>Ordertype</InputLabel>
                                <FormControlLabel
                                    control={<RadioGroup value={orderType} onChange={(e) => setOrderType(e.target.value)} row>
                                        <FormControlLabel value="TakeOut" name="orderType" control={<Radio />} label="TakeOut" />
                                        <FormControlLabel value="Delivery" name="orderType" control={<Radio />} label="Delivery" />
                                    </RadioGroup>}
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button type="submit" variant="contained" sx={{ background: '#5e35b1', color: '#ede7f6' }} onClick={handleSubmit}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Grid sx={{ height: "520px", overflow: "scroll", zIndex: '-1' }}>
                <Table sx={{ position: 'relative' }}>
                    <TableHead stickyHeader sx={{ position: 'sticky', top: '0', background: '#ede7f6' }}>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell>Order Type</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timedata.map((item) => (
                            <TableRow key={item.timId}>
                                <TableCell>{item.timDay}</TableCell>
                                <TableCell>{item.timOrdtype}</TableCell>
                                <TableCell>{item.timFrom}</TableCell>
                                <TableCell>{item.timTo}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(item)}>Update</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>

            <Modal
                title="Update Form"
                visible={openModal}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleupdate}>
                        Submit
                    </Button>,
                ]}
            >
                <Form>
                    <Grid className='mb-4'>
                        <Grid container spacing={2} alignItems={'end'}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="days-label" style={{ color: '#5559ce' }}>
                                        Day
                                    </InputLabel>
                                    <Select
                                        labelId="days-label"
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        label="Day"
                                        InputLabelProps={{
                                            style: { color: '#5559CE' }
                                        }}
                                    >
                                        <MenuItem value="Monday">Monday</MenuItem>
                                        <MenuItem value="Tuesday">Tuesday</MenuItem>
                                        <MenuItem value="Wednesday">Wednesday</MenuItem>
                                        <MenuItem value="Thursday">Thursday</MenuItem>
                                        <MenuItem value="Friday">Friday</MenuItem>
                                        <MenuItem value="Saturday">Saturday</MenuItem>
                                        <MenuItem value="Sunday">Sunday</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid>
                                    <InputLabel>Ordertype</InputLabel>
                                    <FormControlLabel
                                        control={<RadioGroup value={orderType} onChange={(e) => setOrderType(e.target.value)} row>
                                            <FormControlLabel value="TakeOut" name="orderType" control={<Radio />} label="TakeOut" />
                                            <FormControlLabel value="Delivery" name="orderType" control={<Radio />} label="Delivery" />
                                        </RadioGroup>}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid container spacing={2} row>
                                        <Grid item md={5} sm={6} xs={12} >
                                            <TimePicker
                                                label="From"
                                                size="small"
                                                value={startTime}
                                                onChange={(newValue) => setStartTime(newValue)}
                                            />
                                        </Grid>
                                        <Grid item md={5} sm={6} xs={12} >
                                            <TimePicker
                                                label="To"
                                                size="small"
                                                value={endTime}
                                                onChange={(newValue) => setEndTime(newValue)}
                                            />
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" sx={{ background: '#5e35b1', color: '#ede7f6' }} onClick={handleupdate}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            </Modal>
        </div >
    );
}

export default Timesetting;
