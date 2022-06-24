import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false }, // when user login with google, password is not needed.
  googleId: { type: String, required: false }, // when user login with email & password, googleId is not needed.
  id: { type: String },
});

export default mongoose.model("User", userSchema);
