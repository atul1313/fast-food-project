import React, { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Select, Input, Upload, Button } from 'antd';
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';

const { Option } = Select;

function ItemDetail() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemName, setItemName] = useState('');
    const [department, setDepartment] = useState('');
    const [displayPrice, setDisplayPrice] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/todos")
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleEditClick = (row) => {
        console.log("Edit clicked for row:", row);
    };

    const handleDeleteClick = (row) => {
        console.log("Delete clicked for row:", row);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleImageUpload = (info) => {
        if (info.file.status === 'done') {
          const uploadedFile = info.file.originFileObj; 
        }
      };
      
      
    const Productadd = (values) => {
        setItemName('');
        setDepartment('');
        setDisplayPrice('');
        setItemDescription('');
        setImageFile(null);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 600 },
        {
            field: "actions",
            headerName: "Actions",
            width: 250,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className='itemDetail-outer'>
                <Form onFinish={Productadd}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={4} className="Register-input">
                            <Col xs={24} sm={6}>
                                <Form.Item name="image">
                                    <Upload
                                        name="image"
                                        listType="picture"
                                        showUploadList={false}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        beforeUpload={() => false}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            style={{
                                                borderRadius: '50%',
                                                width: '100px',
                                                height: '100px',
                                                padding: '0',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Upload 
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Col>
                        <Col xs={24} sm={20} className="Register-input">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} className="Register-input">
                                    <Form.Item name="itemName" rules={[{ required: true, message: 'Please enter item name!' }]}>
                                        <Input type="text" placeholder="Enter item name" size="large" value={itemName} onChange={e => setItemName(e.target.value)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} className="Register-input">
                                    <Form.Item name="department" rules={[{ required: true, message: 'Please select item department!' }]}>
                                        <Select defaultValue="Select Item" size='large' style={{ width: '100%' }} onChange={value => setDepartment(value)}>
                                            <Option value="PIZZA">PIZZA</Option>
                                            <Option value="CALZONE">CALZONE</Option>
                                            <Option value="PASTA">PASTA</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} className="Register-input">
                                    <Form.Item name="displayPrice" rules={[{ required: true, message: 'Please enter display price!' }]}>
                                        <Input type="text" placeholder="Enter display price" size='large' value={displayPrice} onChange={e => setDisplayPrice(e.target.value)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} className="Register-input">
                                    <Form.Item name="itemDescription" rules={[{ required: true, message: 'Please input item description!' }]}>
                                        <Input.TextArea placeholder="Enter item description" value={itemDescription}
                                            onChange={e => setItemDescription(e.target.value)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24}>
                                    <Form.Item>
                                        <div style={{ display: "flex", justifyContent: "start" }}>
                                            <Button type="primary" className='save' htmlType="submit">Save</Button>
                                            <Button className='clear' onClick={() => {
                                                setItemName('');
                                                setDepartment('');
                                                setDisplayPrice('');
                                                setItemDescription('');
                                            }}>Clear</Button>
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* Table */}
            <div className='my-2'>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item style={{ color: '#5559ce', marginBottom: 0 }}>
                            <Input
                                type="text"
                                className='search'
                                value={searchTerm}
                                placeholder='Search department name here.......'
                                onChange={handleSearchChange}
                                size='large'
                                width={'100%'}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div style={{ height: 400, width: '100%', overflow: 'scroll' }}>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    sx={{
                        "& .MuiDataGrid-root": {
                            backgroundColor: "#f9f9f9",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#ede7f6",
                            fontSize: 14,
                            color: "#262626",
                        },
                    }}
                />

            </div>
        </>
    )
}

export default ItemDetail;