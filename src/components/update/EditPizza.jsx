import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../context/Usercontext';
import axios from 'axios';

function EditPizza({ setEditCustomize, setEdit, handeAddtoCart, setSize, qty, setQty, note, setNote, pdetail, size, crust, spice, pizzaName }) {
    const spiceData = ["Hot", "Extra Hot", "Mild", "Med"]
    const { editData, sizedata, setSizeData, crustData, setCrustData, pizzacalzone, setCrust, setPizzaName, setSpice, createyourown, setcreateourown } = useContext(userContext)
    const [selectedCrust, setSelectedCrust] = useState(null);

    useEffect(() => {
        if (editData) {
            setSelectedCrust(editData.pCrust);
        }
    }, [editData]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/api/PizzaSize/ByProductId?productId=${pdetail.productId}`).then((res) => {
            if (res.status === 200) {
                setSizeData(res.data)
            }
        })
            .catch((err) => {
                console.log(err);
            })
    }, [pdetail.productId])

    // GET PIZZA CRUST
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/api/Modifier/Crusts?sizeId=1&crustId=0&productId=${pdetail.productId}`).then((res) => {
            if (res.status === 200) {
                setCrustData(res.data)
            }
        })
            .catch((err) => {
                console.log(err);
            })
    }, [pdetail.productId])

    //Create your own
    useEffect(() => {
        const apiendpoint = `${process.env.REACT_APP_URL}/api/PizzaToppingPrice?productId=${pdetail.productId}`
        axios.get(apiendpoint).then((res) => {
            if (res.status === 200) {
                setcreateourown(res.data)
            }
        })
            .catch((err) => {
                console.log(err);
            })
    }, [pdetail.productId])



    const handleSizeChange = (item) => {
        setSize(item);
    };

    const handleCreateOwnChange = (item) => {
        setSize(item);
    };

    const handleCrustChange = (item) => {
        setSelectedCrust(item);
        setCrust(item)
    };

    const handlePizzaChange = (item) => {
        setPizzaName(item)
    };

    const handleSpiceChange = (item) => {
        setSpice(item)
    };

    useEffect(() => {
        setQty(editData.qty)
        setNote(editData.note)
    }, [editData])



    useEffect(() => {
        if (sizedata.length > 0 && !size) {
            handleSizeChange(editData.pSize);
        }
        if (createyourown.length > 0 && !size) {
            handleCreateOwnChange(editData.pSize);
        }
        if (crustData.length > 0 && !crust) {
            handleCrustChange(editData.pCrust);
        }
        if (pizzacalzone.length > 0 && !pizzaName) {
            handlePizzaChange(editData.pizzaName);
        }
        if (spice.length > 0 && !spice) {
            handleSpiceChange(editData.spice);
        }
    }, [sizedata, size, crustData, crust, pizzacalzone, pizzaName, spiceData, spice, createyourown]);
    return (
        <>
            <div className='selection-outer'>
                <div className='pizza-selection'>
                    {editData.produtDetail.isPizza === 1 && editData.produtDetail.isDeal === 1 && editData.produtDetail.isCreateYourOwn === 0 ?
                        <>
                            <h6>Select Pizza Item</h6>
                            <select onChange={(e) => handlePizzaChange(pizzacalzone[e.target.value])}>
                                {pizzacalzone.map((item, index) => (
                                    <option key={index} value={index} selected={editData.pizzaName.productId === item.productId}>
                                        {item.productName}
                                    </option>
                                ))}
                            </select>
                        </>
                        : ""}
                </div>
                {
                    pdetail.isCreateYourOwn === 1 ?
                        <>
                            <div className='selection-inner'>
                                <h6>Size</h6>

                                <select onChange={(e) => handleCreateOwnChange(createyourown[e.target.value])}>
                                    {createyourown.map((item, index) => (
                                        <option key={index} selected={editData.pSize.sizeId === item.sizeId} value={index}>
                                            {item.sizeName} [${item.toppingPrice1}]
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </> :
                        <>
                            <div className='selection-inner'>
                                <h6>Size</h6>
                                <select onChange={(e) => handleSizeChange(sizedata[e.target.value])}>
                                    {sizedata.map((item, index) => (
                                        <option key={index} selected={editData.pSize.sizeId === item.sizeId} value={index}>
                                            {item.sizeName} [${item.sizePriceX1}]
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                }

                <div className='selection-inner'>
                    {(editData.produtDetail.isPizza === 1 &&
                        editData.produtDetail.isDeal === 0) &&
                        (editData.produtDetail.isCreateYourOwn === 0) &&
                        <>
                            <h6>Crust</h6>
                            <select onChange={(e) => handleCrustChange(crustData[e.target.value])}>
                                {crustData.map((item, index) => (
                                    <option key={index} selected={editData.pCrust.modifierId === item.modifierId} value={index}>
                                        {item.modifierName} (${item.modifierCost})
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                    {(editData.produtDetail.isPizza === 1 &&
                        editData.produtDetail.isCreateYourOwn === 1) &&
                        (pdetail.isDeal === 0) &&
                        <>
                            <h6>Crust</h6>
                            <select onChange={(e) => handleCrustChange(crustData[e.target.value])}>
                                {crustData.map((item, index) => (
                                    <option key={index} selected={editData.pCrust.modifierId === item.modifierId} value={index}>
                                        {item.modifierName} (${item.modifierCost})
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    {editData.produtDetail.isPizza === 1 && editData.produtDetail.isDeal === 1 ?
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
                        : null}
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
                <button onClick={() => { setEdit(false); setQty(1) }} className='cancle'>CANCEL</button>
                <button onClick={() => { setEditCustomize(true) }}>CUSTOMIZE</button>
                <button onClick={handeAddtoCart}>ADD TO CART</button>
            </div>
        </>
    )
}

export default EditPizza;