import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Col, Row } from 'antd';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Department() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentName, setDepartmentName] = useState('');

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

    // Search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const DeparmentSave = () => {
        console.log('Department Name:', departmentName);
    };
    const DepartmentClear = () => {
        setDepartmentName('');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 600 },
        {
            field: "actions",
            headerName: "Actions",
            width: 250,
            renderCell: (params) => {
                return (
                    <div>
                        <IconButton onClick={() => handleEditClick(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                );
            },
        },
    ];

    // Filter data based on search term
    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='department'>
            <div className='data-table-outer custom-scrollbar' style={{ borderRadius: "10px !important" }}>
                <div className='my-3'>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <TextField
                                value={departmentName}
                                placeholder='Department Name'
                                onChange={(e) => setDepartmentName(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                            <button onClick={DeparmentSave} variant="contained"className="save" style={{ marginLeft: '10px' }}>
                                Save
                            </button>
                            <button onClick={DepartmentClear} variant="contained" className="clear" style={{ marginLeft: '10px' }}>
                                Clear
                            </button>
                        </Col>
                        <Col xs={24} sm={12}>
                            <TextField
                                value={searchTerm}
                                placeholder='Search department name here.......'
                                onChange={handleSearchChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                style={{ marginLeft: '10px', width: '100%' }}
                            />
                        </Col>
                    </Row>

                </div>

                {/* Table */}
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
            </div>
        </div>
    );
}

export default Department;
