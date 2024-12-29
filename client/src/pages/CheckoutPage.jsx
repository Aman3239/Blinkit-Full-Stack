import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DispalyPriceinRupees'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddAdress from '../components/AddAdress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/Axios.toastError'
import Axios from '../utils/Axios'
import summaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {loadStripe} from '@stripe/stripe-js'

const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty,fetchCartItem ,fetchOrder} = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(0)
    const addressList = useSelector(state => state.address.addressList)
    const cartItemList = useSelector(state=>state.cartItem.cart)
    const navigate = useNavigate()

    const handleCashOnDelivery = async() => {
        try {
            const response = await Axios({
                ...summaryApi.CashOnDeliveryOrderController,
                data:{
                    list_item:cartItemList,
                    addressId:addressList[selectedAddress]?._id,
                    totalAmt:totalPrice,
                    subTotalAmt:totalPrice
                }
            })

            const {data:responseData}=response
            if(responseData.success){
                toast.success(responseData.message )
                if(fetchCartItem){
                    fetchCartItem()
                }
                if(fetchOrder){
                    fetchOrder()
                }
                navigate('/success',{
                    state:{
                        text:"Order"
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
// online payment
    const handleOnlinePayment = async()=>{
        try {
            toast.loading("Loading...")
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise = await loadStripe(stripePublicKey)
            const response = await Axios({
                ...summaryApi.payment_url,
                data:{
                    list_item:cartItemList,
                    addressId:addressList[selectedAddress]?._id,
                    totalAmt:totalPrice,
                    subTotalAmt:totalPrice
                }
            })

            const {data:responseData}=response
            if(responseData?.id){
                stripePromise.redirectToCheckout({sessionId:responseData.id})
            }
            if(fetchCartItem){
                fetchCartItem()
            }
            if(fetchOrder){
                fetchOrder()
            }
        } catch (error) {
           AxiosToastError(error) 
        }
    }

    return (
        <section className='bg-blue-50'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between '>
                <div className='w-full'>
                    {/* Addressessss */}
                    <h3 className='text-lg font-semibold'>Choose your Address</h3>
                    <div className='bg-white p-2 grid gap-4'>
                        {
                            addressList.map((address, index) => {
                                return (
                                    <label htmlFor={"address" + index} className={!address.status && 'hidden'}>
                                        <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                                            <div>
                                                <input type="radio" id={"address" + index} value={index} onChange={(e) => setSelectedAddress(e.target.value)} name="address" />
                                            </div>
                                            <div>
                                                <p>{address.address_line}</p>
                                                <p>{address.city}</p>
                                                <p>{address.state}</p>
                                                <p>{address.country} - {address.pincode}</p>
                                                <p>{address.mobile}</p>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })
                        }

                        <div onClick={() => setOpenAddress(true)} className='h-20 flex items-center justify-center bg-blue-50 border-2 border-dashed cursor-pointer'>
                            Add address
                        </div>
                    </div>

                </div>
                <div className='w-full max-w-md bg-white py-4 px-2'>
                    {/* Summaryyy */}
                    <h3 className='text-lg font-semibold'>Summary</h3>

                    <div className='bg-white p-4 flex flex-col gap-1'>
                        <h3 className='font-semibold'>Bill details</h3>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Items total</p>
                            <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Quantity total</p>
                            <p className='flex items-center gap-2'> {totalQty} item </p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Delivery Charges</p>
                            <p className='flex items-center gap-2'>Free</p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p className=''>Grand total</p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <button onClick={handleOnlinePayment} className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'>Online Payment</button>
                        <button onClick={handleCashOnDelivery} className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded'>Case on Delivery</button>
                    </div>
                </div>
            </div>
            {
                openAddress && (
                    <AddAdress close={() => setOpenAddress(false)} />
                )
            }

        </section>
    )
}

export default CheckoutPage