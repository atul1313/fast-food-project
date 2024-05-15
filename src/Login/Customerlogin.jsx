import React, { useState } from 'react';
import loginBg from '../assets/images/login-background.jpg';
import login from '../assets/images/login.png';
import '../../src/css/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Space } from 'antd';

function Customerlogin() {
    const [messageApi, contextHolder] = message.useMessage();
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.get(`https://onlinefoodordering.ca/RangerAPI/testorder/api/Customer/ByIdPass?emailId=${emailId}&password=${password}`)
            .then((res) => {
                if (res.data && res.data[0] && res.data[0].userFirstname === "customer") {
                    navigate('/onlineOrder');
                    localStorage.setItem('login', res.data[0].userFirstname);
                } else {
                    navigate('/cutomerlogin');
                }
            })
            .catch((err) => {
                messageApi.open({
                    type: 'error',
                    content: err.response ? err.response.data : 'An error occurred',
                });
            });
    }

    return (
        <>
            {contextHolder}
            <form onSubmit={handleLogin}>
                <div className='login-bgimg'>
                    <img src={loginBg} alt="" />
                </div>

                <div className='login-outer'>
                    <div className='login-inner'>
                        <div className='item food-img'>
                            <img src={login} alt="" />
                        </div>
                        <div className='item form-outer'>
                            <div className='form-inner'>
                                <div>
                                    <h3>Login</h3>
                                    <div className='filds'>
                                        <h6>User Name</h6>
                                        <input type="text" onChange={(e) => setEmailId(e.target.value)} />
                                    </div>
                                    <div className='filds'>
                                        <h6>Password</h6>
                                        <input type="password" onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className='btn'>
                                    <button type='submit' className='login'>Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Customerlogin;
