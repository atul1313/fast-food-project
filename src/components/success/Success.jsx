import React from 'react'
import '../../css/message.css'

function Success() {
  return (
    <>
      <div className="card">
        <div style={{ borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', margin: '0 auto', textAlign: "center" }}>
          <i className="checkmark">✓</i>
        </div>
        <h1 className=' success-name'>Success</h1>
        <p className='desc'>We received your purchase request;<br /> we'll be in touch shortly!</p>
      </div>
    </>
  )
}

export default Success