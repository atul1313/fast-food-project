import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userContext } from '../../context/Usercontext';

function EditCustomize({ setEditCustomize, pdetail, editData, editModify, setEditModify }) {
  const [modify, setModify] = useState([]);
  const [modifyname, setModifyname] = useState("VEGGIE");
  const [initializingCheckboxes, setInitializingCheckboxes] = useState(true); 
  const { setCheckboxItem1, checkboxItem1, setIsLoading } = useContext(userContext);



  const handleCheckboxChange = (modifier) => {
    if (editModify.length > 0) {
      setEditModify([]);
    }
    
    const isModifierSelected = checkboxItem1.some((selected) => selected.pizzaModifierId === modifier.pizzaModifierId);
    const updatedModifiers = isModifierSelected
    ? checkboxItem1.filter((selected) => selected.pizzaModifierId !== modifier.pizzaModifierId)
    : [...checkboxItem1, modifier];
    setCheckboxItem1(updatedModifiers);
  };
  
  const handleAddToCartClick = () => {
    setCheckboxItem1(checkboxItem1);
    setEditCustomize(false);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/Modifier/ModifierCategories?productId=${pdetail.productId}&sizeId=1`);
      if (response.status === 200) {
        setModify(response.data);
        setInitializingCheckboxes(false); 
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pdetail.productId);
    setEditModify(editData.selectVariation);
    setCheckboxItem1(editData.selectVariation);
  }, [editData.selectVariation]);

  const sortModifiersAlphabetically = (modifiers) => {
    return modifiers.slice().sort((a, b) => a.pizzaModifierName.localeCompare(b.pizzaModifierName));
  };


  
  return (
    <>
      <div className='customize-outer'>
        <ul className='customize-inner'>
          {modify.map((parentItem) => (
            <li
              key={parentItem.modifierName}
              className='links'
              onClick={() => setModifyname(parentItem.modifierName)}
            >
              {parentItem.modifierName}
            </li>
          ))}
        </ul>

        <div className='chackbox-seletion custom-scrollbar'>
          {modify.map((item) =>
            item.modifierName === modifyname ? (
              initializingCheckboxes ? (
                sortModifiersAlphabetically(item.modifiers).map((modifier, index) => (
                  <label key={index} className="item">
                    <input
                      type="checkbox"
                      checked={false} // Initially unchecked
                      onChange={() => handleCheckboxChange(modifier)}
                    />
                    <span style={{ marginLeft: "20px" }}>
                      {modifier.pizzaModifierName} {modifier.pizzaModifierPrice === "" || modifier.pizzaModifierPrice === 0 ? "" : (modifier.pizzaModifierPrice)}
                    </span>
                  </label>
                ))
              ) : (
                sortModifiersAlphabetically(item.modifiers).map((modifier, index) => (
                  <label key={index} className="item">
                    <input
                      type="checkbox"
                      checked={editModify.some((selected) => selected.pizzaModifierId === modifier.pizzaModifierId) || checkboxItem1.some((selected) => selected.pizzaModifierId === modifier.pizzaModifierId)}
                      onChange={() => handleCheckboxChange(modifier)}
                    />
                    <span style={{ marginLeft: "20px" }}>
                      {modifier.pizzaModifierName} {modifier.pizzaModifierPrice === "" || modifier.pizzaModifierPrice === 0 ? "" : (modifier.pizzaModifierPrice)}
                    </span>
                  </label>
                ))
              )
            ) : null
          )}
        </div>

        <div className='customize-btn'>
          <button onClick={() => { setEditCustomize(false) }}>CANCEL</button>
          <button onClick={handleAddToCartClick}>ADD TO CART</button>
        </div>
      </div>
    </>
  );
}

export default EditCustomize;
