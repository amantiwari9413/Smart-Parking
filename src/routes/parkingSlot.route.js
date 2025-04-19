import { Router } from "express";
import { createParkingSlot, getAllParkingSlotByParkingAreaId, deleteParkingSlot, updateParkingSlot } from "../controller/parkingSlot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const parkingSlotRouter = Router();

parkingSlotRouter.route('/create').post(verifyJWT,createParkingSlot);
parkingSlotRouter.route('/delete').delete(verifyJWT,deleteParkingSlot);
parkingSlotRouter.get('/getAllByParkingAreaId', getAllParkingSlotByParkingAreaId);

export default parkingSlotRouter;
