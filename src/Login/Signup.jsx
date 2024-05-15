import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import login from '../assets/images/login.png';
import '../../src/css/login.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Signup = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('');

    useEffect(() => {
        const mydata = localStorage.getItem('login_type');
        setLoginType(mydata);
    }, []);

    const cutomerRegistred = (values) => {
        values.orderType = "Delivery"; 
        if (!values.clientId) {
            values.clientId = 0;
        }
        const url = `${process.env.REACT_APP_URL}/api/Customer`;
        axios.post(url, values)
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem('loginUser', JSON.stringify(response.data));
                    localStorage.setItem("login_type", "customer");
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error("Registration failed:", error);
            });
    };
    
    //Back Button
    function myFun() {
        localStorage.setItem("login_type", "customer");
    }
    return (
        <div>
            <div className="row shadow-lg">
                <div className="col p-3 d-flex align-items-center ">
                    <Link to="/" onClick={myFun}><ArrowBackIcon /> Back</Link>
                </div>
            </div>
            <Form
                onFinish={cutomerRegistred}
                className='login-outer'
>
                <div className="login-container">

                    <div className='login-inner'>
                        <div className='item food-img'>
                            <img src={login} alt="image" />
                        </div>
                        <div className='item form-outer'>
                            <div className='form-inner'>
                                <div className='login-title'>Login</div>
                                <Form.Item
                                   name="email"
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input placeholder="email" size='large' />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password placeholder="Password" size='large' />
                                </Form.Item>
                                <Link to="/login" className='my-2' style={{ textDecoration: 'underline', color: '#fff', fontSize: '14px' }}>Sign In</Link>
                                <Form.Item>
                                    <button type="primary" htmlType="submit" className='login' >
                                        Sign Up
                                    </button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>

            </Form>
        </div>
    );
};

export default Signup;