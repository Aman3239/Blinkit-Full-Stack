import { response } from "express"
import AddressModel from "../models/address.model.js"
import UserModel from "../models/user.model.js"

export const addAddressController = async(request,response)=>{
    try {

        const userId = request.userId //middleware
        const {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        } = request.body

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId:userId
        })

        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push:{
                address_details:saveAddress._id
            }
        })
        return response.json({
            message:"Address Created Successfully",
            success:true,
            error:false,
            data:addUserAddressId

        })

    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}

export const getAddressController = async(request,response)=>{
    try {
        const userId = request.userId //middleware
        const data = await AddressModel.find({userId:userId}).sort({createdAt:-1})
        return response.json({
            data:data,
            message:"List od Address",
            error:false,
            success:true
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const updateAddressController = async(request,response)=>{
    try {
        const userId = request.userId // middleware
        const {
            _id,
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        } = request.body
        const updateAddress = await AddressModel.updateOne({_id:_id,userId:userId},{
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        })

        return response.json({
            message:"Address updated",
            error:false,
            success:true,
            data:updateAddress
        })
    } catch (error) {
        return response.state(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const deleteAddressController = async(request,response)=>{
    try {
        const userid = request.userId //auth middleware
        const {_id} = request.body

        const disableAddress = await AddressModel.updateOne({_id:_id,userId:userid},{
            status:false
        })

        return response.json({
            message:"Address removed",
            error:false,
            success:true,
            data:disableAddress
        })
    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

