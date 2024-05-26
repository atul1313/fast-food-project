import React, { useContext, useEffect, useState } from 'react';
import NoImage from '../../assets/images/NoImage.png';
import Loading from '../loading/Loading';
import EditItem from './EditItem';
import { Modal } from 'antd';
import EditCustomize from './EditCustomize';
import { userContext } from '../../context/Usercontext';
import axios from 'axios';
import EditPizza from './EditPizza';
import { useLocation } from 'react-router-dom';

function Edit({ editData, setEdit, index }) {
    const { checkboxItem1, setCheckboxItem1, current, setCurrent, maxLevel, setmaxLevel, qty, size, crust, spice, pizzaName,
        setCartData, cartData, setSelectVariation, setSize, setNote, note, setQty, setSelectedItems,
        setIsLoading, pdetail, selectedModifiers
    } = useContext(userContext);

    const location = useLocation();
    const [editCustomize, setEditCustomize] = useState(false);
    const [databyID, setDatabyID] = useState([]);
    const [editModify, setEditModify] = useState([]);
    const [myFinalPrise, setMyFinalPrise] = useState('');

    let price;

    useEffect(() => {
        // Initialize checkboxItem1 with selectVariation from editData
        if (editData && editData.selectVariation) {
            setCheckboxItem1(editData.selectVariation);
        }
        setMyFinalPrise(editData?.selectVariation?.length);
    }, [editData, setCheckboxItem1, selectedModifiers]);

    if (pdetail.isPizza === 1) {
        if (location.pathname === "/CREATE%20YOUR%20OWN/9") {
            var totalPrice = selectedModifiers ? size.toppingPrice1 : (size.toppingPrice5 + crust.modifierCost);
            if (selectedModifiers) {
                totalPrice += checkboxItem1.reduce((total, item) => total + item.pizzaModifierPrice, 0);
            }
            price = Number((totalPrice * qty).toFixed(2));
        } else {
            price = Number(((size.sizePriceX1 + crust.modifierCost + checkboxItem1.reduce((total, item) => total + item.pizzaModifierPrice, 0)) * qty).toFixed(2));
        }

    } else {
        price = Number(((pdetail.price + checkboxItem1.reduce((total, item) => total + item.price, 0)) * qty).toFixed(2));
    }

    const handeAddtoCart = () => {
        setmaxLevel(0);
        const params = {
            produtDetail: editData.produtDetail,
            qty: qty,
            note: note,
            selectVariation: checkboxItem1,
            pSize: size,
            spice: spice,
            pCrust: crust,
            pizzaName: pizzaName,
            price: price
        };

        const updateArray = [...cartData];
        updateArray[index] = params;
        setCartData(updateArray);
        localStorage.setItem('cartData', JSON.stringify(updateArray));

        setCurrent(0);
        setSelectVariation(null);
        setEdit(false);
        setNote("");
        setQty(1);
        setSize(editData.pSize);
        setSelectedItems([]);
        setCheckboxItem1([]);
    };

    const getTopping = async () => {
        if (pdetail.isCreateYourOwn === 1) {
            try {
                setIsLoading(true);
                await axios.get(`${process.env.REACT_APP_URL}/api/PizzaToppingPrice?productId=${pdetail.productId}`);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getProductItem = async () => {
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
    };

    useEffect(() => {
        getTopping();
        getProductItem();
    }, [pdetail.productId]);

    useEffect(() => {
        console.log('p==>', pdetail)
    }, [pdetail ])
    return (
        <>
            <Loading />
            <div className='product-details-outer'>
                <div className='product-detail-inner'>
                    <div className='about-product'>
                        <h3 className='pname'>{editData.produtDetail.productName}</h3>
                        {
                            pdetail.price === "" || pdetail.price === 0 ?
                                <h6 style={{ fontSize: "13px", marginLeft: '12px' }}></h6>
                                :
                                <h6 style={{ fontSize: "13px", marginLeft: '12px' }}>${pdetail.price}</h6>
                        }

                        {editData.produtDetail.pricedesc === "" || editData.produtDetail.pricedesc === "0" ?
                            <h6 className='price'>${editData.produtDetail.price}</h6>
                            : null}
                    </div>
                    <div className='product-img'>
                        <img src={NoImage} alt="" />
                    </div>
                </div>
                {editData.produtDetail.isPizza === 1 || editData.produtDetail.isCreateYourOwn === 1 || editData.produtDetail.isDeal === 1 ?
                    <EditPizza {...{ editData, setEditCustomize, setEdit, handeAddtoCart, setSize, note, setNote, qty, setQty, pdetail, size, crust, spice, pizzaName, editModify, setEditModify }} />
                    :
                    <EditItem {...{ checkboxItem1, setCheckboxItem1, current, maxLevel, setmaxLevel, note, setNote, qty, setQty, handeAddtoCart, databyID, setEdit }} />
                }
            </div>

            {/* PIZZA */}
            {editData.produtDetail.isPizza === 1 ?
                <Modal open={editCustomize} onCancel={() => setEditCustomize(false)} width={500} height={600}>
                    <EditCustomize {...{ setEditCustomize, pdetail, editData, editModify, setEditModify }} />
                </Modal>
                : ""}
        </>
    );
}

export default Edit;
