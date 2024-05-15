import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const userContext = createContext();

function HeaderState(props) {
  const [cart, setCart] = useState(false);
  const [data, setData] = useState([]);
  const [orderType, setOrderType] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [billData, setBillData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [productDetails, setProductDetails] = useState(false);
  const [pdetail, setPdetail] = useState();
  const [addVerify, setAddVerify] = useState();
  const [editData, setEditData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [pizzacalzone, setPizzacalzone] = useState([]);
  const [sizedata, setSizeData] = useState([]);
  const [crustData, setCrustData] = useState([]);
  const [settings, setSettings] = useState();
  const [forget, setForget] = useState(false);

  const [checkboxItem1, setCheckboxItem1] = useState([]);
  const [current, setCurrent] = useState(0);
  const [maxLevel, setmaxLevel] = useState(0);
  const [selectVariation, setSelectVariation] = useState(null);
  const [size, setSize] = useState("");
  const [crust, setCrust] = useState("");
  const [pizzaName, setPizzaName] = useState("");
  const [spice, setSpice] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [note, setNote] = useState("");
  const [createyourown, setcreateourown] = useState([]);
  const [qty, setQty] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      setIsRefreshed(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isRefreshed) {
      window.location.href = "/";
    }
  }, [isRefreshed]);

  // ADMIN SIDE
  const [bar, setBar] = useState({ display: "none" });
  const handleBar = () => {
    if (bar.display === "none") {
      setBar({ display: "block" });
    } else {
      setBar({ display: "none" });
    }
  };

  const handleClick = () => {
    setCart(true);
  };

  const totalPrice = cartData.reduce((total, item) => {
    let itemTotal = item.price || 0;
    if (Array.isArray(item.variationsPrice)) {
      itemTotal += item.variationsPrice.reduce((sum, price) => sum + price, 0);
    }

    return total + itemTotal;
  }, 0);

  // SIDEBAR DATA
  // const fatchData = () => {
  //     axios.get('https://onlinefoodordering.ca/RangerAPI/testorder/api/initialData')
  //         .then((res) => {
  //             if (res.status === 200) {
  //                 setData(res.data.categories);
  //                 setTaxes(res.data.taxes);
  //                 setSettings(res.data.settings);
  //             }
  //         })
  //         .catch((error) => {
  //             console.error('Error fetching data:', error);
  //         });
  // };

  // useEffect(() => {
  //     fatchData();
  // }, []);

  function fatchData() {
    try {
      axios
        .get(
          "https://onlinefoodordering.ca/RangerAPI/testorder/api/initialData"
        )
        .then((res) => {
          if (res.status === 200) {
            setData(res.data.categories);
            setTaxes(res.data.taxes);
            setSettings(res.data.settings);
          }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fatchData();
  }, []);

  useEffect(() => {
    const storedArray = localStorage.getItem("cartData");
    if (storedArray) {
      setCartData(JSON.parse(storedArray));
    }
  }, []);

  return (
    <>
      <userContext.Provider
        value={{
          handleClick,
          cart,
          setCart,
          fatchData,
          data,
          setData,
          billData,
          setBillData,
          orderType,
          setOrderType,
          selectedItems,
          setSelectedItems,
          cartData,
          setCartData,
          totalPrice,
          taxes,
          pdetail,
          setPdetail,
          productDetails,
          setProductDetails,
          editData,
          setEditData,
          edit,
          setEdit,
          bar,
          setBar,
          handleBar,
          settings,
          sizedata,
          setSizeData,
          crustData,
          setCrustData,
          isLoading,
          setIsLoading,
          createyourown, setcreateourown,
          pizzacalzone,
          setPizzacalzone,
          selectVariation,
          setSelectVariation,
          size,
          setSize,
          crust,
          setCrust,
          pizzaName,
          setPizzaName,
          spice,
          setSpice,
          selectedModifiers,
          setSelectedModifiers,
          note,
          setNote,
          qty,
          setQty,
          checkboxItem1,
          setCheckboxItem1,
          current,
          setCurrent,
          maxLevel,
          setmaxLevel,
          addVerify,
          setAddVerify,
          forget,
          setForget,
        }}
      >
        {props.children}
      </userContext.Provider>
    </>
  );
}

export default HeaderState;
