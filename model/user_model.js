const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  
  mobile: {
    type: Number,

  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
 aadharCardNo:{
    type:Number,
    required: true,
    unique:true,
 },
 password:{
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVoted: {
    type: Boolean,
    default: false,
  }
 
});

userSchema.pre("save", async function (next) {
  const user = this;

  //hash the password only if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    //hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword=async function (candidatePassword) {
    try{
        //use bcrypt to compare the provider password with the hased password

        const ismatch=await bcrypt.compare(candidatePassword,this.password);
        return ismatch;
    }
    catch(error){
        throw error;
    }
    
}
 


const User = mongoose.model("   User", userSchema);
module.exports = User;