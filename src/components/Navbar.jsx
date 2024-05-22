import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/navbar.css";
import { userContext } from "../context/Usercontext";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import { Form, Input, Row, Col, Modal, notification } from 'antd';
import axios from 'axios';
import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Person2Icon from '@mui/icons-material/Person2';
import CloseIcon from '@mui/icons-material/Close';

function Navbar() {
  const { handleClick, data, fatchData } = useContext(userContext);
  const [editprofile, seteditprofile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const theme = useTheme();

  // profile dropdown
  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  // notification
  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const Editprofile = () => {
    seteditprofile(true);
  };

  const handleOk = () => {
    seteditprofile(false);
  };

  const handleCancel = () => {
    seteditprofile(false);
  };

  const navigation = useNavigate();
  const handleCatagory = (index) => {
    setSelectedItem(index);
  };

  const handleAdminLogin = (loginType) => {
    localStorage.setItem("login_type", loginType);
    navigation("/login");
  };

  useEffect(() => {
    fatchData();
  }, [fatchData]);

  const myRealdata = JSON.parse(localStorage.getItem("loginUser"));
  const mylogindata = localStorage.getItem("login_type");

  const userLogout = () => {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("cartData");
    localStorage.removeItem("orderType");
    navigation("/");
    window.location.reload();
  };

  // Customer edit API
  const customerDetails = () => {
    const data = localStorage.getItem('loginUser');
    if (data) {
      return JSON.parse(data);
    }
    return {};
  };
  const initialValues = customerDetails();

  const Oneditprofile = async (values) => {
    setLoading(true);
    try {
        const clientId = initialValues.clientId;
        const url = `${process.env.REACT_APP_URL}/api/Customer/UpdateCustomerData`;
        const response = await axios.put(url, {
            clientId,
            ...values,
        });

        if (response.status === 200) {
            openNotification('success', 'Profile updated successfully');
            const updatedUserData = {
                ...values,
                clientId,
            };
            localStorage.setItem('loginUser', JSON.stringify(updatedUserData));
            seteditprofile(false);
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response) {
            // Server responded with a status other than 200 range
            openNotification('error', `Failed to update profile: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Request details:', error.request);
            openNotification('error', 'Failed to update profile: No response from server.');
        } else {
            // Something else happened
            openNotification('error', `Failed to update profile: ${error.message}`);
        }
    } finally {
        setLoading(false);
    }
};


  const anchorRef = useRef(null);

  const readOnlyStyle = {
    backgroundColor: '#f5f5f5',
    color: '#000',
    cursor: 'default',
  };

  return (
    <>
      <div className="navbar-outer">
        <div className="nav-inner">
          <h2 className="title">RANGER POS <LoginIcon style={{ cursor: "pointer" }} onDoubleClick={() => handleAdminLogin("admin")} /></h2>
          <div className="d-flex align-items-center ">
            <div className="cart-btn">
              <button onClick={handleClick}>
                <i className="fa-brands fa-opencart"></i>
              </button>
            </div>

            {myRealdata ? (
              <>
                <div>
                  <div className="profile-details relative">
                    {myRealdata && (
                      <>
                        <Chip
                          sx={{
                            height: '52px',
                            alignItems: 'center',
                            borderRadius: '27px',
                            transition: 'all .2s ease-in-out',
                            borderColor: theme.palette.primary.light,
                            backgroundColor: '#5e35b1 !important',
                            color: "white",
                            '&[aria-controls="menu-list-grow"], &:hover': {
                              borderColor: '#5559CE !important',
                              background: '#5559CE !important',
                              color: '#ffffff !important',
                            },
                            '& .MuiChip-label': {
                              lineHeight: 0,
                            },
                          }}
                          icon={
                            <Avatar
                              style={{ width: "38px", height: "38px" }}
                              src={``}
                              ref={anchorRef}
                              aria-haspopup="true"
                              color="inherit"
                            >
                              <Person2Icon />
                            </Avatar>
                          }
                          label={
                            <Box>
                              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}>
                                <Typography style={{ fontSize: "15px", fontWeight: 600, color: "white" }}>
                                  {mylogindata === "customer"
                                    ? myRealdata.firstName
                                    : myRealdata[0] && myRealdata[0].userName}
                                </Typography>
                              </div>
                            </Box>
                          }
                          variant="outlined"
                          ref={anchorRef}
                          aria-haspopup="true"
                          onClick={toggleProfile}
                          color="primary"
                          className="chip-outer"
                        />
                        {isProfileOpen && (
                          <div className="Profie_change">
                            <Link to="/myorder">My Orders</Link>
                            <Link onClick={Editprofile} style={{ cursor: 'pointer' }}>Customer Details</Link>
                            <Link onClick={userLogout} style={{ cursor: 'pointer' }}>
                              Logout
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="login_btn">
                  <button onClick={() => handleAdminLogin("customer")}>Login</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mobile-outer">
          <ul className="mobile-nav-inner">
            {data.map(({ categoryDescription, id }, index) => (
              <li className="link" key={id}>
                <Link
                  to={"/" + categoryDescription.replace(/\//, " ") + "/" + id}
                  style={
                    selectedItem === index
                      ? {
                        background: "#ede7f6",
                        color: "#5e35b1",
                        boxShadow:
                          "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px",
                      }
                      : {}
                  }
                  className="catagory-name"
                  onClick={() => handleCatagory(categoryDescription, index)}
                >
                  {categoryDescription}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Customer Profile */}
      <Modal open={editprofile} onOk={handleOk} onCancel={handleCancel} width={600} maskClosable={false}>
        <IconButton
          aria-label="close"
          onClick={() => seteditprofile(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Form
          style={{ marginTop: "30px" }}
          name="basic"
          initialValues={initialValues}
          onFinish={Oneditprofile}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Form.Item
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name!',
                  },
                ]}
              >
                <Input
                  placeholder="First Name"
                  size="large"
                  readOnly
                  style={readOnlyStyle}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Form.Item
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name!',
                  },
                ]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Form.Item
                name="phoneNo"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your phone number!',
                  },
                ]}
              >
                <Input placeholder="Phone Number" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!',
                  },
                  {
                    type: 'email',
                    message: 'Please enter a valid email!',
                  },
                ]}
              >
                <Input placeholder="Email" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password!',
                  },
                ]}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your address!',
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter your address" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Col xs={24}>
            <div className="d-flex justify-content-center">
              <button type="submit" className="order mt-0 mx-2" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button type="button" className="mt-0 mx-2 cancle-btn" onClick={() => seteditprofile(false)}>
                Cancel
              </button>
            </div>
          </Col>
        </Form>
      </Modal>
    </>
  );
}

export default Navbar;
