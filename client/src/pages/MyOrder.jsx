import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DispalyPriceinRupees'


const MyOrder = () => {
  const orders = useSelector(state => state.orders.order)
  console.log("order", orders)
  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Order</h1>
      </div>
      {
        !orders[0] && (
          <NoData />
        )
      }
      {
        orders.map((order, index) => {
          return (
            <div key={order._id + index + "orders"} className='border rounded p-4  text-sm'>
              <p>Order No : {order?.orderId}</p>
              <div className=' flex justify-between items-center gap-2 my-2'>
                <div className='flex gap-3 items-center justify-center'>
                  <img src={order.product_details.image[0]}
                    className='w-14 h-14'
                    alt="" />
                  <p className='font-medium'>{order.product_details.name}</p>

                </div>
                <div className='font-semibold'>{DisplayPriceInRupees(order.subTotalAmt)}</div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrder