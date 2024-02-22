import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

const user = mongoose.model("user", userSchema);

export default user;
