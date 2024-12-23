import {Router} from "express"
import auth from "../middleware/auth.js"
import { addAddressController, deleteAddressController, getAddressController, updateAddressController } from "../controller/address.contoller.js"
const addressRounter = Router()
addressRounter.post("/create",auth,addAddressController)
addressRounter.get("/get",auth,getAddressController)
addressRounter.put("/update",auth,updateAddressController)
addressRounter.delete('/disable',auth,deleteAddressController)
export default addressRounter