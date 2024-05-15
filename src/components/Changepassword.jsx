import React, { useState } from 'react';
import { Form, Input, notification } from 'antd';
import login from '../assets/images/login.png';
import '../../src/css/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Changepassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };


  const onChnagePassword = (values) => {
    setLoading(true);
    const customerDetails = JSON.parse(localStorage.getItem("loginUser"));
    const Changepassword = {
      clientId: customerDetails.clientId,
      firstName: customerDetails.firstName,
      phoneNo: customerDetails.phoneNo,
      email: customerDetails.email,
      password: values.newPassword
    }
    const url = `${process.env.REACT_APP_URL}/api/Customer/ChangeCustomerPass`;
    axios.put(url, Changepassword)
      .then(response => {
        openNotification('success', 'Password changed successfully');
        navigate('/')
        setLoading(false);
        form.resetFields();
      })
      .catch(error => {
        console.error('Password change failed:', error);
        openNotification('error', 'Password change failed');
        setLoading(false);
      });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        name="password_change"
        className='login-outer'
        onFinish={onChnagePassword}
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
                  name="oldPassword"
                  label="Old Password"
                  className='password-label'
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter your old password!',
                    },
                  ]}
                  style={{ fontSize: '20px' }}
                >
                  <Input.Password style={{ padding: '8px' }} />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  className='password-label'
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter your new password!',
                    },
                  ]}
                >
                  <Input.Password style={{ padding: '8px' }} />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  className='password-label'
                  dependencies={['newPassword']}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter your Confirm password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password style={{ padding: '8px' }} />
                </Form.Item>
                <div className="d-flex">
                  <div className='btn mx-2'>
                    <button type='submit' className='login'>Chanage Password</button>
                  </div>
                  <div className='btn mx-2'>
                    <button type='clear' onClick={() => form.resetFields()} className='login'>Clear</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Form>
    </div>
  )
}

export default Changepassword
