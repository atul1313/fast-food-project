import React, { useContext, useEffect, useRef, useState } from "react";
import { Steps, Col, Row } from "antd";
import "../css/checkout.css";
import Box from "@mui/material/Box";
import InputField from "./Input";
import TextField from "@mui/material/TextField";
import { userContext } from "../context/Usercontext";
import axios from "axios";
import TotalBill from "./Item Details/TotalBill/TotalBill";
import { DatePicker, Space, notification } from "antd";
import { Input, TimePicker, Form, Tabs } from "antd";
import AutoComplateGoogleMap from "./AutoComplateGoogleMap";
import { CircularProgress } from "@mui/material";

function CheckOut({
  totalPrice,
  gstTotal,
  pltTotal,
  setCheckOut,
  isModalOpen,
  setIsModalOpen,
}) {
  //notification
  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };
  // const [form] = Form.useForm();
  const { orderType, setOrderType, cartData } = useContext(userContext);
  const reqObj = {
    buzzerno: "",
    clientId: 0,
    date: null,
    email: "",
    firstname: "",
    id: 0,
    lastname: "",
    orderType: orderType,
    phoneNo: "",
    roomno: "",
    suitno: "",
    time: null,
  };
  const { TabPane } = Tabs;

  const steps = [
    {
      title: "Contact Info",
    },
    {
      title: "Payment",
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const [apiCalled, setApiCalled] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const formRef = useRef(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState(0);
  const [clientData, setclientData] = useState();
  const [data, setData] = useState(reqObj);
  const [payment, setPayment] = useState("");

  const isLoggedInMyData = JSON.parse(localStorage.getItem("loginUser"));

  // GET VALUE FROM INPUT
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //  TIP START
  const handlePercentageButtonClick = (e) => {
    const percentage = Number(e.target.value);
    const calculatedTip = (totalPrice * percentage) / 100;
    setTip(calculatedTip.toFixed(2));
  };

  const handleInputChange = (e) => {
    const enteredTip = e.target.value;
    if (
      !isNaN(enteredTip) ||
      enteredTip === "" ||
      /^\d*\.?\d*$/.test(enteredTip)
    ) {
      setTip(parseFloat(enteredTip));
    } else {
      setTip(0);
    }
  };

  //Guest Useer && Checkout
  const handleCustomer = () => {
    const phoneNo = isLoggedInMyData ? isLoggedInMyData.phoneNo : data.phoneNo;
    axios
      .get(
        `${process.env.REACT_APP_URL}/api/Customer/ByPhone?phoneNo=${phoneNo}`
      )
      .then((res) => {
        if (res.status === 200) {
          setCurrent(current + 1);
          setclientData(res.data);
        }
      })
      .catch((error) => {
        if (error) {
          setApiCalled(true);
          axios.post(`${process.env.REACT_APP_URL}/api/Customer`, data)
            .then((res) => {
              if (res.status === 200) {
                alert("success!");
                setCurrent(current + 1);
                setclientData(res.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  };

  useEffect(() => {
    if (
      (isLoggedInMyData && !apiCalled) ||
      (!isLoggedInMyData && data.phoneNo && !apiCalled)
    ) {
      if (!clientData) {
        handleCustomer();
      }
    }
  }, [isLoggedInMyData, data.phoneNo, orderType, clientData]);

  //Customer Registered
  const cutomerRegistred = (values) => {
    const orderTypeRegistered = localStorage.getItem("orderType");
    if (
      orderTypeRegistered === "Delivery" ||
      orderTypeRegistered === "TakeOut"
    ) {
      setLoading(true);
      if (!values.clientId) {
        values.clientId = 0;
      }
      const payload = {
        ...values,
        orderType: orderTypeRegistered,
      };
      const url = `${process.env.REACT_APP_URL}/api/Customer`;
      axios
        .post(url, payload)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("loginUser", JSON.stringify(response.data));
            localStorage.setItem("login_type", "customer");
            alert("success!");
            window.location = "/";
          }
          formRef.current.resetFields();
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            openNotification("error", "User All reddy Exit!");
          } else {
            console.error("Registration failed:", error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Customer Login
  const oncustomerLogin = async (values) => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL;
      const response = await axios.get(
        `${apiUrl}/api/Customer/ByIdPass?emailId=${values.email}&password=${values.password}`
      );
      if (response.status === 200) {
        localStorage.setItem("loginUser", JSON.stringify(response.data));
        localStorage.setItem("login_type", "customer");
        window.location = "/";
        setCheckOut(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      openNotification("error", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  //Ordertype Change
  const handleOrderTypeChange = (e) => {
    const selectedOrderType = e.target.value;
    localStorage.setItem("orderType", selectedOrderType);
    setOrderType(selectedOrderType);
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        {/*Guest Checkout && Payment */}
        {isLoggedInMyData ? (
          <Tabs.TabPane tab="Checkout" key="3">
            {/* <h4>Checkout</h4>  */}
            <Steps current={current} items={items} />
            <Form method="GET" onFinish={handleCustomer}>
              {current === 0 ? (
                orderType === "TakeOut" ? (
                  <div className="pickup">
                    <Col xs={24} sm={12} className="Register-input">
                      <Form.Item
                        name="phoneNo"
                        defaultValue={data.phoneNo}
                        rules={[
                          {
                            required: true,
                            message: "Please  enter Phone No.",
                          },
                          {
                            whitespace: true,
                            message: "Please enter Phone No.",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          maxLength={10}
                          defaultValue={data.phoneNo}
                          placeholder="Phone No *"
                          name="phoneNo"
                          onChange={handleChange}
                          style={{ height: "50px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} className="Register-input">
                      <InputField
                        {...{
                          placeHolder: "Email ",
                          name: "email",
                          require: false,
                          whitespace: false,
                          message: "Please Input Email",
                          getValue: handleChange,
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={12} className="Register-input">
                      <Form.Item
                        name="firstname"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter First Name",
                          },
                          {
                            whitespace: true,
                            message: "Pleas enter First Name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          maxLength={10}
                          placeholder="First Name *"
                          name="firstname"
                          onChange={handleChange}
                          style={{ height: "50px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} className="Register-input">
                      <InputField
                        {...{
                          placeHolder: "Last name",
                          name: "lastname",
                          require: false,
                          whitespace: false,
                          message: "Last Name",
                          getValue: handleChange,
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={12} className="Register-input">
                      <Form.Item name="date" hasFeedback>
                        <Space style={{ width: "100%" }}>
                          <DatePicker
                            name="date"
                            value={date}
                            onChange={(date) => setDate(date)}
                            style={{ height: "50px", width: "100%" }}
                          />
                        </Space>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} className="Register-input">
                      <Space style={{ width: "100%", marginBottom: "24px" }}>
                        <TimePicker
                          style={{ height: "50px", width: "100%" }}
                          use12Hours
                          value={time}
                          format="h:mm a"
                          onChange={(time, timeString) =>
                            setTime(time, timeString)
                          }
                        />
                      </Space>
                    </Col>
                  </div>
                ) : (
                  <div className="delivery">
                    <div className="input-outer">
                      <Col xs={24} sm={12} className="Register-input">
                        <InputField
                          {...{
                            placeHolder: "Suit no.",
                            name: "suitno",
                            require: false,
                            whitespace: false,
                            message: "Please enter Suit no.",
                            getValue: handleChange,
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <InputField
                          {...{
                            placeHolder: "Buzzer no.",
                            name: "buzzerno",
                            require: false,
                            whitespace: false,
                            message: "Please enter Buzzer no.",
                            getValue: handleChange,
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <InputField
                          {...{
                            placeHolder: "Room no.",
                            name: "roomno",
                            require: false,
                            whitespace: false,
                            message: "Please Input Room no.",
                            getValue: handleChange,
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <h6>Location</h6>
                        <AutoComplateGoogleMap
                          value={selectedAddress}
                          setAddress={setSelectedAddress}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <Form.Item
                          name="phoneNo"
                          rules={[
                            {
                              required: true,
                              message: "Please enter Phone No.",
                            },
                            {
                              whitespace: true,
                              message: "Please enter Phone No.",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            maxLength={10}
                            placeholder="Phone No *"
                            name="phoneNo"
                            onChange={handleChange}
                            style={{ height: "50px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <InputField
                          {...{
                            placeHolder: "Email",
                            name: "email",
                            require: false,
                            message: "Please enter Email",
                            getValue: handleChange,
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <Form.Item
                          name="firstname"
                          rules={[
                            {
                              required: true,
                              message: "Please enter First Name",
                            },
                            {
                              whitespace: true,
                              message: "Please enter First Name",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            maxLength={10}
                            placeholder="First Name *"
                            name="firstname"
                            onChange={handleChange}
                            style={{ height: "50px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <InputField
                          {...{
                            placeHolder: "Last name",
                            name: "lastname",
                            require: false,
                            message: "Last Name",
                            getValue: handleChange,
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <h6>Date</h6>
                        <Form.Item name="date" hasFeedback>
                          <Space style={{ width: "100%" }}>
                            <DatePicker
                              name="date"
                              value={date}
                              onChange={(date) => setDate(date)}
                              style={{ height: "50px", width: "100%" }}
                            />
                          </Space>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <h6>Time</h6>
                        <Space style={{ width: "100%", marginBottom: "24px" }}>
                          <TimePicker
                            style={{ height: "50px", width: "100%" }}
                            use12Hours
                            value={time}
                            format="h:mm a"
                            onChange={(time, timeString) =>
                              setTime(time, timeString)
                            }
                          />
                        </Space>
                      </Col>
                      <Col xs={24} sm={12} className="Register-input">
                        <div className="note">
                          <Box
                            sx={{
                              "& > :not(style)": { m: "8px 0", width: "100%" },
                            }}
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-multiline-static"
                              label="Note"
                              multiline
                              disabled
                              rows={4}
                              defaultValue="Approximate 60 Min. after placed your order"
                            />
                          </Box>
                        </div>
                      </Col>
                    </div>
                  </div>
                )
              ) : (
                <TotalBill
                  {...{
                    totalPrice,
                    tip,
                    handlePercentageButtonClick,
                    handleInputChange,
                    setPayment,
                    payment,
                    clientData,
                    data,
                    orderType,
                    gstTotal,
                    pltTotal,
                    setCheckOut,
                    setCurrent,
                    reqObj,
                    setData,
                    isModalOpen,
                    setIsModalOpen,
                  }}
                />
              )}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {current < steps.length - 1 && (
                  <button type="submit">Next</button>
                )}
              </div>
            </Form>
          </Tabs.TabPane>
        ) : (
          <>
            {/*Customer login */}
            <Tabs.TabPane tab="Login" key="1">
              <div className="customer-login-outer">
                <Form
                  name="login-form"
                  initialValues={{ remember: true }}
                  layout="vertical"
                  onFinish={oncustomerLogin}
                  ref={formRef}
                >
                  <Row gutter={[0, 0]}>
                    <Col xs={24} sm={24}>
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: "Please your email!" },
                          {
                            type: "email",
                            message: "Please enter a valid email address!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter your email"
                          size="large"
                          className="Register-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter your password"
                          size="large"
                          className="Register-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} className="Register-input">
                      <div className="d-flex justify-content-center">
                        <Form.Item>
                          <button
                            type="submit"
                            className="checkout_sub_btn"
                            style={{ marginRight: "10px" }}
                          >
                            {loading ? (
                              <CircularProgress color="inherit" size={25} />
                            ) : (
                              "Login"
                            )}
                          </button>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Tabs.TabPane>
            {/* New Registration */}
            <Tabs.TabPane tab="Sign Up" key="2">
              <Form onFinish={cutomerRegistred} ref={formRef}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your first name!",
                        },
                      ]}
                    >
                      <Input placeholder="First Name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your last name!",
                        },
                      ]}
                    >
                      <Input placeholder="Last Name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="phoneNo"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Phone Number"
                        size="large"
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email address!",
                        },
                      ]}
                    >
                      <Input placeholder="Email" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} className="Register-input">
                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "The two passwords that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Confirm Password"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} className="Register-input">
                    <div
                      className="d-flex justify-content-center "
                      style={{ margin: "20px 0" }}
                    >
                      <Form.Item>
                        <button
                          type="submit"
                          className="checkout_sub_btn"
                          style={{ marginRight: "10px" }}
                        >
                          {loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Register"
                          )}
                        </button>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Tabs.TabPane>
            {/* Customer Checkout && Payment */}
            <Tabs.TabPane tab="Guest User" key="3">
              <h5>Guest User</h5>
              <Steps current={current} className="flex" />
              <h6>Order Type : {orderType}</h6>

              {/* ORDER TYPE */}
              <Form method="GET" onFinish={handleCustomer}>
                {current === 0 ? (
                  orderType === "TakeOut" ? (
                    <div className="pickup">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} className="Register-input">
                          <Form.Item
                            name="phoneNo"
                            defaultValue={data.phoneNo}
                            rules={[
                              {
                                required: true,
                                message: "Please enter Phone No.",
                              },
                              {
                                whitespace: true,
                                message: "Please enter Phone No.",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input
                              maxLength={10}
                              defaultValue={data.phoneNo}
                              placeholder="Phone No *"
                              name="phoneNo"
                              onChange={handleChange}
                              style={{ height: "50px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} className="Register-input">
                          <InputField
                            {...{
                              placeHolder: "Email ",
                              name: "email",
                              require: false,
                              whitespace: false,
                              message: "Please enter Email",
                              getValue: handleChange,
                            }}
                          />
                        </Col>

                        <Col xs={24} sm={12} className="Register-input">
                          <Form.Item
                            name="firstname"
                            rules={[
                              {
                                required: true,
                                message: "Please enter First Name",
                              },
                              {
                                whitespace: true,
                                message: "Please enter First Name",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input
                              maxLength={10}
                              placeholder="First Name *"
                              name="firstname"
                              onChange={handleChange}
                              style={{ height: "50px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} className="Register-input">
                          <InputField
                            {...{
                              placeHolder: "Last name",
                              name: "lastname",
                              require: false,
                              whitespace: false,
                              message: "Last Name",
                              getValue: handleChange,
                            }}
                          />
                        </Col>

                        <Col xs={24} sm={12} className="Register-input">
                          <Form.Item name="date" hasFeedback>
                            <Space style={{ width: "100%" }}>
                              <DatePicker
                                name="date"
                                value={date}
                                onChange={(date) => setDate(date)}
                                style={{ height: "50px", width: "100%" }}
                              />
                            </Space>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} className="Register-input">
                          <Space
                            style={{ width: "100%", marginBottom: "24px" }}
                          >
                            <TimePicker
                              style={{ height: "50px", width: "100%" }}
                              use12Hours
                              value={time}
                              format="h:mm a"
                              onChange={(time, timeString) =>
                                setTime(time, timeString)
                              }
                            />
                          </Space>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div className="delivery">
                      <div className="input-outer">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} className="Register-input">
                            <InputField
                              placeHolder="Suit no."
                              name="suitno"
                              message="Please enter Suit no."
                              getValue={handleChange}
                            />
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <InputField
                              {...{
                                placeHolder: "Buzzer no.",
                                name: "buzzerno",
                                require: false,
                                message: "Please enter Buzzer no.",
                                getValue: handleChange,
                              }}
                            />
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <InputField
                              {...{
                                placeHolder: "Room no.",
                                name: "roomno",
                                require: false,
                                message: "Please enter Room no.",
                                getValue: handleChange,
                              }}
                            />
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <Form.Item
                              name="phoneNo"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter Phone No.",
                                },
                                {
                                  whitespace: true,
                                  message: "Please enter Phone No.",
                                },
                              ]}
                              hasFeedback
                            >
                              <Input
                                maxLength={10}
                                placeholder="Phone No*"
                                name="phoneNo"
                                onChange={handleChange}
                                style={{ height: "50px" }}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <div className="input">
                              <InputField
                                {...{
                                  placeHolder: "Email",
                                  name: "email",
                                  require: false,
                                  message: "Please Input Email",
                                  getValue: handleChange,
                                }}
                              />
                            </div>
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <Form.Item
                              name="firstname"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter First Name",
                                },
                                {
                                  whitespace: true,
                                  message: "Please enter First Name",
                                },
                              ]}
                              hasFeedback
                            >
                              <Input
                                maxLength={10}
                                placeholder="First Name *"
                                name="firstname"
                                onChange={handleChange}
                                style={{ height: "50px" }}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <InputField
                              {...{
                                placeHolder: "Last name",
                                name: "lastname",
                                require: false,
                                message: "Last Name",
                                getValue: handleChange,
                              }}
                            />
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <Form.Item name="date" hasFeedback>
                              <Space style={{ width: "100%" }}>
                                <DatePicker
                                  name="date"
                                  value={date}
                                  onChange={(date) => setDate(date)}
                                  style={{ height: "50px", width: "100%" }}
                                />
                              </Space>
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={12} className="Register-input">
                            <Space
                              style={{ width: "100%", marginBottom: "24px" }}
                            >
                              <TimePicker
                                style={{ height: "50px", width: "100%" }}
                                use12Hours
                                value={time}
                                format="h:mm a"
                                onChange={(time, timeString) =>
                                  setTime(time, timeString)
                                }
                              />
                            </Space>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Box
                              sx={{
                                "& > :not(style)": { m: "0 0", width: "100%" },
                              }} >

                            </Box>
                          </Col>
                          <Col xs={24} sm={24} className="Register-input">
                            <Box
                              sx={{
                                "& > :not(style)": { m: "30px 0", width: "100%" },
                              }}
                            >
                              <AutoComplateGoogleMap
                                value={selectedAddress}
                                setAddress={setSelectedAddress}
                              />
                            </Box>
                          </Col>
                          <Col xs={24} sm={24} className="Register-input">
                            <Box
                              sx={{
                                "& > :not(style)": { m: "0 0", width: "100%" },
                              }}
                              autoComplete="off"
                            >
                              <TextField
                                id="outlined-multiline-static"
                                label="Note"
                                multiline
                                disabled
                                rows={4}
                                defaultValue="Approximate 60 Min. after placed your order"
                              />
                            </Box>
                          </Col>

                        </Row>
                      </div>
                    </div>
                  )
                ) : (
                  <TotalBill
                    {...{
                      totalPrice,
                      tip,
                      handlePercentageButtonClick,
                      handleInputChange,
                      setPayment,
                      payment,
                      clientData,
                      data,
                      orderType,
                      gstTotal,
                      pltTotal,
                      setCheckOut,
                      setCurrent,
                      reqObj,
                      setData,
                      isModalOpen,
                      setIsModalOpen,
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "30px",
                  }}
                >
                  {current === 1 ? (
                    <button
                      className="checkout_sub_btn"
                      style={{ margin: "0 8px" }}
                      onClick={() => {
                        if (current > 0) {
                          setCurrent(current - 1);
                        }
                      }}
                    >
                      Back{" "}
                    </button>
                  ) : null}

                  {current < steps.length - 1 && (
                    <button type="submit" className="checkout_sub_btn">
                      Next
                    </button>
                  )}
                </div>
              </Form>
            </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </>
  );
}

export default CheckOut;
