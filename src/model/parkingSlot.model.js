import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  
});

export default mongoose.model('ParkingSlot', parkingSlotSchema); 