import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { notification } from "antd";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Login = () => {
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState('');
    const [inputLabel, setInputLabel] = useState('Email');
    const openNotification = (type, message) => {
        notification[type]({
            message: message,
        });
    };
    const navigate = useNavigate();

    useEffect(() => {
        const mydata = localStorage.getItem('login_type');
        setLoginType(mydata);
    }, []);

    useEffect(() => {
        if (loginType === 'admin') {
            setInputLabel('Username');
        } else if (loginType === 'customer') {
            setInputLabel('Email');
        }
    }, [loginType]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object().shape({
            username: loginType === 'admin' ? Yup.string().required("Username is required") : Yup.string(),
            email: loginType === 'customer' ? Yup.string()
                .email("Please enter a valid email")
                .required("Email is required") : Yup.string(),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);

                let res;
                if (loginType === 'admin') {
                    res = await axios.get(`${process.env.REACT_APP_URL}/api/User/ValidateUser`, {
                        params: {
                            userName: values.username,
                            password: values.password
                        }

                    });
                } else if (loginType === 'customer') {
                    res = await axios.get(`${process.env.REACT_APP_URL}/api/Customer/ByIdPass`, {
                        params: {
                            emailId: values.email,
                            password: values.password
                        }
                    });
                }

                if (res && res.status === 200) {
                    openNotification('success', 'successfully Login!');
                    navigate('/onlineOrder');
                    localStorage.setItem('loginUser', JSON.stringify(res.data));
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },

    });

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
            <div className="container-fluid">
                <div className="row vh-100 d-flex align-items-center justify-content-center container-inner">
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
                                            <Typography gutterBottom sx={{ fontSize: '14px' }}>
                                                Create your account
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
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
                                        <form onSubmit={formik.handleSubmit}>
                                            <FormControl fullWidth sx={{ marginBottom: '20px' }}>
                                                {loginType === 'admin' ? (
                                                    <TextField
                                                        label={inputLabel}
                                                        id="username"
                                                        name="username"
                                                        size="small"
                                                        variant="outlined"
                                                        value={formik.values.username}
                                                        InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        fullWidth
                                                        error={formik.touched.username && Boolean(formik.errors.username)}
                                                        helperText={formik.touched.username && formik.errors.username}
                                                    />
                                                ) :
                                                    <TextField
                                                        label="Email"
                                                        id="email"
                                                        size="small"
                                                        name="email"
                                                        variant="outlined"
                                                        value={formik.values.email}
                                                        InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        fullWidth
                                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                                        helperText={formik.touched.email && formik.errors.email}
                                                    />
                                                }
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password-login"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    InputLabelProps={{ style: { color: '#5e35b1' } }}
                                                    onBlur={formik.handleBlur}
                                                    name="password"
                                                    size="small"
                                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                    aria-describedby="password-error-text"
                                                />
                                                {formik.touched.password && formik.errors.password && (
                                                    <FormHelperText id="password-error-text" error>
                                                        {formik.errors.password}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                            <Stack
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: {
                                                        xs: 'row',
                                                        md: 'row'
                                                    },
                                                    alignItems: {
                                                        xs: 'center',
                                                        md: 'center'
                                                    },
                                                    justifyContent: 'space-between',
                                                    gap: 1
                                                }}
                                            >
                                                <FormControlLabel
                                                    control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                                                    label="Remember me"
                                                />
                                                <Link to="/forgotpassword" style={{ fontSize: '14px' }}>Forgot password?</Link>
                                            </Stack>

                                            <Box mt={2}>
                                                <Button fullWidth size="large" type="submit" disabled={loading} style={{ backgroundColor: '#5e35b1', color: '#fff' }}>
                                                    {loading ? <CircularProgress color="inherit" size={25} /> : "Login"}
                                                </Button>

                                            </Box>
                                        </form>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                Don't have an account? <Link to="/register">Register</Link>
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Login;
