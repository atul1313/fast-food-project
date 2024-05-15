import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../context/Usercontext';

function Customize({ pdetail, checkboxItem1, setCheckboxItem1, setCustomize, selectedModifiers, setSelectedModifiers }) {


    const { setIsLoading } = useContext(userContext)
    const [modify, setModify] = useState([]);
    const [modifyname, setModifyname] = useState("VEGGIE")
    const handleCheckboxChange = (modifier) => {
        const isModifierSelected = selectedModifiers.some((selected) => selected.pizzaModifierId === modifier.pizzaModifierId);

        const updatedModifiers = isModifierSelected
            ? selectedModifiers.filter((selected) => selected.pizzaModifierId !== modifier.pizzaModifierId)
            : [...selectedModifiers, modifier];

        setSelectedModifiers(updatedModifiers);
    };



    const handleAddToCartClick = () => {
        setCheckboxItem1(selectedModifiers)
        setCustomize(false)
    }

    const fatchData = async () => {
        try {
            setIsLoading(true)
            const responce = await axios.get(`${process.env.REACT_APP_URL}/api/Modifier/ModifierCategories?productId=${pdetail.productId}&sizeId=1`);
            if (responce.status === 200) {
                setModify(responce.data)
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        fatchData();
    }, [pdetail.productId])

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
                            item.modifiers.map((modifier, index) => (
                                <label key={index} className="item">
                                    <input
                                        type="checkbox"
                                        checked={modifier.selected === true || selectedModifiers.some((selected) => selected.pizzaModifierId === modifier.pizzaModifierId)}
                                        onChange={() => handleCheckboxChange(modifier)}
                                    />
                                    <span style={{ marginLeft: "20px" }}>
                                        {modifier.pizzaModifierName} {modifier.pizzaModifierPrice === "" || modifier.pizzaModifierPrice === 0 ? "" : (modifier.pizzaModifierPrice)}
                                    </span>
                                </label>
                            ))
                        ) : null
                    )}

                </div>

                <div className='customize-btn'>
                    <button onClick={() => { setCustomize(false); setSelectedModifiers([]) }}>CANCEL</button>
                    <button onClick={handleAddToCartClick} disabled={selectedModifiers.length === 0}>ADD TO CART</button>
                </div>
            </div>
        </>
    )
}

export default Customize;