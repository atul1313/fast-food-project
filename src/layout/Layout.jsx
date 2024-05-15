import React from 'react'
import { Routes, Route } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../css/main.css'
import Billing from '../components/Billing';
import Items from '../components/Items';
import AdminNavbar from '../admin/AdminNavbar';
import AdminSidebar from '../admin/AdminSidebar';
import Inventory from '../admin/Inventory';
import Success from '../components/success/Success';
import Allorder from '../admin/Allorder/Allorder';
import Timesetting from '../admin/TImesettings/Timesetting';


function Layout() {
    const role = localStorage.getItem('login_type');
    if (role == 'admin') {
        return (
            <>
                <AdminNavbar />
                <div className='main-outer'>
                    <AdminSidebar />
                    <Routes>
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/allorder" element={<Allorder />} />
                        <Route path="/timesettings" element={<Timesetting />} />
                    </Routes>
                </div>
            </>
        )

    }
    else {
        return (
            <>
                <Navbar />
                <div className='main-outer'>
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<Items />} />
                        <Route path="/item" element={<Items />} />
                        <Route path="/:categoryDescription/:id" element={<Items />} />
                        <Route path="/success" element={<Success />} />
                    </Routes>
                    <Billing />
                </div>
            </>
        )
    }

}

export default Layout;