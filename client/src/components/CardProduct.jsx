import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DispalyPriceinRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/ValidURLConverter'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import AxiosToastError from '../utils/Axios.toastError'
import Axios from '../utils/Axios'
import summaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading]=useState(false)


    return (
        <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded bg-white'>
            <div className='min-h-20 w-full max-h-24 lg:max-h-32 overflow-hidden'>
                <img src={data.image[0]}
                    className='w-full h-full object-scale-down lg:scale-125'
                    alt="" />
            </div>
            <div className='flex items-center lg:gap-4'>
                <div className='p-[1px] text-green-600 bg-green-50 rounded text-xs lg:text-sm w-fit px-2 lg:px-0 '>
                    10 min
                </div>
                <div>
                    {
                        Boolean(data.discount) && (
                            <p className='text-green-600 bg-green-100 px-2 rounded w-fit text-xs'>{data.discount}% discount</p>
                        )
                    }
                </div>
            </div>
            <div className='font-medium text-ellipsis lg:text-base text-sm lg:px-0 px-2 line-clamp-2'>
                {data.name}
            </div>
            <div className='w-fit px-2 lg:px-0 text-sm lg:text-base'>
                {data.unit}

            </div>
            <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
                <div className='flex items-center gap-1'>
                    <div className='font-semibold'>
                        {DisplayPriceInRupees(priceWithDiscount(data.price, data.discount))}
                    </div>

                </div>

                <div>
                    {
                        data.stock == 0 ? (
                            <p className='text-red-500 text-sm text-center'>Out of stock</p>
                        ) : (
                         <AddToCartButton data={data}/>
                        )
                    }

                </div>

            </div>
        </Link>
    )
}

export default CardProduct