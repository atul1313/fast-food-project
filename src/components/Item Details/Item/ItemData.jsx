import React, { useContext, useEffect, useState } from 'react'
import '../../../css/salad.css'
import { userContext } from '../../../context/Usercontext'
import { Stepper, Step, StepLabel } from '@mui/material';

function ItemData({ databyID, qty, maxLevel, setmaxLevel, note, setQty, setNote, handeAddtoCart, setProductDetails, current, setCurrent, checkboxItem1, setCheckboxItem1, selectVariation, setSelectVariation }) {

    const { editData, edit, setEdit } = useContext(userContext)


    const handleCheckboxItem1 = (item) => {
        if (current === 0) {
            setCheckboxItem1([]);
        }
        setSelectVariation(item);
    }


    const handleNext = () => {
        setCurrent(current + 1);
        setCheckboxItem1([...checkboxItem1, selectVariation]);
        setSelectVariation(null)
    }

    const handleBack = () => {
        setCurrent(current - 1);
        if (current > 0) {
            const prevItem = checkboxItem1[checkboxItem1.length - 2];
            if (prevItem) {
                setCheckboxItem1([prevItem]);
                setSelectVariation(prevItem);
            } else {
                setCheckboxItem1([]);
                setSelectVariation(null);
            }
        }
    };



    const handleMax = () => {
        setmaxLevel(
            databyID.reduce((max, item) => {
                return item.level > max ? item.level : max;
            }, 0)
        );
    };

    useEffect(() => {
        handleMax();
        const items = databyID.filter((item) => item.level === current);
        if (items.length === 1) {
            setSelectVariation(items[0]);
        } else {
            setSelectVariation(null);
        }
    }, [current, databyID]);

    const steps = Array.from({ length: maxLevel + 1 }, (_, index) => index + 1);

    if (maxLevel > 0) {
        return (
            <>
                <Stepper activeStep={current}>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className='salad'>
                    {maxLevel >= (current + 1) ?
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
                                {current != 0 ?
                                    <button style={{ background: checkboxItem1 ? "#4e35b1" : "#f4f4f6", color: checkboxItem1 ? "#fff" : "#4e35b1" }} onClick={() => handleBack()}>
                                        Prev
                                    </button>
                                    : null}
                                <div></div>
                                <div>
                                    <button
                                        disabled={selectVariation === null}
                                        style={{
                                            background: selectVariation != null ? "#4e35b1" : "#f4f4f6",
                                            color: selectVariation != null ? "#fff" : "#4e35b1"
                                        }}
                                        onClick={() => handleNext()}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <p className='selectDesc'>Please Select 1 item <span>(Required)</span></p>

                            <div className='item-outer custom-scrollbar'>
                                {databyID.filter((item) => item.level === (current + 1)).map((i, index) => (
                                    <label key={index} className="item">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxItem1(i)}
                                            checked={
                                                checkboxItem1.some((item) => item.id === i.id) || selectVariation === i ||
                                                (current > 0 && checkboxItem1.length === 1 && checkboxItem1[0].id === i.id)
                                            }
                                        />
                                        <span style={{ marginLeft: "20px" }}>
                                            {i.name} {i.price === "" || i.price === 0 ? "" : `[$${i.price}]`}
                                        </span>
                                    </label>
                                ))}


                            </div>
                        </>
                        : (
                            <>
                                <div style={{ margin: "20px 0" }}>
                                    <button style={{ background: checkboxItem1 ? "#4e35b1" : "#f4f4f6", color: checkboxItem1 ? "#fff" : "#4e35b1" }} onClick={() => handleBack()}>
                                        Prev
                                    </button>
                                </div>
                                <div className='note-outer'>
                                    <span>Notes</span>
                                    <textarea className='note' defaultValue={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                </div>
                                <div className='qty-inc-dec'>
                                    <div onClick={() => { if (qty > 1) { setQty(qty - 1); setEdit(false) } }}>-</div>
                                    <input type="text" value={qty} readOnly onChange={(e) => setQty(e.target.value)} />
                                    <div onClick={() => { setQty(qty + 1); setEdit(false) }}>+</div>
                                </div>
                            </>
                        )}
                    <div className='model-footer'>
                        <button onClick={() => { setProductDetails(false); setCurrent(0); setCheckboxItem1([]) }} className='cancle'>CANCEL</button>
                        <button
                            disabled={maxLevel >= (current + 1)}
                            style={{
                                background: maxLevel >= (current + 1) ? "#f4f4f6" : "#4e35b1",
                                color: maxLevel >= (current + 1) ? "#4e35b1" : "#fff"
                            }}
                            onClick={handeAddtoCart}
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </>
        )
    }
    else if (maxLevel === 0) {
        return (
            <>
                <div className='salad'>
                    {current === 0 ?
                        <>
                            <div className='note-outer'>
                                <span>Notes</span>
                                <textarea className='note' defaultValue={note} onChange={(e) => setNote(e.target.value)}></textarea>
                            </div>

                            <div className='qty-inc-dec'>
                                <div onClick={() => { if (qty > 1) { setQty(qty - 1) } }}>-</div>
                                <input type="text" value={qty} readOnly onChange={(e) => setQty(e.target.value)} />
                                <div onClick={() => setQty(qty + 1)}>+</div>
                            </div>
                        </>
                        : ""}

                    <div className='model-footer'>
                        <button onClick={() => { setProductDetails(false); setCurrent(0); setmaxLevel(0); setCheckboxItem1([]); }} className='cancle'>CANCEL</button>

                        <button disabled={current != 0} style={{ background: current === 0 ? "#4e35b1" : "#f4f4f6", color: current === 0 ? "#fff" : "#4e35b1" }} onClick={handeAddtoCart}>ADD TO CART</button>
                    </div>
                </div>
            </>
        )
    }


}

export default ItemData;