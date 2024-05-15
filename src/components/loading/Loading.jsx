import React, { useContext } from 'react'
import '../../css/loading.css'
import { userContext } from '../../context/Usercontext';

function Loading() {
    const { isLoading } = useContext(userContext)
    return (
        <>
            <div className={`loading-main ${isLoading ? "" : "d-none"}`}>
                <div className='loading-outer' >
                    <div className="container">
                        <div style={{ background: "#c1b1e1" }} className="line"></div>
                        <div className="line d1" style={{ background: "#4e35b1" }}></div>
                        <div style={{ background: "#c1b1e1" }} className="line d2"></div>
                        <div className="line d3" style={{ background: "#4e35b1" }}></div>
                        <div style={{ background: "#c1b1e1" }} className="line d4"></div>
                        <div className="line d5" style={{ background: "#4e35b1" }}></div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Loading;