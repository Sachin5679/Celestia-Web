import mongoose from "mongoose";

const attendantSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  mobile: { type: Number, unique: true },
  checked: Boolean,
  activities: Object,
});

const Attendant = mongoose.model("Attendant", attendantSchema);

export default Attendant;
