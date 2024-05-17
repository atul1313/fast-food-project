import React, { useContext, useEffect, useState } from 'react'
import '../css/billing.css'
import { userContext } from '../context/Usercontext';
import { Modal } from 'antd';
import CheckOut from './CheckOut';
import Edit from './update/Edit';
import Success from './success/Success';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


function Billing() {

    const { cart, setCart, taxes, edit, setEdit, cartData, setCartData, orderType, setOrderType, setPdetail, editData, setEditData,
        setQty } = useContext(userContext);
    const [checkout, setCheckOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [index, setIndex] = useState(null);
    let gsttotal = "0.00";
    let pltTotal = "0.00";

    const totalPrice = cartData.reduce((total, item) => {
        let itemTotal = 0;

        if (item.produtDetail && item.produtDetail.productCode === "CREATE YOUR OWN") {
            const basePriceMapping = [
                item.pSize.toppingPrice1,
                item.pSize.toppingPrice2,
                item.pSize.toppingPrice3,
                item.pSize.toppingPrice4,
                item.pSize.toppingPrice5
            ];

            const numberOfToppings = item.selectVariation.length;
            const basePrice = numberOfToppings > 5 ? basePriceMapping[4] : basePriceMapping[numberOfToppings - 1];
            const extraToppingsPrice = item.selectVariation.slice(5).reduce((acc, topping) => acc + (topping.pizzaModifierPrice || 0), 0);

            itemTotal = basePrice + extraToppingsPrice;
        } else {
            itemTotal = item.price || 0;
            if (Array.isArray(item.variationsPrice)) {
                itemTotal += item.variationsPrice.reduce((sum, price) => sum + price, 0);
            }
        }

        if (item.produtDetail.taxId1 === 1) {
            const itemtotal = item.price || 0;
            const gstTaxRate = taxes.find((tax) => tax.id === 1)?.rate;

            if (gstTaxRate) {
                const gstAmount = (itemtotal * gstTaxRate) / 100;
                gsttotal = (Number(gsttotal) + gstAmount).toFixed(2);

                if (parseInt(gsttotal.toString().charAt(4)) >= 5) {
                    gsttotal = parseFloat(gsttotal).toFixed(2);
                }
            }
        }

        if (item.produtDetail.taxId2 === 1) {
            const itemtotal = item.price || 0;
            const plttaxtrate = taxes.find((tax) => tax.id === 2)?.rate;

            if (plttaxtrate) {
                const pltAmount = (itemtotal * plttaxtrate) / 100;
                pltTotal = (Number(pltTotal) + pltAmount).toFixed(2);

                if (parseInt(pltTotal.toString().charAt(4)) >= 5) {
                    pltTotal = (parseFloat(pltTotal) + 0.01).toFixed(2);
                }
            }
        }

        return total + itemTotal;
    }, 0);



    const handleDelete = (index) => {
        const newArray = [...cartData];
        newArray.splice(index, 1);
        setCartData(newArray);
        localStorage.setItem('cartData', JSON.stringify(newArray));
        if (newArray.length === 0) {
            localStorage.removeItem('orderType');
            window.location.reload();
        }
    };

    // Update Cart
    const handleUpdate = (item, index) => {
        setIndex(index);
        setPdetail(item.produtDetail);
        setEditData(item);
        setEdit(true);
    };

    const isLoggedIn = localStorage.getItem('loginUser');
    const isLoggedInMyData = JSON.parse(isLoggedIn);

    const handleOrderTypeChange = (e) => {
        const selectedOrderType = e.target.value;
        localStorage.setItem('orderType', selectedOrderType);
        setOrderType(selectedOrderType);
    };

    useEffect(() => {
        const savedOrderType = localStorage.getItem('orderType');
        if (savedOrderType) {
            setOrderType(savedOrderType);
        }
    }, []);

    function Clearcart() {
        localStorage.removeItem('cartData');
        localStorage.removeItem('orderType');
        window.location.reload();
    }

    return (
        <>
            {/* Mobile Size Bill */}
            <div className='bill-outer'>
                <div className='bill-inner'>
                    <div className='bill-item-inner'>
                        <div className='title'>Cart</div>
                        <div className='order-type-inner '>
                            <div className='ordertype-select'>
                                <label >
                                    <input type="radio"
                                        value="TakeOut"
                                        checked={orderType === "TakeOut"}
                                        onChange={handleOrderTypeChange}
                                        disabled={cartData.length === 0} /> Take Out

                                </label>
                            </div>
                            <div className='order-type'>
                                <label>
                                    <input type="radio"
                                        value="Delivery"
                                        checked={orderType === "Delivery"}
                                        onChange={handleOrderTypeChange}
                                        disabled={cartData.length === 0} /> Delivery
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='clear' onClick={Clearcart}>Clear</button>
                    </div>
                </div>
                <div className='table'>
                    <div className='header-name'>
                        <div style={{ width: '57%' }} className='pname'>Product</div>
                        <div style={{ width: '15%', textAlign: "center" }} className='qty'>Qty</div>
                        <div style={{ width: '18%', textAlign: "center" }} className='total'>Total</div>
                        <div style={{ width: '10%' }} className='delete'></div>
                    </div>
                    <div className={cartData.length > 0 ? `table-body custom-scrollbar` : ""}>
                        {cartData.map((item, index) => (
                            <div className='products' key={index}>
                                {console.log(item)}
                                <div style={{ width: '57%', fontSize: "13px", padding: '10px 0' }}>
                                    <div style={{ fontSize: "13px", fontWeight: "500" }}>
                                        {index + 1}. {item.produtDetail && item.produtDetail.productName}
                                        <br />
                                        {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 0 ?
                                            <>
                                                {item.pSize.sizeName} - ${item.pSize.sizePriceX1} <br />
                                                {item.pCrust.modifierName}
                                            </>
                                            : null
                                        }
                                        {item.produtDetail.isCreateYourOwn === 1 ? `${item.pSize.sizeName} - $${item.pSize.toppingPrice1}` : null}
                                        {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ?
                                            <>
                                                {item.pSize.sizeName} - ${item.pSize.sizePriceX1} <br />
                                                {item.spice}
                                            </>
                                            : null}
                                    </div>
                                    {item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ? <div>{item.pizzaName.productName}</div> : null}
                                    {item.produtDetail.isPizza === 1 && item.produtDetail.productCode !== "CREATE YOUR OWN" ?
                                        item.selectVariation && item.selectVariation.map((res, i) => (
                                            <div key={i} style={{ padding: "0 10px" }}> * {res.pizzaModifierName} -  ${res.pizzaModifierPrice}</div>
                                        ))
                                        :
                                        item.selectVariation && item.selectVariation.map((res, i) => (
                                            <div key={i} style={{ padding: "0 10px" }}> * {res.pizzaModifierName} {res.pizzaModifierPrice === 0 || res.pizzaModifierPrice === "" ? "" : `[$${res.pizzaModifierPrice}]`} </div>
                                        ))}
                                    {item.note !== "" ? <div style={{ fontSize: "13px" }}>**{item.note}</div> : ""}
                                </div>
                                <div style={{ width: '15%', padding: '10px 0', textAlign: "center" }}>{item.qty}</div>
                                {/* Calculate the total price for the current item here */}
                                <div style={{ width: '18%', padding: '10px 0', textAlign: "center" }}>

                                    {cartData.reduce((acc, item) => {
                                        if (item.produtDetail && item.produtDetail.productCode === "CREATE YOUR OWN") {
                                            const basePriceMapping = [
                                                item.pSize.toppingPrice1,
                                                item.pSize.toppingPrice2,
                                                item.pSize.toppingPrice3,
                                                item.pSize.toppingPrice4,
                                                item.pSize.toppingPrice5
                                            ];

                                            const numberOfToppings = item.selectVariation.length;
                                            const basePrice = numberOfToppings > 5 ? basePriceMapping[4] : basePriceMapping[numberOfToppings - 1];
                                            const extraToppingsPrice = item.selectVariation.slice(5).reduce((acc, topping) => acc + (topping.pizzaModifierPrice || 0), 0);

                                            const finalItemPrice = basePrice + extraToppingsPrice;
                                            return acc + finalItemPrice;
                                        } else {
                                            return acc + parseFloat(item.price || 0);
                                        }
                                    }, 0).toFixed(2)}
                                </div>
                                <div style={{ width: '10%' }}>
                                    <button style={{ background: "#fff" }} onClick={() => handleDelete(index)}><i className="fa-solid fa-trash"></i></button>
                                    <button style={{ background: "#fff" }} onClick={() => handleUpdate(item, index)}><i className="fa-regular fa-pen-to-square"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className=' about-order'>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>Subtotal</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${(totalPrice).toFixed(2)}</div>
                        </div>

                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>GST </div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${gsttotal}</div>
                        </div>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>PLT </div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${pltTotal}</div>
                        </div>

                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>Total</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${(totalPrice + Number(gsttotal) + Number(pltTotal)).toFixed(2)}</div>
                        </div>
                        <button disabled={cartData.length === 0 || (isLoggedInMyData && !orderType)} className='order' onClick={() => setCheckOut(true)}>Place Order</button>
                    </div>
                </div>


                <Modal open={cart} onCancel={() => setCart(false)} width={500} height={700} maskClosable={false}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setCart(false)}
                        sx={{
                            position: 'absolute',
                            right: 1,
                            top: 1,
                            cursor: 'pointer!important',
                            color: (theme) => theme.palette.grey[600],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className='bill-inner'>
                        <h3 className='title'>Cart</h3>
                        <div className='d-flex justify-content-between  align-items-center'>
                            <div className='ordertype-select mx-2'>
                                <label onChange={(e) => setOrderType(e.target.value)}>
                                    <input type="radio" value="TakeOut" checked={orderType === "TakeOut"} /> Take Out
                                </label>
                            </div>
                            <div className='order-type mx-2'>
                                <label onChange={(e) => setOrderType(e.target.value)}>
                                    <input type="radio" value="Delivery" checked={orderType === "Delivery"} /> Delivery
                                </label>
                            </div>
                            <div>
                                <button className='clear' onClick={Clearcart}>Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className='table'>
                        <div className='header-name'>
                            <div style={{ width: '57%' }} className='pname'>Product</div>
                            <div style={{ width: '15%', textAlign: "center" }} className='qty'>Qty</div>
                            <div style={{ width: '18%', textAlign: "center" }} className='total'>Total</div>
                            <div style={{ width: '10%' }} className='delete'></div>
                        </div>
                        <div className={cartData.length > 0 ? `table-body custom-scrollbar` : ""}>
                            {cartData.map((item, index) => (
                                <div className='products' key={index}>
                                    <div style={{ width: '57%', fontSize: "13px", padding: '10px 0' }}>

                                        <div style={{ fontSize: "13px", fontWeight: "500", }}>
                                            {index + 1}. {item.produtDetail && item.produtDetail.productName}
                                            <br />
                                            {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 0 ?
                                                <>
                                                    {item.pSize.sizeName} - ${item.pSize.sizePriceX1} <br />
                                                    {item.pCrust.modifierName}
                                                </>
                                                : null
                                            }
                                            {item.produtDetail.isCreateYourOwn === 1 ? `${item.pSize.sizeName} - $${item.pSize.toppingPrice1}` : null}
                                            {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ?
                                                <>
                                                    {item.pSize.sizeName} - ${item.pSize.sizePriceX1} <br />
                                                    {item.spice}
                                                </>
                                                : null}
                                        </div>
                                        {item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ? <div>{item.pizzaName.productName}</div> : null}
                                        {item.produtDetail.isPizza === 1 ?
                                            item.selectVariation && item.selectVariation.map((res, i) => (
                                                <div key={i} style={{ padding: "0 10px" }}> * {res.pizzaModifierName} - ${res.pizzaModifierPrice}</div>
                                            ))
                                            :
                                            item.selectVariation && item.selectVariation.map((res, i) => (
                                                <div key={i} style={{ padding: "0 10px" }}> * {res.name}  {res.price === 0 || res.price === "" ? "" : `[$${res.price}]`} </div>
                                            ))}
                                        {item.note !== "" ? <div style={{ fontSize: "13px" }}>**{item.note}</div> : ""}
                                    </div>
                                    <div style={{ width: '15%', padding: '10px 0', textAlign: "center" }}>{item.qty}</div>
                                    <div style={{ width: '18%', padding: '10px 0', textAlign: "center" }}>{item.price === null ? "0.00" : (item.price).toFixed(2)}</div>
                                    <div style={{ width: '10%' }}>
                                        <button style={{ background: "#fff" }} onClick={() => handleDelete(index)}><i className="fa-solid fa-trash"></i></button>
                                        <button style={{ background: "#fff" }} onClick={() => handleUpdate(item, index)}><i className="fa-regular fa-pen-to-square"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className=' about-order'>
                            <div className='subtotal'>
                                <div className='subtotal'>
                                    <div style={{ width: '65%' }}>Total</div>
                                    <div style={{ width: '35%', overflowX: "hidden" }}>${(totalPrice + Number(gsttotal) + Number(pltTotal)).toFixed(2)}</div>
                                </div>
                            </div>
                            <div className='subtotal'>
                                <div style={{ width: '65%' }}>GST </div>
                                <div style={{ width: '35%', overflowX: "hidden" }}>${gsttotal}</div>
                            </div>
                            <div className='subtotal'>
                                <div style={{ width: '65%' }}>PLT </div>
                                <div style={{ width: '35%', overflowX: "hidden" }}>${pltTotal}</div>
                            </div>
                            <div className='subtotal'>
                                <div style={{ width: '65%' }}>Total</div>
                                <div style={{ width: '35%', overflowX: "hidden" }}>${(totalPrice + Number(gsttotal) + Number(pltTotal)).toFixed(2)}</div>
                            </div>
                            <button disabled={cartData.length === 0 || (isLoggedInMyData && !orderType)}
                                className='order' onClick={() => setCheckOut(true)}>Place Order</button>
                        </div>
                    </div>
                </Modal>

                <Modal className='user-detail' open={checkout} onCancel={() => setCheckOut(false)} width={600} height={500} maskClosable={false}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setCheckOut(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            width: '30px',
                            height: '30px',
                            top: 8,
                            color: 'grey',
                            cursor: 'pointer'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className='Checkout'>
                        <CheckOut {...{ totalPrice, gsttotal, pltTotal, setCheckOut, isModalOpen, setIsModalOpen }} />
                    </div>
                </Modal>
                {/* Edit Product */}
                <Modal open={edit} onCancel={() => { setEdit(false); setQty(1) }}>
                    <Edit {...{ editData, setEdit, index }} />
                </Modal>
                {/* Success Modal */}
                <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                    <Success />
                </Modal>
            </div>
        </>
    )
}

export default Billing;