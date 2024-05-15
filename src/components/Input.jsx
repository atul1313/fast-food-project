import React from 'react'
import TextField from '@mui/material/TextField';
import { Input, Form, Checkbox } from 'antd';



function InputField({ placeHolder, getValue, message, name, maxLength, value, require, whitespace }) {
  return (
    <>
      {/* <TextField id="outlined-basic" label={lable} name={name} variant="outlined" onChange={getValue} /> */}
      <Form.Item>
        <Input maxLength={maxLength} placeholder={placeHolder} value={value} name={name} onChange={getValue} style={{ height: "50px" }} />
      </Form.Item>
    </>
  )
}

export default InputField;