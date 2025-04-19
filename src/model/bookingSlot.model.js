import mongoose from 'mongoose';

const bookingSlotSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  parkingAreaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingArea',
    required: true
  },
  status: {
    type: String,
    enum: ['completed','pending'],
    default: 'pending'
  }
}, {
  timestamps: true
});
const BookingSlot = mongoose.model('BookingSlot', bookingSlotSchema);
export default BookingSlot;