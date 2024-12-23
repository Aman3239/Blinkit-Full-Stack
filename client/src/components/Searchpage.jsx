import React, { useEffect, useState } from 'react'
import CardLoading from './CardLoading'
import AxiosToastError from '../utils/Axios.toastError'
import Axios from '../utils/Axios'
import summaryApi from '../common/SummaryApi'
import CardProduct from './CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const Searchpage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3) 


  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.searchProduct,
        data: {
          search: searchText,
          page:page,
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
        console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page,searchText])

  const handleFetchMore=()=>{
    if(totalPage > page){
      setPage(preve=>preve + 1)
    }
  }
  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Result:{data.length}</p>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-5 gap-4'>

            {
              data.map((p, index) => {
                return (
                  <CardProduct data={p} key={p._id + "searchproduct" + index} />
                )
              })
            }
     
            {/* loading dataa */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingSearchPage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>
        {
              //no Data
              !data[0] && !loading && (
                <div className='flex flex-col justify-center items-center w-full mx-auto'>
                  <img 
                  className='w-full h-full max-h-xs max-w-xs '
                  src={noDataImage} alt="" />
                  <p className='font-semibold my-2'>No Data found</p>
                </div>
              )
            }
      </div>
    </section>
  )
}

export default Searchpage