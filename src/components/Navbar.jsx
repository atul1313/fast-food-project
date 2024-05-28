// Import useEffect and useState hooks
import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/navbar.css";
import { userContext } from "../context/Usercontext";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import { Input, Row, Col, Modal, notification } from 'antd';
import axios from 'axios';
import { Avatar, Box, Chip, IconButton, Typography, Stack, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Person2Icon from '@mui/icons-material/Person2';
import CloseIcon from '@mui/icons-material/Close';
import AutoCompleteGoogleMap from "./AutoComplateGoogleMap";

function Navbar() {
  const { handleClick, data, fatchData } = useContext(userContext);
  const [editProfile, setEditProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const theme = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNo: '',
    email: '',
    password: '',
    address: '',
    address1: ''
  });

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const editProfileHandler = () => {
    setEditProfile(true);
  };

  const handleOk = () => {
    setEditProfile(false);
  };

  const handleCancel = () => {
    setEditProfile(false);
  };

  const navigate = useNavigate();
  const handleCategory = (index) => {
    setSelectedItem(index);
  };

  const handleAdminLogin = (loginType) => {
    localStorage.setItem("login_type", loginType);
    navigate("/login");
  };

  useEffect(() => {
    fatchData();
  }, [fatchData]);

  // Load address data from local storage on component mount
  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: storedAddress,
      }));
    }
  }, []);

  const myRealData = JSON.parse(localStorage.getItem("loginUser"));
  const myLoginData = localStorage.getItem("login_type");

  const userLogout = () => {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("cartData");
    localStorage.removeItem("orderType");
    navigate("/");
    window.location.reload();
  };

  const customerDetails = () => {
    const data = localStorage.getItem('loginUser');
    if (data) {
      return JSON.parse(data);
    }
    return {};
  };
  const initialValues = customerDetails();

  useEffect(() => {
    if (initialValues) {
      setFormData({
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        phoneNo: initialValues.phoneNo || '',
        email: initialValues.email || '',
        password: initialValues.password || '',
        address: initialValues.address || '',
        address1: initialValues.address1 || ''
      });
    }
  }, []);

  const onEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clientId = initialValues.clientId;
      const url = `${process.env.REACT_APP_URL}/api/Customer/UpdateCustomerData`;
      const response = await axios.post(url, {
        clientId,
        ...formData,
      });

      if (response.status === 200) {
        openNotification('success', 'Profile updated successfully');
        const updatedUserData = {
          ...formData,
          clientId,
        };
        localStorage.setItem('loginUser', JSON.stringify(updatedUserData));
        setEditProfile(false);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        openNotification('error', `Failed to update profile: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        openNotification('error', 'Failed to update profile: No response from server.');
      } else {
        openNotification('error', `Failed to update profile: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (address, field) => {
    setFormData({
      ...formData,
      [field]: address.description
    });
    // Store address data in local storage
    localStorage.setItem("address", address.description);
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

            {myRealData ? (
              <>
                <div>
                  <div className="profile-details relative">
                    {myRealData && (
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
                                  {myLoginData === "customer"
                                    ? myRealData.firstName
                                    : myRealData[0] && myRealData[0].userName}
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
                            <Link onClick={editProfileHandler} style={{ cursor: 'pointer' }}>Customer Details</Link>
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
                  className="category-name"
                  onClick={() => handleCategory(index)}
                >
                  {categoryDescription}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Customer Profile */}
      <Modal className="NavbarProfile" open={editProfile} onOk={handleOk} onCancel={handleCancel} width={800} maskClosable={false}>
        <IconButton
          aria-label="close"
          onClick={() => setEditProfile(false)}
          sx={{
            position: 'absolute',
            height:'40px',
            width:'40px',
            backgroundColor:'White',
            color:'black',
            right: '-10px',
            top: '-10px',
            margin: '0',
            padding:0,
            border:'1px solid grey',
            borderRadius:'50%',
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form
        className="formNavbar"
          onSubmit={onEditProfile}
          
        >
          <Stack
            sx={{
              display: 'flex',
              background: '#5e35b1',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 20px 35px 20px',
              borderRadius: '5px',
              marginBottom: '30px',
              textAlign:'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgb(206, 210, 217)',
              ' @media(max-width:479px)': {
                padding: '20px 0px 20px 0px',
                alignItems: 'flex-end',
                flexDirection: 'column',
                rowGap: '20px',
              },
            }}
            direction="row">
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'var(--theme-font-family)',
                color: 'white',
                whiteSpace: 'nowrap',
                ' @media(max-width:479px)': { fontSize: '24px' },
              }}>
              Hey, {formData.firstName}
            </Typography>

          </Stack>
          <Row gutter={[16, 16]} style={{marginLeft:'10px',marginRight:'10px'}}>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="firstName"
                placeholder='Please enter your first name!'
                size="large"
                value={formData.firstName}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="lastName"
                placeholder='Please enter your last name!'
                size="large"
                value={formData.lastName}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}

              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="phoneNo"
                placeholder='Please enter your phone number!'
                size="large"
                value={formData.phoneNo}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}

              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="email"
                placeholder='Please enter your email!'
                size="large"
                value={formData.email}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}

              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="password"
                placeholder='Please enter your password!'
                size="large"
                value={formData.password}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="address"
                placeholder='Please enter your addess'
                size="large"
                value={formData.address}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}

              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <Input
                name="address1"
                placeholder='Please enter your another addess'
                size="large"
                value={formData.address1}
                readOnly
                style={readOnlyStyle}
                onChange={handleInputChange}

              />
            </Col>

            {/* <Col xs={24} sm={12} md={8} lg={12} xl={12} p={0} margin className="mt-[-10px] ">
              <AutoCompleteGoogleMap setAddress={(address) => handleAddressChange(address, 'address')}  value={formData.address}/>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12} xl={12}>
              <AutoCompleteGoogleMap setAddress={(address) => handleAddressChange(address, 'address1')}  value={formData.address1} />
            </Col> */}
          </Row>
          <Col xs={24}>
            <div className="d-flex mt-5 justify-content-center">
              <button type="submit" className="order mt-0 mx-2" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button type="button" className="mt-0 mx-2 cancle-btn" onClick={() => setEditProfile(false)}>
                Cancel
              </button>
            </div>
          </Col>
        </form>
      </Modal >
    </>
  );
}

export default Navbar;
