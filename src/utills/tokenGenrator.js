import ApiError from "./apiError.js";

const generateAccessTokenAndRefereshToken = async function(parkingArea) {
    try {
        const accessToken = parkingArea.generateAccessToken();
        const refreshToken = parkingArea.generateRefreshToken();

        parkingArea.refreshToken = refreshToken;
        await parkingArea.save({ validateBeforeSave: false });
        
        const ParkingAreaData = {
            parkingArea_id: parkingArea._id,
            ParkingAreaName: parkingArea.name,
            contactNumber: parkingArea.contactNumber
        };
        
        return { accessToken, refreshToken, ParkingAreaData };
        
    } catch (error) {
        throw new ApiError(400, error.message);
    }
};

export { generateAccessTokenAndRefereshToken };