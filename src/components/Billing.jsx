import React, { useContext, useEffect, useState } from 'react';
import '../css/billing.css';
import { userContext } from '../context/Usercontext';
import { Modal } from 'antd';
import CheckOut from './CheckOut';
import Edit from './update/Edit';
import Success from './success/Success';
import { IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Billing() {
    const { cart, setCart, taxes, edit, setEdit, cartData, setCartData, orderType, setOrderType, setPdetail, editData, setEditData, setQty } = useContext(userContext);
    const [checkout, setCheckOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [index, setIndex] = useState(null);
    const [totalPrice, setTotalprice] = useState(0);

    const gstRate = 0.05; // Assuming 5% GST, adjust as needed
    const pltRate = 0.10; // Assuming 10% PLT, adjust as needed



    const calculateProductPrice = (item) => {

        var itemTotal = Number(item.price) || 0;
        console.log('itemTotal billing ======> ', itemTotal)
        if (item.produtDetail && item.produtDetail.isPizza === 1) {
            if (item.produtDetail && item.produtDetail.productCode === "CREATE YOUR OWN") {
                // const basePriceMapping = [
                //     item.pSize.toppingPrice1,
                //     item.pSize.toppingPrice2,
                //     item.pSize.toppingPrice3,
                //     item.pSize.toppingPrice4,
                //     item.pSize.toppingPrice5
                // ];
                // const numberOfToppings = item.selectVariation.length;
                // const basePrice = typeof basePriceMapping[0] === 'undefined' || numberOfToppings > 4 ? 13.99 : basePriceMapping[numberOfToppings - 1];
                // // numberOfToppings > 5 ? basePriceMapping[4] : basePriceMapping[numberOfToppings - 1];
                // const extraToppingsPrice = item.selectVariation.slice(5).reduce((sum, topping) => sum + (Number(topping.pizzaModifierPrice) || 0), 0);
                // itemTotal = basePrice + extraToppingsPrice;
                // console.log('itemtotslcreateyourown',itemTotal)
            }
            else {
                return itemTotal;
            }
        }
        else {
            // console.log('Array.isArray(item.variationsPrice)', Array.isArray(item.selectVariation), '\n item.variation => ', item.selectVariation)
            if (Array.isArray(item.selectVariation)) {
                return itemTotal;
            }
        }
        console.log(itemTotal, 'itemtotal    ')
        return itemTotal;
    };

    useEffect(() => {
        const datatotalprice = cartData.reduce((total, item) => total + calculateProductPrice(item), 0);
        console.log('calculateProductPrice', datatotalprice)
        setTotalprice(datatotalprice);
        console.log('cartData', cartData);
    }, [cartData]);

    useEffect(() => {
        console.log('total-pricebilling', totalPrice);
    }, [totalPrice]);

    // const ssss = cartData.reduce((total, item) => {
    //     // console.log(total, item)
    //     return (total + calculateProductPrice(item), 0);
    // })
    const gstTotal = totalPrice * gstRate;
    const pltTotal = totalPrice * pltRate;
    const totalOrderPrice = (totalPrice + gstTotal + pltTotal).toFixed(2);



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

    const handleUpdate = (item, index) => {
        console.log(JSON.stringify(item));
        setIndex(index);
        setPdetail(item.produtDetail);
        setEditData(item);
        setEdit(true);
    };

    const handleQuantityUpdate = (newQuantity) => {
        const updatedCartData = [...cartData];
        updatedCartData[index].qty = newQuantity;
        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData));
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

    const productItems = cartData.map((item, index) => {
        // console.log('prodcutitem=>', item)
        return (
            <div className='products' key={index}>
                <div style={{ width: '57%', fontSize: "13px", padding: '10px 0' }}>
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>
                        {index + 1}. {item.produtDetail && item.produtDetail.productName}
                        <br />
                        {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 0 && item.produtDetail.isCreateYourOwn === 0 ?
                            <>
                                {item.pSize.sizeName} - ${item.pSize.sizePriceX1} <br />
                                {item.pCrust.modifierName}
                            </>
                            : null
                        }
                        {item.produtDetail.isCreateYourOwn === 1 ? `${item.pSize.sizeName} - $${item.pSize.toppingPrice1 ? item.pSize.toppingPrice1 : 13.99}` : null}
                        {item.produtDetail && item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ?
                            <>
                                {item.pSize.sizeName} - ${item.pSize.sizePriceX1} < br />
                                {item.spice}
                            </>
                            : null
                        }
                    </div>
                    {item.produtDetail.isPizza === 1 && item.produtDetail.isDeal === 1 ? <div>{item.pizzaName.productName}</div> : null}
                    {item.produtDetail.isPizza === 1 && item.produtDetail.productCode !== "CREATE YOUR OWN" ?
                        item.selectVariation && item.selectVariation.map((res, i) => {
                            return <div key={i} style={{ padding: "0 10px" }}> * {res.pizzaModifierName} -  ${res.pizzaModifierPrice ? res.pizzaModifierPrice : null}</div>
                        })
                        :
                        item.selectVariation && item.selectVariation.map((res, i) => (
                            <div key={i} style={{ padding: "0 10px" }}>
                                {res.name && (res.price !== 0 && res.price !== "" ? `${res.name} [$${res.price}]` : res.name)}
                                {(!res.name && res.pizzaModifierName) &&
                                    `* ${res.pizzaModifierName} ${res.pizzaModifierPrice === 0 || res.pizzaModifierPrice === "" ? "" : `[$${res.pizzaModifierPrice}]`}`
                                }
                            </div>


                        ))}
                    {item.note !== "" ? <div style={{ fontSize: "13px" }}>**{item.note}</div> : ""}
                </div>
                <div style={{ width: '15%', padding: '10px 0', textAlign: "center" }}>{item.qty}</div>
                <div style={{ width: '18%', padding: '10px 0', textAlign: "center" }}>
                    ${(calculateProductPrice(item)).toFixed(2)}
                </div>
                <div style={{ width: '10%' }}>
                    <button style={{ background: "#fff" }} onClick={() => handleDelete(index)}><i className="fa-solid fa-trash"></i></button>
                    <button style={{ background: "#fff" }} onClick={() => handleUpdate(item, index)}><i className="fa-regular fa-pen-to-square"></i></button>
                </div>
            </div>
        )
    });



    return (
        <>
            {/* Mobile Size Bill */}
            <div className='bill-outer'>
                <div className='bill-inner'>
                    <div className='bill-item-inner'>
                        <div className='title'>Cart</div>
                        <div className='order-type-inner '>
                            <div className='ordertype-select'>
                                <label>
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
                        {productItems}
                    </div>
                    <div className='about-order'>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>Subtotal</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${totalPrice.toFixed(2)}</div>
                        </div>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>GST</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${gstTotal.toFixed(2)}</div>
                        </div>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>PLT</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${pltTotal.toFixed(2)}</div>
                        </div>
                        <div className='subtotal'>
                            <div style={{ width: '65%' }}>Total</div>
                            <div style={{ width: '35%', overflowX: "hidden" }}>${totalOrderPrice}</div>
                        </div>
                        <div className='btn'>
                            <button disabled={cartData.length === 0 || (isLoggedInMyData && !orderType)} className="checkout" style={{ backgroundColor: '#5e35b1', margin: '0 10px', width: '120px', padding: '8px', borderRadius: 6, border: 'none', color: '#fff' }} onClick={() => setCheckOut(true)}>Place Order</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal className='user-detail order-css' open={checkout} onCancel={() => setCheckOut(false)} width={600} height={600} maskClosable={false}>
                <IconButton
                    aria-label="close"
                    onClick={() => setCheckOut(false)}
                    sx={{
                        position: 'absolute',
                        height: '40px',
                        width: '40px',
                        backgroundColor: 'white',
                        color: 'black',
                        right: '-10px',
                        top: '-10px',
                        margin: '0',
                        padding: 0,
                        border: '1px solid grey',
                        borderRadius: '50%',
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Stack
                    sx={{
                        display: 'flex',
                        background: '#5e35b1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 20px 35px 20px',
                        borderRadius: '5px',
                        marginBottom: '30px',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgb(206, 210, 217)',
                        ' @media(max-width:479px)': {
                            padding: '20px 0px 20px 0px',
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            rowGap: '20px',
                        },
                    }}
                    direction="row">
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            fontFamily: 'var(--theme-font-family)',
                            color: 'white',
                            whiteSpace: 'nowrap',
                            '@media(max-width:479px)': { fontSize: '24px', textAlign: 'left' },
                        }}>
                        Checkout
                    </Typography>
                </Stack>

                <div className='Checkout' style={{paddingRight:'20px',paddingLeft:'20px'}}>
                    <CheckOut {...{ totalPrice, gstTotal, pltTotal, setCheckOut, isModalOpen, setIsModalOpen }} />
                </div>
            </Modal>

            {/* Modal for Editing Cart Item */}
            <Modal open={edit} onCancel={() => { setEdit(false); setQty(1) }}
                title={<div>Edit Cart Item <IconButton onClick={() => setEdit(false)}><CloseIcon /></IconButton></div>}
                footer={null}
                width={800}
            >
                <Edit  {...{ editData, setEdit, index }} QuantityUpdate={handleQuantityUpdate} onClose={() => setEdit(false)} />
            </Modal>

            {/* Success Modal */}
            <Modal
                title={<div>Order Success <IconButton onClick={() => setIsModalOpen(false)}><CloseIcon /></IconButton></div>}
                open={isModalOpen}
                footer={null}
                width={800}
                onCancel={() => setIsModalOpen(false)}
            >
                <Success />
            </Modal>
        </>
    );
}

export default Billing;