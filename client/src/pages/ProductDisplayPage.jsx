import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AxiosToastError from '../utils/Axios.toastError'
import Axios from '../utils/Axios'
import summaryApi from '../common/SummaryApi'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { DisplayPriceInRupees } from '../utils/DispalyPriceinRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'


const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: [],
  })
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)
  const imageConrainer = useRef()
  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageConrainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageConrainer.current.scrollLeft -= 100
  }
  console.log("data", data)
  return (
    <section className='container mx-auto p-4  grid lg:grid-cols-2'>
      {/* left part */}
      <div className=''>
        <div className='bg-white lg:min-h-[72vh] lg:max-h-[72vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img src={data.image[image]} alt=""
            className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img + index + 'point'} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageConrainer} className='flex gap-4 relative z-10 w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) => {
                return (
                  <div className='w-20 h-20 shadow-md min-h-20 min-w-20' key={img + index}>
                    <img src={img}
                      className='w-full h-full object-scale-down rounded cursor-pointer'
                      onClick={() => setImage(index)}
                      alt="min-product"
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full lg:flex hidden justify-between absolute h-full -ml-3 items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white p-1 relative rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className=" z-10 bg-white p-1 relative rounded-full shadow-lg">
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div className='my-4 hidden lg:grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => {
              return (
                <div>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* right Part */}
      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
        <p className=''>{data.unit}</p>

        <Divider />
        <div>
          <p className=''>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 rounded px-4 py-2 bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>
                {DisplayPriceInRupees(priceWithDiscount(data.price, data.discount))}
              </p>
            </div>
            {
              data.discount && (
                <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
              )
            }
            {
              data.discount && (
                <p className='font-bold text-green-600 lg:text-2xl'>{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
              )
            }
          </div>
        </div>
        {
          data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ) : (
            // <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
            <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
          )
        }

        <h2 className='font-bold'>Why shop from AkMart?</h2>

        <div>
          <div className='flex items-center gap-4 my-4'>
            <img src={image1}
              className='w-20 h-20'
              alt="superfast delivery"
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark store near you.</p>
            </div>
          </div>

          <div className='flex items-center gap-4 my-4'>
            <img src={image2}
              className='w-20 h-20'
              alt="Best Prices offers"
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturer.</p>
            </div>
          </div>

          <div className='flex items-center gap-4 my-4'>
            <img src={image3}
              className='w-20 h-20'
              alt="superfast delivery"
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food personal care, household & other category.</p>
            </div>
          </div>

        </div>
        {/* only for mobile */}
        <div className='my-4 grid gap-3 '>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => {
              return (
                <div>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage 