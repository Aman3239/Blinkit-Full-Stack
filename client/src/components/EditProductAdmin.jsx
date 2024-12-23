import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import summaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/Axios.toastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({close,data:propsData,fetchProductData}) => {
    const [data, setData] = useState({
        _id:propsData._id,
        name: propsData.name,
        image: propsData.image,
        category: propsData.category,
        subCategory:propsData.subCategory,
        unit: propsData.unit,
        stock: propsData.stock,
        price: propsData.price,
        discount: propsData.discount,
        description: propsData.description,
        more_details: propsData.more_details || {},
    })
    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageURl, setViewImageURL] = useState("")
    const allCategory = useSelector(state => state.product.allCategory)
    const [selectCategory, setSelectCategory] = useState("")
    const [selectSubCategory, setSelectSubCategory] = useState("")
    const allSubCategory = useSelector(state => state.product.allSubCategory)

    const [openAddField, setOpenAddField] = useState(false)
    const [fieldName, setFieldName] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        setImageLoading(true)
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        const imageUrl = ImageResponse.data.url
        setData((preve) => {
            return {
                ...preve,
                image: [...preve.image, imageUrl]

            }
        })
        setImageLoading(false)
    }

    const handleDeleteImage = async (index) => {
        data.image.splice(index, 1)
        setData((preve) => {
            return {
                ...preve
            }
        })
    }
    const handleRemoveCategory = async (index) => {
        data.category.splice(index, 1)
        setData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleRemoveSubCategory = async (index) => {
        data.subCategory.splice(index, 1)
        setData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleAddField = () => {
        setData((preve) => {
            return {
                ...preve,
                more_details: {
                    ...preve.more_details,
                    [fieldName]: ""
                }
            }
        })
        setFieldName("")
        setOpenAddField(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("data", data)
        try {
            const response = await Axios({
                ...summaryApi.updateProductDetails,
                data: data
            })
            const { data: responseData } = response
            if (responseData.success) {
                successAlert(responseData.message)
                if(close){
                    close()
                }
                fetchProductData()
                setData({
                    name: "",
                    image: [],
                    category: [],
                    subCategory: [],
                    unit: "",
                    stock: "",
                    price: '',
                    discount: "",
                    description: "",
                    more_details: {},
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-black z-50 bg-opacity-50 p-4'>
            <div className='bg-white w-full p-4 max-w-4xl mx-auto rounded overflow-y-auto h-full max-h-[100vh]'>

                <section>
                    <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                        <h2 className='font-semibold'>Update Product</h2>
                        <button onClick={close}>
                            <IoClose size={25}/>
                        </button>
                    </div>
                    <div className='grid p-3'>
                        <form action="" className='grid gap-4' onSubmit={handleSubmit}>
                            <div className='grid gap-1'>
                                <label htmlFor="name" className='font-medium'>Name</label>
                                <input
                                    type="text"
                                    id='name'
                                    placeholder='Enter product name'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                />
                            </div>

                            <div className='grid gap-1'>
                                <label htmlFor="description" className='font-medium'>Description</label>
                                <textarea
                                    type="text"
                                    id='description'
                                    placeholder='Enter product description'
                                    name='description'
                                    value={data.description}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                                />
                            </div>
                            <div>
                                <p className='font-medium'>Image</p>
                                <div>
                                    <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex items-center justify-center cursor-pointer'>
                                        <div className='text-center flex flex-col justify-center items-center'>
                                            {
                                                imageLoading ? <Loading /> : (
                                                    <>
                                                        <FaCloudUploadAlt size={35} />
                                                        <p>Upload Image</p>
                                                    </>
                                                )
                                            }
                                        </div>
                                        <input
                                            id='productImage'
                                            type="file"
                                            hidden
                                            accept='image/*'
                                            onChange={handleUploadImage}
                                        />

                                    </label>
                                    <div>
                                        {/* display Uploaded image */}
                                        <div className=' flex flex-wrap gap-4'>
                                            {
                                                data.image.map((img, index) => {
                                                    return (
                                                        <div key={img + index} className='h-20 w-20 mt-1 min-w-20 bg-blue-50 border relative group'>
                                                            <img src={img} alt={img}
                                                                className='w-full h-full object-scale-down cursor-pointer'
                                                                onClick={() => setViewImageURL(img)}
                                                            />
                                                            <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                                                <MdDelete />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='grid gap-1'>
                                <label className='font-medium'>Category</label>
                                <div>
                                    <select value={selectCategory} onChange={(e) => {
                                        const value = e.target.value
                                        const category = allCategory.find(el => el._id === value)
                                        setData((preve) => {
                                            return {
                                                ...preve,
                                                category: [...preve.category, category]
                                            }
                                        })
                                        setSelectCategory("")
                                    }} id=""
                                        className='bg-blue-50 border w-full p-2 rounded'>
                                        <option value="">Select Category</option>
                                        {
                                            allCategory.map((c, index) => {
                                                return (
                                                    <option value={c?._id}>{c.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className='flex flex-wrap gap-3'>
                                        {
                                            data.category.map((c, index) => {
                                                return (
                                                    <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                                                        <p>{c.name}</p>
                                                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                                                            <IoClose size={20} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-1'>
                                <label className='font-medium'>Sub Category</label>
                                <div>
                                    <select value={selectSubCategory} onChange={(e) => {
                                        const value = e.target.value
                                        const subCategory = allSubCategory.find(el => el._id === value)
                                        setData((preve) => {
                                            return {
                                                ...preve,
                                                subCategory: [...preve.subCategory, subCategory]
                                            }
                                        })
                                        setSelectSubCategory("")
                                    }} id=""
                                        className='bg-blue-50 border w-full p-2 rounded'>
                                        <option value="" className='text-neutral-600'>Select Sub Category</option>
                                        {
                                            allSubCategory.map((c, index) => {
                                                return (
                                                    <option value={c?._id}>{c.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className='flex flex-wrap gap-3'>
                                        {
                                            data.subCategory.map((c, index) => {
                                                return (
                                                    <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                                                        <p>{c.name}</p>
                                                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                                                            <IoClose size={20} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-1'>
                                <label htmlFor="unit" className='font-medium'>Unit</label>
                                <input
                                    type="text"
                                    id='unit'
                                    placeholder='Enter product unit'
                                    name='unit'
                                    value={data.unit}
                                    onChange={handleChange}
                                    required
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                />
                            </div>
                            <div className='grid gap-1'>
                                <label htmlFor="stock" className='font-medium'>Number of Stock</label>
                                <input
                                    type="number"
                                    id='stock'
                                    placeholder='Enter product stock'
                                    name='stock'
                                    value={data.stock}
                                    onChange={handleChange}
                                    required
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                />
                            </div>
                            <div className='grid gap-1'>
                                <label htmlFor="price" className='font-medium'>Price</label>
                                <input
                                    type="number"
                                    id='price'
                                    placeholder='Enter product price'
                                    name='price'
                                    value={data.price}
                                    onChange={handleChange}
                                    required
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                />
                            </div>
                            <div className='grid gap-1'>
                                <label htmlFor="discount" className='font-medium'>Discount</label>
                                <input
                                    type="number"
                                    id='discount'
                                    placeholder='Enter product discount'
                                    name='discount'
                                    value={data.discount}
                                    onChange={handleChange}
                                    required
                                    className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                />
                            </div>
                            {/* add more field  */}

                            {
                                Object?.keys(data?.more_details)?.map((k, index) => {
                                    return (
                                        <div className='grid gap-1'>
                                            <label htmlFor={k}>{k}</label>
                                            <input
                                                type="text"
                                                id={k}
                                                value={data?.more_details[k]}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    setData((preve) => {
                                                        return {
                                                            ...preve,
                                                            more_details: {
                                                                ...preve.more_details,
                                                                [k]: value
                                                            }
                                                        }
                                                    })
                                                }}
                                                required
                                                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                                            />
                                        </div>
                                    )
                                })
                            }

                            <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-800 cursor-pointer rounded'>
                                Add Fields
                            </div>
                            <button
                                className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
                            >Update Product</button>
                        </form>
                    </div>

                    {
                        viewImageURl && (
                            <ViewImage url={viewImageURl} close={() => setViewImageURL("")} />
                        )
                    }
                    {
                        openAddField && (
                            <AddFieldComponent close={() => setOpenAddField(false)}
                                value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                                submit={handleAddField}
                            />
                        )
                    }
                </section>

            </div>
        </section>
    )
}

export default EditProductAdmin








