import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography, TextField, CircularProgress, FormControl } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik'; 
import axios from 'axios';
import { notification } from 'antd';


const Signup = () => {
    const openNotification = (type, message) => {
        notification[type]({
            message: message,
        });
    };
    const navigate=useNavigate();
    /* eslint-disable */
    const [loginType, setLoginType] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const mydata = localStorage.getItem('login_type');
        setLoginType(mydata);
    }, []);

    const validationSchema = yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        phoneNo: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phoneNo: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        
        onSubmit: async (values) => {
            setLoading(true);
            const url = `${process.env.REACT_APP_URL}/api/Customer`;
            axios.post(url, values)
            .then(response => {
                if (response.status === 200) {
                    openNotification('success', 'Customer Register Successfully!!');
                    localStorage.setItem('loginUser', JSON.stringify(response.data));
                    localStorage.setItem("login_type", "customer");
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Registration failed:", error);
                openNotification('error', error.response.data);

            })
            .finally(() => {
                setLoading(false);
            });
        },
    });

    return (
        <>
            <div className="row shadow-lg m-0">
                <div className="col p-3 d-flex align-items-center ">
                    <Link to="/"><ArrowBackIcon /> Back</Link>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row d-flex align-items-center justify-content-center container-inner">
                    <div className="col d-none d-lg-flex justify-content-center align-items-center ">
                        <img src="https://i.postimg.cc/L67xzcKB/undraw-Eating-together-re-ux62.png" alt="" className="img-fluid" />
                    </div>
                    <div className="col p-0 p-sm-5 d-flex justify-content-center " >
                        <div className="shadow" >
                            <Grid container spacing={2} alignItems="center" justifyContent="center"
                                style={{ maxWidth: "550px", borderRadius: "15px", backgroundColor: '#fff', padding: '20px' }} >
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" direction="column" justifyContent="center">
                                        <Grid item sx={{ mb: 2 }}>
                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                <Typography variant="h5" gutterBottom style={{ color: '#5e35b1' }}>
                                                    RANGER POS
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                gutterBottom sx={{ fontSize: '14px', textAlign: 'center' }}>
                                                Create your account
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <form onSubmit={formik.handleSubmit}>
                                    <FormControl
                                        sx={{
                                            m: 1,
                                            p: 0,
                                            minWidth: 120,
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#5e35b1'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#5e35b1'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#5e35b1',
                                                    borderWidth: '2px'
                                                }
                                            },
                                            size: 'small',
                                            margin: '0'
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    size='small'
                                                    fullWidth
                                                    id="firstName"
                                                    label="First Name"
                                                    name="firstName"
                                                    value={formik.values.firstName}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    size='small'
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    fullWidth
                                                    id="lastName"
                                                    label="Last Name"
                                                    name="lastName"
                                                    value={formik.values.lastName}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    fullWidth
                                                    size='small'
                                                    id="phoneNo"
                                                    maxWidth={10}
                                                    label="Phone Number"
                                                    name="phoneNo"
                                                    type="tel"
                                                    pattern="[0-9]{10}"
                                                    inputProps={{ maxLength: 10 }}
                                                    value={formik.values.phoneNo}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                                                    helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    fullWidth
                                                    size='small'
                                                    id="email"
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                                    helperText={formik.touched.email && formik.errors.email}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    fullWidth
                                                    size='small'
                                                    name="password"
                                                    label="Password"
                                                    type="password"
                                                    id="password"
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                                    helperText={formik.touched.password && formik.errors.password}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6} sx={{ padding: '0 10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    fullWidth
                                                    size='small'
                                                    name="confirmPassword"
                                                    label="Confirm Password"
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={formik.values.confirmPassword}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                                />
                                            </Grid>
                                        </Grid>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={(event) => setChecked(event.target.checked)}
                                                    name="checked"
                                                    color="primary"
                                                />
                                            }
                                            label="Remember me"
                                        />
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            style={{ backgroundColor: '#5e35b1', color: '#fff' }}
                                        >
                                            {loading ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                'Register'
                                            )}
                                        </Button>
                                        <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                            Already have an account? <Link to="/login">Sign in</Link>
                                        </Typography>
                                    </FormControl>
                                </form>

                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
