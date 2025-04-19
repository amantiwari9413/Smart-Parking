import ParkingSlot from "../model/parkingSlot.model.js";
import apiError from "../utills/apiError.js";
import apiResponse from "../utills/apiResponse.js";
import asyncHandler from "../utills/asyncHandler.js";
import ParkingArea from "../model/parkingArea.model.js";

const createParkingSlot = asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {slotNumber,isAvailable,parkingAreaId} = req.body;
    if(!slotNumber || !parkingAreaId || !isAvailable){
        throw new apiError("All fields are required",400);
    }

    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if(!parkingArea){
        throw new apiError("Parking area not found",400);
    }
    const parkingSlot = await ParkingSlot.create({slotNumber,isAvailable});
    if(!parkingSlot){
        throw new apiError("Parking slot not created",400);
    }
    parkingArea.slotId.push(parkingSlot._id);
    await parkingArea.save();
    return res.status(201).json(new apiResponse(200,parkingSlot,"parking slot Succesfully created") );
})              

const getAllParkingSlotByParkingAreaId = asyncHandler(async(req,res)=>{
    const {parkingAreaId} = req.query;
    const parkingArea = await ParkingArea.findById(parkingAreaId);
    if(!parkingArea){
        throw new apiError("Parking area not found",400);
    }
    const parkingSlot = await ParkingSlot.find({_id: {$in: parkingArea.slotId}});
    return res.status(200).json(new apiResponse(200,parkingSlot,"parking slot Succesfully fetched") );
})          

const deleteParkingSlot = asyncHandler(async(req,res)=>{
    const {id,parkingAreaId} = req.body;
    const parkingSlot = await ParkingSlot.findByIdAndDelete(id);
    if(!parkingSlot){
        throw new apiError("Parking slot not found",400);
    }
    const parkingArea = await ParkingArea.findById(parkingAreaId);
    parkingArea.slotId = parkingArea.slotId.filter(slot => slot._id.toString() !== id);
    await parkingArea.save();
    return res.status(200).json(new apiResponse(200,parkingSlot,"parking slot Succesfully deleted") );
})

const updateParkingSlot = asyncHandler(async(req,res)=>{
    const {id} = req.query;
    const {slotNumber,isAvailable} = req.body;
    const parkingSlot = await ParkingSlot.findByIdAndUpdate(id,{slotNumber,isAvailable});
    if(!parkingSlot){
        throw new apiError("Parking slot not found",400);
    }
    return res.status(200).json(new apiResponse(200,parkingSlot,"parking slot Succesfully updated") );
})

export {createParkingSlot,getAllParkingSlotByParkingAreaId,deleteParkingSlot,updateParkingSlot};
