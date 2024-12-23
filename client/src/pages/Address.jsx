import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAdress from '../components/AddAdress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import summaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/Axios.toastError';
import { useGlobalContext } from '../provider/GlobalProvider';



const Address = () => {
  const addressList = useSelector(state => state.address.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit,setOpenEdit]=useState(false)
  const [editData,setEditData]=useState({})
  const {fetchAddress}=useGlobalContext()

  const handleDisableAddress = async(id)=>{
    try{
      const response =await Axios({
        ...summaryApi.disableAddress,
        data:{
          _id:id
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success("Address Remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    }catch(error){
      AxiosToastError(error)
    }
  }
  return (
    <div className=''>
      <div className='bg-white shadow-lg px-2 py-2 flex justify-between items-center gap-4'>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
        <button onClick={() => setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 py-1 rounded-full hover:bg-primary-200 hover:text-black'>
          Add Address
        </button>
      </div>
      <div className='bg-blue-50 p-2 grid gap-4'>
        {
          addressList.map((address, index) => {
            return (
              <div className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`}>
                <div className='w-full'>
                  <p>{address.address_line}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>{address.country} - {address.pincode}</p>
                  <p>{address.mobile}</p>
                </div>
                <div className='grid gap-10'>
                  <button onClick={()=>{
                    setOpenEdit(true)
                    setEditData(address)
                  }} className='bg-green-200 p-1 rounded hover:text-white hover:bg-green-600'>
                    <MdEdit />
                  </button>
                  <button onClick={()=>{
                    handleDisableAddress(address._id)
                  }} className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'>
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>

            )
          })
        }

        <div onClick={() => setOpenAddress(true)} className='h-20 flex items-center justify-center bg-blue-50 border-2 border-dashed cursor-pointer'>
          Add address
        </div>
      </div>
      {
        openAddress && (
          <AddAdress close={() => setOpenAddress(false)} />
        )
      }
      {
        openEdit && (
          <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
        )
      }
    </div>
  )
}

export default Address