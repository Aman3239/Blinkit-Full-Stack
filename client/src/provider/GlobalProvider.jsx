import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/Axios.toastError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContex = createContext(null)

export const useGlobalContext = () => useContext(GlobalContex)

const GlobalProvider = ({ children }) => {
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getCartItem
            })
            const { data: responseData } = response
            if (responseData.success) {
                dispatch(handleAddItemCart(responseData.data))
                console.log("response", responseData)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateCartItem = async (id, qty) => {
        try {
            const response = await Axios({
                ...summaryApi.updateCartItemQty,
                data: {
                    _id: id,
                    qty: qty
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                // toast.success(responseData.message)
                fetchCartItem()
                return responseData
            }
        } catch (error) {
            AxiosToastError(error)
            return error
        }
    }
    const deleteCartItem = async (cartId) => {
        try {
            const response = await Axios({
                ...summaryApi.deleteCartItem,
                data: {
                    _id: cartId
                }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItem()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        const qty = cartItem.reduce((preve, curr) => {
            return preve + curr.quantity
        }, 0)
        setTotalQty(qty)
        const tprice = cartItem.reduce((preve, curr) => {
            const priceAfterDiscount = priceWithDiscount(curr?.productId?.price, curr?.productId?.discount)
            return preve + (priceAfterDiscount
                * curr.quantity)

        }, 0)
        setTotalPrice(tprice)

        const notDiscountPrice = cartItem.reduce((preve, curr) => {
            return preve +
                (curr?.productId?.price * curr.quantity)
        }, 0)
        setNotDiscountTotalPrice(notDiscountPrice)
    }, [cartItem])



    const handleLogoutOut = () => {
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async()=>{
        try {
            const response = await Axios({
                ...summaryApi.getAddress
            })
            const {data:responseData}=response
            if(responseData.success){
                dispatch(handleAddAddress(responseData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchOrder = async()=>{
        try {
            const response = await Axios({
                ...summaryApi.getOrderItems
            })
            const {data:responseData}=response
            if(responseData.success){
                dispatch(setOrder(responseData.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCartItem()
        handleLogoutOut()
        fetchAddress()
        fetchOrder()
    }, [user])
    return (
        <GlobalContex.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder
        }}>
            {children}
        </GlobalContex.Provider>
    )
}

export default GlobalProvider
