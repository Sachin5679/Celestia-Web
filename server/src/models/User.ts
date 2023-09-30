import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
  checked: Boolean,
  activities: Object,
});

const User = mongoose.model("User", userSchema);

export default User;
