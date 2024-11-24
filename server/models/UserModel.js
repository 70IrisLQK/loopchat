import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required."],
    unique: true,
    min: 6,
    max: 50,
  },
  password: {
    type: String,
    required: [true, "Password is Required."],
    min: 6,
    max: 50,
  },
  firstName: {
    type: String,
    required: false,
    min: 6,
    max: 50,
  },
  lastName: {
    type: String,
    required: false,
    min: 6,
    max: 50,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

const User = mongoose.model("Users", userSchema);

export default User;
