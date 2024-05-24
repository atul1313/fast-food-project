import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import NoImage from "../../assets/images/NoImage.png";
import Customize from './Customize';
import { Modal } from 'antd';
import axios from 'axios';
import { userContext } from '../../context/Usercontext';
import ItemData from './Item/ItemData';
import Pizza from './Item/Pizza';
import { useLocation } from 'react-router-dom';

function ProductDetails({ pizzacalzone, pdetail, setProductDetails,
    current, setCurrent, checkboxItem1, setCheckboxItem1, maxLevel, setmaxLevel }) {
    const [myFinalPrise, setMyFinalPrise] = useState('')
    const location = useLocation();
    const { setSelectedItems, cartData, setCartData,
        sizedata, size, setSize, createyourown,
        setIsLoading, selectVariation, setSelectVariation,
        crust, setCrust, pizzaName, setPizzaName, spice,
        setSpice, selectedModifiers, setSelectedModifiers, note,
        setNote, qty, setQty } = useContext(userContext);

    const [customize, setCustomize] = useState(false)
    const [databyID, setDatabyID] = useState([]);
    const [data,appdata] = useState(0);


    var price;

    useEffect(() => {
        setMyFinalPrise(selectedModifiers?.length)
    }, [selectedModifiers])

    const totalPrice = useMemo(() => {
        var totalPrice1 = 0;
        if (pdetail.isPizza === 1) {
            if (location.pathname === "/CREATE%20YOUR%20OWN/9") {
                console.log('myFinalPrise',myFinalPrise)
                totalPrice1 = myFinalPrise < 4 ? size?.[`toppingPrice${myFinalPrise}`] : size?.toppingPrice5 + crust.modifierCost;
                console.log('size',size,totalPrice1,[`toppingPrice${myFinalPrise}`])
                if (myFinalPrise >= 5) {
                    totalPrice1 += checkboxItem1.length < 6 ? 0 : checkboxItem1.slice(4).reduce((total, item) => total + item.pizzaModifierPrice, 0);
                    appdata(totalPrice1);
                }
                return Number((totalPrice1 * qty).toFixed(2));
            } else {
                return Number(((size.sizePriceX1 + crust.modifierCost + checkboxItem1.reduce((total, item) => total + item.pizzaModifierPrice, 0)) * qty).toFixed(2));
            }
        } else {
            return Number(((pdetail.price + checkboxItem1.reduce((total, item) => total + item.price, 0)) * qty).toFixed(2));
        }
    }, [pdetail.isPizza, location.pathname,myFinalPrise, size, crust, checkboxItem1, qty, appdata]);

    useEffect(() => {
        console.log(totalPrice);
    }, [totalPrice]);

    const getTopping = async () => {
        if (pdetail.isCreateYourOwn === 1) {
            try {
                setIsLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/PizzaToppingPrice?productId=${pdetail.productId}`);
                // Do something with response.data
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };
    // ADD TO CART 
    const handeAddtoCart = () => {
        setmaxLevel(0)
        const params = {
            produtDetail: pdetail,
            qty: qty,
            note: note,
            selectVariation: checkboxItem1,
            pSize: size,
            spice: spice,
            pCrust: crust,
            pizzaName: pizzaName,
            price: price
        }
        const newArray = [...cartData, params]
        localStorage.setItem('cartData', JSON.stringify(newArray))
        setCartData(newArray)
        setDatabyID([])
        setSelectedModifiers([])
        setCurrent(0)
        setCheckboxItem1([])
        setSelectVariation(null)
        setProductDetails(false)
        setNote("")
        setQty(1)
        if (location.pathname === "/CREATE%20YOUR%20OWN/9") {
            setSize(createyourown[0])
        } else {
            setSize(sizedata[0])
        }
        // setSize(sizedata[0])
        // setSize(createyourown[0])
        setSelectedItems([])
    }

    useEffect(() => {
        if (location.pathname === "/CREATE%20YOUR%20OWN/9" && createyourown) {
            // setSize(createyourown[0])
        }
    }, [() => handeAddtoCart()])

    const closeModel = () => {
        setCustomize(false)
        setSelectedModifiers([])
    }

    const getProductItem = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_URL}/api/Variation/ByProductId?productId=${pdetail.productId}`);
            if (response.status === 200) {
                setDatabyID(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [pdetail.productId]);


    useEffect(() => {
        getProductItem();
        getTopping();
    }, [pdetail.productId, current])



    return (
        <>
            <div className='product-details-outer'>
                <div className='product-detail-inner'>
                    <div className='about-product'>
                        <h3 className='pname'>{pdetail.productName}</h3>
                        {console.log('pdetail ===> ', pdetail.price)}
                        {
                            pdetail.price === "" || pdetail.price === 0 ?
                                <h6 style={{ fontSize: "13px", marginLeft: '12px' }}></h6>
                                :
                                <h6 style={{ fontSize: "13px", marginLeft: '12px' }}>${pdetail.price}</h6>
                        }

                    </div>
                    <div className='product-img'>
                        <img src={NoImage} alt="" />
                    </div>
                </div>
                {pdetail.isPizza === 1 || pdetail.isCreateYourOwn === 1 || pdetail.isDeal === 1 ?
                    <Pizza {...{
                        spice, setSpice, pizzaName, setPizzaName, pizzacalzone, pdetail, note,
                        setNote, qty, setQty, handeAddtoCart, setProductDetails, checkboxItem1, setCheckboxItem1,
                        setCustomize, size, setSize, crust, setCrust, pizzaName
                    }} />
                    :
                    <ItemData {...{
                        databyID, pdetail, qty, note, setQty, setNote, handeAddtoCart,
                        setProductDetails, current, setCurrent, checkboxItem1, setCheckboxItem1,
                        maxLevel, setmaxLevel, selectVariation, setSelectVariation
                    }} />
                }
            </div>



            {/* PIZZA */}
            {pdetail.isPizza === 1 ?
                <Modal open={customize} onCancel={() => closeModel()} width={500} height={600}>
                    <Customize {...{
                        pdetail, checkboxItem1, setCheckboxItem1,
                        setCustomize, selectedModifiers, setSelectedModifiers
                    }} />
                </Modal>
                : ""}

        </>
    )
}

export default ProductDetails;