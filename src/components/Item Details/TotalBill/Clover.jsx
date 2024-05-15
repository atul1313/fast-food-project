import React, { useState } from "react";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

function Clover({ totalAmount ,setCheckOut}) {

  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: Yup.object({
      nameOnCard: Yup.string().required("Name on card is required"),
      cardNumber: Yup.string()
        .matches(/^\d{16}$/, "Invalid card number")
        .required("Card number is required"),
      expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{4}$/, "Invalid expiry date")
        .required("Expiry date is required"),
      cvv: Yup.string()
        .matches(/^\d{3}$/, "Invalid CVV")
        .required("CVV is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    const { nameOnCard, cardNumber, expiryDate, cvv } = values;
    const params = {
      nameOnCard,
      cardNumber,
      expiryDate,
      cardCVC: cvv,
      amount: totalAmount,
    };
    axios
      .post(`${process.env.REACT_APP_URL}/api/Clover`, params)
      .then(() => {
        setSuccess(true);
        setCheckOut(false);
        localStorage.removeItem("cartData");
        localStorage.removeItem('orderType')
        window.location='/'
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <form>
        <Box
          component="div"
          sx={{
            "& > :not(style)": { m: "10px 0", width: "100%" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="nameOnCard"
            label="Name on card*"
            name="nameOnCard"
            variant="outlined"
            value={formik.values.nameOnCard}
            onChange={formik.handleChange}
            error={
              formik.touched.nameOnCard && Boolean(formik.errors.nameOnCard)
            }
            helperText={formik.touched.nameOnCard && formik.errors.nameOnCard}
          />
          <TextField
            id="cardNumber"
            label="Card number*"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            variant="outlined"
            inputProps={{ maxLength: 16 }}
            value={formik.values.cardNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
            }
            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
          />
          <TextField
            id="expiryDate"
            label="Expiry date*"
            name="expiryDate"
            placeholder="MM/YYYY"
            variant="outlined"
            value={formik.values.expiryDate}
            onChange={formik.handleChange}
            error={
              formik.touched.expiryDate && Boolean(formik.errors.expiryDate)
            }
            helperText={formik.touched.expiryDate && formik.errors.expiryDate}
          />
          <TextField
            id="cvv"
            label="CVV*"
            name="cvv"
            variant="outlined"
            value={formik.values.cvv}
            inputProps={{ maxLength: 3 }}
            onChange={formik.handleChange}
            error={formik.touched.cvv && Boolean(formik.errors.cvv)}
            helperText={formik.touched.cvv && formik.errors.cvv}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: "#4e35b1" }}
          onMouseEnter={formik.handleSubmit}
        >
          PAY
        </Button>
      </form>
      {success && (
        <div className="success-alert">
          <p>Payment successful!</p>
        </div>
      )}
    </>
  );
}

export default Clover;
