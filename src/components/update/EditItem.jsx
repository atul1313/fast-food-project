import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../context/Usercontext';
import { Stepper, Step, StepLabel } from '@mui/material';

function EditItem({ checkboxItem1, setCheckboxItem1, current, maxLevel, setmaxLevel, note,
  setNote, qty, setQty, handeAddtoCart, databyID, setEdit }) {
  const { editData, setCurrent, selectVariation, setSelectVariation, setProductDetails } = useContext(userContext);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null); // State to store selected checkbox

  const handleNext = () => {
    setCurrent(current + 1);
    if (selectedCheckbox) { // If there's a selected checkbox, add it to checkboxItem1
      setCheckboxItem1([...checkboxItem1, selectedCheckbox]);
    }
    setSelectVariation(null);
  };

  const handleCheckboxItem1 = (item) => {
    setSelectedCheckbox(item); // Update selected checkbox
    setSelectVariation(item);
  };

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
    setQty(editData.qty);
    setNote(editData.note);
    const items = databyID.filter((item) => item.level === current);
    if (items.length === 1) {
      setSelectVariation(items[0]);
      setSelectedCheckbox(items[0]);
    } else if (editData.selectVariation) {
      setSelectVariation(editData.selectVariation);
      setSelectedCheckbox(editData.selectVariation);
    }
  }, [current, databyID, editData]);


  const steps = Array.from({ length: maxLevel + 1 }, (_, index) => index + 1);

  return (
    <>
      <Stepper activeStep={current} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className='salad'>
        {maxLevel >= current + 1 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              {current !== 0 ? (
                <button variant="contained" onClick={handleBack}>
                  Prev
                </button>
              ) : (
                ''
              )}
              <div>
                <button
                  disabled={selectVariation === null}
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>

            <p className='selectDesc'>
              Please Select 1 item <span>(Required)</span>
            </p>

            <div className='item-outer custom-scrollbar'>
              {databyID
                .filter((item) => item.level === current + 1)
                .map((i, index) => (
                  <label key={index} className='item'>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxItem1(i)}
                      checked={
                        checkboxItem1.some((item) => item.id === i.id) || selectVariation === i ||
                        (current > 0 && checkboxItem1.length === 1 && checkboxItem1[0].id === i.id)
                      }
                    />
                    <span style={{ marginLeft: '20px' }}>
                      {i.name} {i.price === '' || i.price === 0 ? '' : `[$${i.price}]`}
                    </span>
                  </label>
                ))}
            </div>

          </>
        ) : (
          <>
            <div style={{ margin: '20px 0' }}>
              <button variant="contained" onClick={handleBack}>
                Prev
              </button>
            </div>
            <div className='note-outer'>
              <span>Notes</span>
              <textarea className='note' value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
            <div className='qty-inc-dec'>
              <div onClick={() => { if (qty > 1) { setQty(qty - 1) } }}>-</div>
              <input type='text' value={qty} readOnly onChange={(e) => setQty(e.target.value)} />
              <div onClick={() => { setQty(qty + 1); }}>+</div>
            </div>
          </>
        )}
        <div className='model-footer'>
          <button onClick={() => { setEdit(false); setCurrent(0); setQty(1); setCheckboxItem1([]); }} className='cancle'>
            CANCEL
          </button>
          <button
            disabled={maxLevel >= current + 1}
            variant="contained"
            onClick={handeAddtoCart}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </>
  );
}

export default EditItem;

