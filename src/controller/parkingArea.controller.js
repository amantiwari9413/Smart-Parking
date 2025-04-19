import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import ParkingArea from "../model/parkingArea.model.js"
import {generateAccessTokenAndRefereshToken} from "../utills/tokenGenrator.js"

const createParkingArea = asyncHandler(async(req,res)=>{
    console.log(req);
    const {name,contactNumber,pricePerHour,location,city,password}=req.body;

    if(!name || !contactNumber || !pricePerHour || !location || !city || !password){
        throw new apiError("All fields are required",400);
    }
    const parkingArea = await ParkingArea.create({name,contactNumber,pricePerHour,location,city,password});
    if(!parkingArea){
        throw new apiError("Parking area not created",400);
    }
    return res.status(201).json(new apiResponse(200,parkingArea,"parking area Succesfully created") );
})

const getAllParkingArea = asyncHandler(async(req,res)=>{
    const parkingArea = await ParkingArea.find().select('name location city pricePerHour contactNumber');
    if(!parkingArea){
        throw new apiError("Parking area not found",400);
    }
    return res.status(200).json(new apiResponse(200,parkingArea,"parking area Succesfully fetched") );
})

const deleteParkingArea = asyncHandler(async(req,res)=>{
    const {id} = req.query;
    const parkingArea = await ParkingArea.findByIdAndDelete(id);
    if(!parkingArea){
        throw new apiError("Parking area not found",400);
    }
    return res.status(200).json(new apiResponse(200,parkingArea,"parking area Succesfully deleted") );
})

const loginParkingArea = asyncHandler(async(req, res) => {
    console.log(req.body)
    const {contactNumber, password} = req.body;
    
    if(!contactNumber) {
        throw new apiError(400, "Please provide contact number");
    }
    
    // Use ParkingArea model instead of User
    const parkingAreaExist = await ParkingArea.findOne({ contactNumber });
    
    if(!parkingAreaExist) {
        throw new apiError(404, "Parking area does not exist");
    }
    
    const isPasswordValid = await parkingAreaExist.isPasswordCorrect(password);
    
    if(!isPasswordValid) {
        throw new apiError(401, "Password is incorrect");
    }
    
    // Generate tokens
    const { accessToken, refreshToken, ParkingAreaData } = await generateAccessTokenAndRefereshToken(parkingAreaExist);
    const options = {
        httpOnly: true,
        secure: true
    };
    
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                    ParkingAreaData
                },
                "Login successful"
            )
        );
});

const logoutParkingArea= asyncHandler(async (req,res,next)=>{
    await ParkingArea.findByIdAndUpdate(
        req.parkingarea._id,
        {
            $set:{
                refreshToken:undefined 
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200,{},"User logged Out"))
});

export {createParkingArea,getAllParkingArea,deleteParkingArea,loginParkingArea,logoutParkingArea};
