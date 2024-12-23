

import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import summaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/Axios.toastError';

const EditSubCategory = ({ close,data,fetchdata }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id:data._id,
        name:data.name,
        image:data.image,
        category:data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)


    const handleChange = (e) => {
        const { name, value } = e.target
        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setSubCategoryData((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })
    }

    const handleRemoveCategorySelected = (categoryId) => {
        const index = subCategoryData.category.findIndex(el => el._id === categoryId)
        subCategoryData.category.splice(index, 1)
        setSubCategoryData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.updateSubCategory,
                data: subCategoryData
            })

            const { data: responseData } = response
            console.log("responseData",responseData)
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                if(fetchdata){
                    fetchdata()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    console.log("subCategory data", subCategoryData)
    return (
        <section className='fixed right-0 bottom-0 top-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-5xl bg-white p-4 rounded'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Edit Sub Category</h1>
                    <button onClick={close}><IoClose size={25} /></button>
                </div>
                <form action="" onSubmit={handleSubmitSubCategory} className='my-3 grid gap-3'>
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name</label>
                        <input
                            id='name'
                            type="text"
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            placeholder='Enter name'
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col gap-3 lg:flex-row items-center'>
                            <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-400'>No Image</p>
                                    ) : (
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-scale-down'
                                        />
                                    )
                                }
                            </div>
                            <label htmlFor="uploadSubCategoryImage">
                                <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-800 cursor-pointer'>
                                    Upload Image
                                </div>
                            </label>
                            <input
                                type="file"
                                id='uploadSubCategoryImage'
                                className='hidden'
                                onChange={handleUploadSubCategoryImage}
                            />
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="">Select Category</label>
                        <div className='border focus-within:border-primary-200 rounded'>
                            {/* display vlue */}

                            <div className='flex flex-wrap gap-2 '>
                                {
                                    subCategoryData.category.map((cat, index) => {
                                        return (
                                            <p className='bg-white shadow-md px-1 m-1 flex items-center gap-2 ' key={cat._id + "selectedValue"}>{cat.name}
                                                <div className='cursor-pointer hover:text-red-600' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={20} />
                                                </div>
                                            </p>
                                        )
                                    })
                                }
                            </div>

                            {/* select category */}
                            <select
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}
                                className='w-full p-2 bg-transparent outline-none border'>
                                <option value="">Select Category</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <button className={`px-4 py-2 border
                        ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-primary-200" : "bg-gray-200"}
                        font-semibold hover:bg-primary-100 
                        `}>
                        Submit
                    </button>

                </form>
            </div>
        </section>
    )
}

export default EditSubCategory