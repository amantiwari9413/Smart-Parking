import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const parkingAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    require:true,
  },
  slotId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: false
  }],
  refreshToken:{type:String},
}, {
  timestamps: true
});



parkingAreaSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();
  this.password=await bcrypt.hash(this.password,10);
  next();
})

parkingAreaSchema.methods.isPasswordCorrect= async function (password) {
return await bcrypt.compare(password,this.password)
}


parkingAreaSchema.methods.generateAccessToken=function(){
return jwt.sign({
  _id:this._id,
  name:this.name,
  contactNumber:this.contactNumber,
},
process.env.ACCESS_TOKEN_SECRET,
{
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
}
)
}

parkingAreaSchema.methods.generateRefreshToken=function(){
return jwt.sign({
  _id:this._id,
},
process.env.REFRESH_TOKEN_SECRET,
{
  expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
)
}


const ParkingArea = mongoose.model('ParkingArea', parkingAreaSchema);
export default ParkingArea;
