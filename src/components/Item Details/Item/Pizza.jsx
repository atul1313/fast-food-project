import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userContext } from '../../../context/Usercontext';
import { useLocation } from 'react-router-dom';

function Pizza({ spice, setSpice, setPizzaName, pizzacalzone, pdetail, note, setNote, qty, setQty, handeAddtoCart,
    setProductDetails, setCustomize, setCrust, size, setSize, crust, pizzaName }) {
    const spiceData = ["Hot", "Extra Hot", "Mild", "Med"];
    const { sizedata, setSizeData, createyourown, setcreateourown, crustData, setCrustData, selectedModifiers } = useContext(userContext);
    const location = useLocation();

    // GET PIZZA SIZE
    useEffect(() => {
        const apiendpoint = `${process.env.REACT_APP_URL}/api/PizzaSize/ByProductId?productId=36`
        axios.get(apiendpoint)
            .then((res) => {
                if (res.status === 200) {
                    setSizeData(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [pdetail.productId]);
    // GET PIZZA CRUST
    useEffect(() => {
        const apiendpoint = `${process.env.REACT_APP_URL}/api/Modifier/Crusts?sizeId=${size?.sizeId}&crustId=0&productId=${pdetail.productId}`;
        axios.get(apiendpoint)
            .then((res) => {
                if (res.status === 200) {
                    setCrustData(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [pdetail.productId, size?.sizeId]);

    // Fetch Create Your Own
    useEffect(() => {
        const apiendpoint = `${process.env.REACT_APP_URL}/api/PizzaToppingPrice?productId=75`;
        axios.get(apiendpoint)
            .then((res) => {
                if (res.status === 200) {
                    setcreateourown(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [pdetail.productId]);

    // Reset selections
    const resetSelections = () => {
        setSize("");
        setCrust("");
        setPizzaName("");
        setSpice("");
        setNote('');
        setQty(1);
    };
    // Set defaults
    useEffect(() => {
        if (sizedata.length > 0 && !size) {
            setSize(sizedata[0]);
        }
        // if (createyourown.length > 0 && !size) {
        //     setcreateourown(createyourown[0]);
        // }
        if (crustData.length > 0 && !crust) {
            setCrust(crustData[0]);
        }
        if (pizzacalzone.length > 0 && !pizzaName) {
            setPizzaName(pizzacalzone[0]);
        }
        if (spiceData.length > 0 && !spice) {
            setSpice(spiceData[0]);
        }
    }, [createyourown, sizedata, size, location.pathname, crustData, crust, pizzacalzone, pizzaName, spiceData, spice]);


    // if (location.pathname === "/CREATE%20YOUR%20OWN/9" && createyourown.length > 0 && !size) {
    //     setSize(createyourown[0]);
    // } else {
    //     setSize(sizedata[0]);
    // }

    // Event handlers
    const handleSizeChange = (item) => {
        setSize(item);
    };

    const handleCreateOwnChange = (item) => {
        setSize(item);
    };

    const handleCrustChange = (item) => {
        setCrust(item);
    };

    const handlePizzaChange = (item) => {
        setPizzaName(item);
    };

    const handleSpiceChange = (item) => {
        setSpice(item);
    };



    return (
        <>
            <div className='selection-outer'>
                <div className='pizza-selection'>
                    {pdetail.isPizza === 1 && pdetail.isDeal === 1 && pdetail.isCreateYourOwn === 0 &&
                        <>
                            <h6>Select Pizza Item</h6>
                            <select onChange={(e) => handlePizzaChange(pizzacalzone[e.target.value])}>
                                {pizzacalzone.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.productName}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                </div>
                {/* Size */}
                {pdetail.isCreateYourOwn === 1 ?
                    <div className='selection-inner'>
                        <h6>Size</h6>
                        <select onChange={(e) => handleCreateOwnChange(createyourown[e.target.value])}>
                            {Array.isArray(createyourown) && createyourown.map((item, index) => (
                                <option key={index} value={index}>
                                    {item.sizeName} [${item.toppingPrice1}]
                                </option>
                            ))}
                        </select>
                    </div>
                    :
                    <div className='selection-inner'>
                        <h5 >Sizes</h5>
                        <select onChange={(e) => handleSizeChange(sizedata[e.target.value])}>
                            {sizedata.map((item, index) => (
                                <option key={index} value={index}>
                                    {item.sizeName} [${item.sizePriceX1}]
                                </option>
                            ))}
                        </select>
                    </div>
                }

                <div className='selection-inner'>
                    {(pdetail.isPizza === 1 && pdetail.isCreateYourOwn === 0) && (pdetail.isDeal === 0) &&
                        <>
                            <h6>Crust</h6>
                            <select onChange={(e) => handleCrustChange(crustData[e.target.value])}>
                                {crustData.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.modifierName} (${item.modifierCost})
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    {(pdetail.isPizza === 1 && pdetail.isCreateYourOwn === 1) && (pdetail.isDeal === 0) &&
                        <>
                            <h6>Crust</h6>
                            <select onChange={(e) => handleCrustChange(crustData[e.target.value])}>
                                {crustData.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.modifierName} (${item.modifierCost})
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    {pdetail.isPizza === 1 && pdetail.isDeal === 1 &&
                        <>
                            <h6>Spice Level</h6>
                            <select onChange={(e) => handleSpiceChange(spiceData[e.target.value])}>
                                {spiceData.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                </div>
            </div>

            <div className='note-outer'>
                <span>Notes</span>
                <textarea className='note' value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
            <div className='qty-inc-dec'>
                <div onClick={() => { if (qty > 1) { setQty(qty - 1) } }}>-</div>
                <input type="text" value={qty} readOnly onChange={(e) => setQty(e.target.value)} />
                <div onClick={() => setQty(qty + 1)}>+</div>
            </div>

            <div className='model-footer'>
                <button onClick={() => { setProductDetails(false); resetSelections(); }} className='cancle'>CANCEL</button>
                <button onClick={() => setCustomize(true)}>CUSTOMIZE</button>
                <button
                    disabled={location.pathname === "/CREATE%20YOUR%20OWN/9" && selectedModifiers?.length === 0}
                    onClick={handeAddtoCart}
                    style={{ cursor: selectedModifiers?.length === 0 && location.pathname === "/CREATE%20YOUR%20OWN/9" ? "not-allowed" : "pointer" }}
                >
                    ADD TO CART
                </button>
            </div>
        </>
    );
}

export default Pizza;
