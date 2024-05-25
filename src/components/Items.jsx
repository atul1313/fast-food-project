import React, { useContext, useEffect, useState } from 'react'
import noImage from '../assets/images/NoImage.png'
import verify from '../assets/images/verify.jpg'
import '../css/item.css'
import { useParams } from 'react-router-dom'
import { Modal } from 'antd';
import ProductDetails from './Item Details/ProductDetails';
import axios from 'axios';
import { userContext } from '../context/Usercontext';
import Skeleton from 'react-loading-skeleton'
import CardSkeleton from './cardSkeleton';

function Items() {
  const { orderType, setOrderType, companynData, pdetail, setPdetail,
    productDetails, setProductDetails, setEdit, setIsLoading, pizzacalzone,
    setPizzacalzone, checkboxItem1, setCheckboxItem1, current, setCurrent,
    maxLevel, setmaxLevel, cartData } = useContext(userContext)

  const [open, setOpen] = useState(false);
  const [attention, setAttention] = useState(false);
  const [data, setData] = useState([]);

  const { id = 7, categoryDescription = "PIZZA" } = useParams();

  // FATCH DATA
  const fatchData = async () => {
    try {
      setIsLoading(true);
      const responce = await axios.get(`${process.env.REACT_APP_URL}/api/Product/ByCategoryId?categoryId=${id || 7}`);
      if (responce.status === 200) {
        setTimeout(()=>{
          setData(responce.data)
        },5000 )
        if (categoryDescription === "PIZZA") {
          setPizzacalzone(responce.data)
        }
      }
    }
    catch (err) {
      setIsLoading(true);
      if (err.isAxiosError && err.response) {
        console.log("Error response:", err.response);
      } else if (err.request) {
        console.log("Network error:", err.request);
      } else {
        console.log("Other error:", err);
      }
    }
    finally {
      setIsLoading(false);
    }
  }

  const closeModel = () => {
    setProductDetails(false);
    setCurrent(0)
  }

  const handeSelecttype = (item) => {
    setEdit(false)
    setPdetail(item)
    { orderType === "" ? setOpen(true) : setProductDetails(true) }
  }


  const handleservice = (e) => {
    setOrderType(e);
    setOpen(false);

    if (e === "") {
      setAttention(true);
    } else {
      setProductDetails(true);
      localStorage.setItem("orderType", e);
    }
  }


  const handleConfirm = () => {
    setAttention(false)
    setProductDetails(true)
  }

  useEffect(() => {
    fatchData();
  }, [id])

  return (
    <>

      <div className='items-outer'>
        <h2 className='category-name'>
          <span key="categoryDescription">{categoryDescription}</span>
        </h2>
        <div className='row'>
          {
            data.length > 0 ? (
              data.map((item, index) => (
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 com-xs-12 prod-item' key={item.productId}>
                  <div className="product-inner">
                    <div className='item' onClick={() => handeSelecttype(item, index)}>
                      <div className='about-item' style={{ padding: "10px 0" }}>
                        <div className="name">
                          <h5 style={{ fontSize: "16px" }}>{item.productName || <Skeleton circle={true} baseColor='#000' />}</h5>
                          <h6 style={{ fontSize: "12px" }}>{item.productDescription}</h6>
                        </div>
                        {
                          item.pricedesc === "" || item.pricedesc === "0" ?
                            <h6 style={{ fontSize: "13px" }}>{item.price}</h6>
                            :
                            <h6 style={{ fontSize: "13px" }}>{item.pricedesc}</h6>
                        }
                      </div>
                      <div className='image'>
                        <img src={item.image || noImage} alt={item.productName || "No image available"} />
                      </div>
                    </div>
                    <div className='verify' key={`verify-${item.productId}`}>
                      {cartData.find(cartItem => cartItem.produtDetail.productId === item.productId) ? (<img src={verify} alt="Verified" />) : ""}
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 com-xs-12'>
                    <CardSkeleton cards={8} />
                  </div>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 com-xs-12'>
                    <CardSkeleton cards={8} />
                  </div>
                </>
            )
          }
        </div>
      </div>



      {/* SERVICE MODAL */}
      <Modal open={open} onCancel={() => setOpen(false)} width={500}>
        <div className='order-type'>
          <div className='title'>Order Type :</div>
          <div className='service'>
            <button value="TakeOut" type='submit' onClick={(e) => handleservice(e.target.value)}>TAKE OUT</button>
            <button value="Delivery" type='submit' onClick={(e) => handleservice(e.target.value)}>DELIVERY</button>
          </div>
        </div>
      </Modal>


      {/* ATTENTION START */}
      <Modal open={attention} onCancel={() => { setAttention(false); setOrderType("") }} width={600}>
        <div className='Attention'>
          <div className='title'>Attention</div>
          <p>The store timing is AM.Do you still want to continue?</p>
          <div className='service'>
            <button onClick={() => { setAttention(false); setOrderType("") }}>CANCLE</button>
            <button onClick={handleConfirm}>CONFIRM</button>
          </div>
        </div>
      </Modal>


      {/* productDetails START */}
      <Modal open={productDetails} onCancel={() => { closeModel(); setCurrent(0); setCheckboxItem1([]); }} width={600} height={600}>
        <ProductDetails
          {...{
            pizzacalzone, pdetail, setProductDetails,
            categoryDescription, checkboxItem1, setCheckboxItem1,
            current, setCurrent, maxLevel, setmaxLevel
          }} />
      </Modal>
    </>
  )
}

export default Items;