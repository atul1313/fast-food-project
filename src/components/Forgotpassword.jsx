import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; 
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Stack, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from 'axios';

const Forgotpassword = () => {
    const navigate = useNavigate();
    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email address').required('Please enter your email address'),
        password: Yup.string().required('Please enter your new password')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.put('https://onlinefoodordering.ca/RangerAPI/testorder/api/Customer/ForgotCustomerPass', {
                email: values.email,
                password: values.password
            });
            setSubmitting(false);
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            setSubmitting(false);
        }
    };
    function myFun() {
        localStorage.setItem("login_type", "customer");
    }

    return (
        <>
            <div className="row shadow-lg m-0">
                <div className="col p-3 d-flex align-items-center ">
                    <Link to="/" onClick={myFun}><ArrowBackIcon /> Back</Link>
                </div>
            </div>
            <div>
                <div className="container-fluid ">
                    <div className="row vh-100 d-flex align-items-center justify-content-center">
                    <div className="col d-none d-lg-flex justify-content-center align-items-center ">
                        <img src="https://i.postimg.cc/L67xzcKB/undraw-Eating-together-re-ux62.png" alt="" className="img-fluid" />
                    </div>
                        <div className="col p-0 p-sm-5 d-flex justify-content-center " >
                            <div className="p-5 shadow" style={{ maxWidth: "400px", borderRadius: "15px", backgroundColor: '#fff' }}>
                                <Grid container spacing={2} alignItems="center" justifyContent="center" >
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" direction="column" justifyContent="center">
                                            <Grid item sx={{ mb: 2 }}>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography variant="h5" gutterBottom style={{ color: '#5e35b1' }}>
                                                        RANGER POS
                                                    </Typography>
                                                </Stack>
                                                <Typography gutterBottom sx={{ fontSize: '14px', textAlign: 'center' }}>
                                                    Enter a valid email to receive instructions on how to reset yout Password.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            initialValues={{ email: '', password: '' }}
                                            validationSchema={ForgotPasswordSchema}
                                            onSubmit={handleSubmit}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form>
                                                    <Field
                                                        as={TextField}
                                                        name="email"
                                                        label="Email"
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="normal"
                                                        size="small"
                                                        helperText={<ErrorMessage name="email" />}
                                                    />
                                                    <Field
                                                        as={TextField}
                                                        type="password"
                                                        name="password"
                                                        label="New Password"
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="normal"
                                                        size="small"
                                                        helperText={<ErrorMessage name="password" />}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        color="primary"
                                                        style={{ backgroundColor: '#5e35b1', color: '#fff' }}
                                                        className='login'
                                                    >
                                                        {isSubmitting ? 'Submitting' : 'Reset Password'}
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                    Allready have an account? <Link to="/login">Sign in</Link>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Forgotpassword;
