import React, { useState } from 'react'
import '../css/admin css/Admin-main.css'
import Department from './inventory/Department';
import ItemDetail from './inventory/ItemDetail';

function Inventory() {
  const [btnValue, setBtnValue] = useState('');
  return (
    <>
      <div className='admin-outer'>
        <div className='product-navbar py-3'>
          <button
            className={`Product_btn ${btnValue === 'Department' ? 'active_btn' : ''}`}
            style={btnValue === 'Department' ? {
              color: "#ede7f6",
              background: "#5e35b1",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
            } : null}
            onClick={() => setBtnValue('Department')}
          >
            Department
          </button>
          <button
            className={`Product_btn ${btnValue === 'itemDetail' ? 'active_btn' : ''}`}
            style={btnValue === 'itemDetail' ? {
              color: "#ede7f6",
              background: "#5e35b1",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
            } : null}
            value='itemDetail'
            onClick={(e) => setBtnValue(e.target.value)}
          >
            Item Detail
          </button>
          <button
            className={`Product_btn ${btnValue === 'pizzaPrice' ? 'active_btn' : ''}`}
            value='pizzaPrice'
            style={btnValue === 'pizzaPrice' ? {
              color: "#ede7f6",
              background: "#5e35b1",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px"
            } : null}
            onClick={(e) => setBtnValue(e.target.value)}
          >
            Pizza Price
          </button>
        </div>

        {btnValue === "Department" ? (
          <Department />
        ) : null}

        {btnValue === "itemDetail" ? (
          <ItemDetail />
        ) : null}
      </div>
    </>
  )
}

export default Inventory;