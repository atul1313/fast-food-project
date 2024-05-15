import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/Usercontext';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function AdminSidebar() {
  const { bar, setBar, fatchData } = useContext(userContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const activePath = location.pathname;
  const navigation = useNavigate();


  useEffect(() => {
    fatchData();
  }, [])


  //admin logout
  const userLogout = () => {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("login_type");
    window.location.reload()
  };

  useEffect(() => {
    navigation("/allorder")
  }, []);


  const handleItemClick = (index) => {
    setSelectedItem(index);
  };

  return (
    <>
      {/* Desktop size sidebar */}
      <div className='admin-sidebar-outer desktop-admin-sidebar admin-sidebar-outer'>
        <ul className='admin-catagory'>
          {/* Time Settings */}
          <li className='link-outer'>
            <Link
              to='/timesettings'
              className='link'
              style={activePath === '/timesettings' ? // Check if the current path is active
                {
                  background: "#ede7f6",
                  color: "#5e35b1",
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                } : {}}
            >
              <span className='ml-1 text-sm'>Time Settings</span>
            </Link>
          </li>
        
          {/* Inventory */}
          <li className='link-outer'>
            <Link
              to='/inventory'
              className='link'
              style={activePath === '/inventory' ?
                {
                  background: "#ede7f6",
                  color: "#5e35b1",
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                } : {}}
            >
              <span className='ml-1 text-sm'>Inventory</span>
            </Link>
          </li>
          {/* All Order */}
          <li className='link-outer'>
            <Link
              to='/allorder'
              className='link'
              style={activePath === '/allorder' ?
                {
                  background: "#ede7f6",
                  color: "#5e35b1",
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                } : {}}
            >
              <span className='ml-1 text-sm'>All Order</span>
            </Link>
          </li>
          {/* Logout */}
          <li>
            <div className="Logout"
              style={
                {
                  background: "#ede7f6",
                  color: "#5e35b1",
                  marginTop: '20px',
                  padding: '10px',
                  cursor: 'pointer',
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                }}>
              <Link onClick={userLogout} style={{ cursor: 'pointer' }}>
                Logout
              </Link>
            </div>
          </li>
        </ul>
      </div>

      {/* Mobile scrren sidebar */}
      <div className='mobile'>
        <div className='admin-sidebar-outer' style={bar}>
          <ul className='admin-catagory'>

            {/* time settings */}
            <li className='link-outer'>
              <Link
                to='/timesettings'
                onClick={() => { handleItemClick(0); setBar({ display: "none" }); }}
                className='link'
                style={selectedItem === 0 ?
                  {
                    background: "#ede7f6",
                    color: "#5e35b1",
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                  } : {}}
              >
                <span className='ml-1 text-sm'>Time Settings</span>
              </Link>
            </li>

            {/* Inventory */}
            <li className='link-outer'>
              <Link
                to='/inventory'
                onClick={() => { handleItemClick(1); setBar({ display: "none" }); }}
                className='link'
                style={selectedItem === 1 ?
                  {
                    background: "#ede7f6",
                    color: "#5e35b1",
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                  } : {}}
              >
                <span className='ml-1 text-sm'>Inventory</span>
              </Link>
            </li>

            {/* ALl Order */}
            <li className='link-outer'>
              <Link
                to='/allorder'
                onClick={() => { handleItemClick(2); setBar({ display: "none" }); }}
                className='link'
                style={selectedItem === 2 ?
                  {
                    background: "#ede7f6",
                    color: "#5e35b1",
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                  } : {}}
              >
                <span className='ml-1 text-sm'>All Order</span>
              </Link>
            </li>

            {/* Logoout */}
            <li>
              <div className="Logout"
                style={
                  {
                    background: "#ede7f6",
                    color: "#5e35b1",
                    marginTop: '20px',
                    width:'100%',
                    padding: '10px',
                    cursor: 'pointer',
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
                  }}>
                <Link onClick={userLogout} sx={{display:'block',width:'100%'}}>
                  Logout
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar;