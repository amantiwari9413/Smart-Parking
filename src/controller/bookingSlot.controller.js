import BookingSlot from "../model/bookingSlot.model.js";
import ParkingSlot from "../model/parkingSlot.model.js";
import ParkingArea from "../model/parkingArea.model.js";
import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import generateQR from "../utills/qrGenrator.js";
import path from "path";
import { __dirname } from "../utills/dotevUtils.js";
const createBookingSlot = asyncHandler(async (req, res) => {
  const { slotId, customerName, phoneNumber, vehicleNumber, parkingAreaId } = req.body;
  
  // Validate input data
  if (!slotId || !customerName || !phoneNumber || !vehicleNumber || !parkingAreaId) {
    throw new apiError("Missing required fields", 400);
  }
  
  // Find and check parking slot
  const parkingSlot = await ParkingSlot.findById(slotId);
  if (!parkingSlot) {
    throw new apiError("Parking slot not found", 400);
  }
  
  if (!parkingSlot.isAvailable) {
    throw new apiError("Parking slot is not available", 400);
  }
  
  // Mark slot as unavailable
  parkingSlot.isAvailable = false;
  await parkingSlot.save();
  
  // Create booking
  const bookingSlot = await BookingSlot.create({
    slotId, 
    customerName, 
    phoneNumber, 
    vehicleNumber, 
    parkingAreaId
  });
  
  // Generate QR code
  const url = `http://localhost:3000/booking/updateBooking?id=${bookingSlot.id}`;  // Better to use booking-specific URL
  const fileName = `${bookingSlot.id}.png`;
  const qrDir = path.join(__dirname, '..', '..', 'public', 'qr');
  const filePath = path.join(qrDir, fileName);
  try {
    await generateQR(url, fileName);
    return res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw new apiError("Error generating QR code", 500);
  }
});

const getAllBookingSlotByParkingAreaId = asyncHandler(async(req,res)=>{
    const {parkingAreaId} = req.query;
    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if(!parkingArea){
        throw new apiError("Parking area not found",400);
    }
    const bookingSlot = await BookingSlot.find({slotId:{$in:parkingArea.slotId}});
    return res.status(200).json(new apiResponse(200,bookingSlot,"Booking slot fetched successfully"));
})

const deleteBookingSlot = asyncHandler(async(req,res)=>{
    const {id} = req.query;
    const bookingSlot = await BookingSlot.findByIdAndDelete(id);
    if(!bookingSlot){
        throw new apiError("Booking slot not found",400);
    }
    const parkingSlot = await ParkingSlot.findById(bookingSlot.slotId);
    parkingSlot.isAvailable = true;
    await parkingSlot.save();
    return res.status(200).json(new apiResponse(200,bookingSlot,"Booking slot deleted successfully"));
})  

const updateBookingSlot = asyncHandler(async(req,res)=>{
  const {id} = req.query;
  
  const bookingSlot = await BookingSlot.findById(id);
  if(!bookingSlot){
      return res.status(400).json(new apiResponse(400, null, "Booking slot not found"));
  }

  // Check if parking area IDs match
  if(bookingSlot.parkingAreaId.toString() !== req.parkingarea._id.toString()){
      return res.status(403).json(new apiResponse(403, null, "You are not authorized to update this booking slot"));
  }
  
  // Check if the booking is already completed
  if(bookingSlot.status === 'completed'){
      return res.status(400).json(new apiResponse(400, null, "This booking is already completed"));
  }
  
  const parkingArea = await ParkingArea.findById(bookingSlot.parkingAreaId);
  if(!parkingArea){
      return res.status(400).json(new apiResponse(400, null, "Parking area not found"));
  }

  // Calculate hours parked
  const startTime = bookingSlot.createdAt;
  const endTime = new Date();
  const hoursParked = Math.ceil((endTime - startTime) / (1000 * 60 * 60)); 

  // Calculate total amount
  const totalAmount = hoursParked * parkingArea.pricePerHour;

  // Update booking status and save
  bookingSlot.status = 'completed';
  await bookingSlot.save();

  // Update parking slot availability
  const parkingSlot = await ParkingSlot.findById(bookingSlot.slotId);
  if(parkingSlot){
      parkingSlot.isAvailable = true;
      await parkingSlot.save();
  }

  // Include calculated amount in response
  const response = {
      bookingSlot,
      parkingDuration: hoursParked,
      totalAmount
  };

  return res.status(200).json(new apiResponse(200, response, "Booking slot updated successfully"));
})

export {updateBookingSlot,createBookingSlot,deleteBookingSlot,getAllBookingSlotByParkingAreaId}






