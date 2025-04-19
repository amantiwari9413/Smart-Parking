import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createParkingArea, getAllParkingArea, deleteParkingArea,loginParkingArea, logoutParkingArea } from "../controller/parkingArea.controller.js";
const parkingAreaRouter= Router();

parkingAreaRouter.post('/create', createParkingArea);
parkingAreaRouter.get('/getAll', getAllParkingArea);
parkingAreaRouter.delete('/delete', deleteParkingArea);
parkingAreaRouter.route('/login').post(loginParkingArea)
parkingAreaRouter.route('/logout').post(verifyJWT,logoutParkingArea)

export default parkingAreaRouter;
