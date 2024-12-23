import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import summaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/Axios.toastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/ValidURLConverter'
const ProductListPage = () => {
  const params = useParams()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalPage] = useState(1)
  const AllsubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatgory, setDisplaySubCategroy] = useState([])

  const subCategory = params?.subCategory?.split('-')
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(' ')


  const categoryId = params.category.split('-').slice(-1)[0]
  const subCategoryId = params.subCategory.split('-').slice(-1)[0]

  const fetchPorductData = async () => {


    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 10
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)

      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPorductData()
  }, [params])

  useEffect(() => {
    const sub = AllsubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })
      return filterData ? filterData : null

    })
    setDisplaySubCategroy(sub)
  }, [params, AllsubCategory])
  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24 mx-auto grid grid-cols-[80px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/* sub Category */}
        <div className=' min-h-[94vh] max-h-[94vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            DisplaySubCatgory.map((s, index) => {
              const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} className={`w-full p-2 bg-white lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b
                hover:bg-green-100 cursor-pointer
                ${subCategoryId === s._id ? "bg-green-100" : " "}`}>
                  <div className='w-fit mx-auto lg:mx-0 max-w-28 bg-white rounded box-border'>
                    <img src={s.image} alt="subCategory"
                      className='w-14 lg:w-12 lg:h-14 h-full object-scale-down'
                    />
                  </div>
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/* Product */}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>

            <div className='min-h-[86vh] max-h-[86vh] overflow-y-auto relative'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-4 gap-4'>
                {
                  data.map((p, index) => {
                    return (
                      <CardProduct data={p} key={p._id + "productSubCategory" + index} />
                    )
                  })
                }
              </div>
            </div>
            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage