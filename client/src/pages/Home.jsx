import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/ValidURLConverter'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectPorductListPage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })
      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
    console.log(url)

  }

  return (
    <section className='bg-white'>
      <div className=' container mx-auto '>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2"} `}>
          <img
            src={banner}
            alt="banner"
            className='h-full w-full hidden lg:block '
          />
          <img
            src={bannerMobile}
            alt="banner"
            className='h-full w-full lg:hidden '
          />
        </div>

      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(20).fill(null).map((c, index) => {
              return (
                <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2  shadow-sm animate-pulse'>
                  <div className='bg-blue-100 min-h-24 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={cat._id + "displayCategory"} className='h-full w-full' onClick={() => handleRedirectPorductListPage(cat._id, cat.name)}>
                  <div>
                    <img
                      src={cat.image}
                      className='w-full h-full object-scale-down'
                      alt="" />
                  </div>
                </div>
              )
            })

          )

        }
      </div>

      {/* diplay category product */}
      {
        categoryData.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay key={c?._id+"CategoryWiseProduct"} id={c?._id} name={c?.name}/>
          )
        })
      }
    </section >
  )
}

export default Home