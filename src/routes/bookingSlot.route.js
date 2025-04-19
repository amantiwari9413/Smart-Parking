import { Router } from "express";
import {updateBookingSlot,createBookingSlot,getAllBookingSlotByParkingAreaId}
from "../controller/bookingSlot.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const bookingSlot= Router();

bookingSlot.post('/createBooking',createBookingSlot);
bookingSlot.route('/updateBooking').post(verifyJWT,updateBookingSlot);
bookingSlot.get('/getAllBooking',getAllBookingSlotByParkingAreaId)


export default bookingSlot