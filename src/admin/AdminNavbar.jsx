import React, { useContext, useEffect, useRef, useState } from 'react'
import { userContext } from '../context/Usercontext';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Person2Icon from '@mui/icons-material/Person2';

function AdminNavbar() {
  const { handleBar } = useContext(userContext)
  // const [isProfileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

    //admin dropdown
    // const toggleProfile = () => {
    //   setProfileOpen(!isProfileOpen);
    // };

    //get admin data
    const myRealdata = JSON.parse(localStorage.getItem("loginUser"));
    const mylogindata = localStorage.getItem("login_type");


    //admin logout
    const userLogout = () => {
      localStorage.removeItem("loginUser"); 
      localStorage.removeItem("login_type");
     window.location.reload()
    };

    const anchorRef = useRef(null);
    const theme = useTheme();

  return (
    <>
      <div className='admin-navbar-outer' >
        <div className='admin-nav-inner'>
          <button onClick={handleBar} className='btn bar'>
            <i className="fa-solid fa-bars"></i>
          </button>
          <h2 className="title">RANGER POS</h2>
          <div className="d-flex align-items-center ">
            {myRealdata ? (
              <>
                <div>
                  <div className="profile-details relative">
                    {myRealdata && (<>
                      {/* <div className="rounded-pill" style={{ border: '1px solid #5e35b1', padding: '0 7px' ,cursor:'pointer'}} onClick={toggleProfile}>
                        <div className="d-flex align-items-center pr-4">
                          <i className="far fa-user profile"></i>
                          {mylogindata === "customer"
                            ? myRealdata.firstName
                            : myRealdata[0] && myRealdata[0].userName}
                        </div>
                      </div> */}

                      <Chip
                        sx={{
                          height: '52px',
                          alignItems: 'center',
                          borderRadius: '27px',
                          transition: 'all .2s ease-in-out',
                          borderColor: theme.palette.primary.light,
                          backgroundColor: '#5559CE !important',
                          color: "white",
                          '&[aria-controls="menu-list-grow"], &:hover': {
                            borderColor: '#5559CE !important',
                            background: '#5559CE !important',
                            color: '#ffffff !important',
                          },
                          '& .MuiChip-label': {
                            lineHeight: 0
                          }
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
                        label={<Box>
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" }}>
                            <Typography style={{ fontSize: "15px", fontWeight: 600, color: "white" }}>{mylogindata === "customer"
                              ? myRealdata.firstName
                              : myRealdata[0] && myRealdata[0].userName}</Typography>
                          </div>
                        </Box>}
                        variant="outlined"
                        ref={anchorRef}
                        aria-haspopup="true"
                        // onClick={toggleProfile}
                        color="primary"
                        className="chip-outer"
                      />
                      {/* {isProfileOpen && (
                        <div className="Profie_change">
                          <Link onClick={userLogout} style={{ cursor: 'pointer' }}>
                            Logout
                          </Link>
                        </div>
                      )} */}
                    </>)}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>


      </div>
    </>
  )
}

export default AdminNavbar;