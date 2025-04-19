import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import parkingAreaRouter from "./routes/parkingArea.route.js";
import parkingSlotRouter from "./routes/parkingSlot.route.js";
import bookingSlot from "./routes/bookingSlot.route.js";
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

app.use("/parkingArea",parkingAreaRouter);
app.use("/parkingSlot",parkingSlotRouter);
app.use("/booking",bookingSlot)
export default app;