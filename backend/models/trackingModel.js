import mongoose from "mongoose";

const trackingSchema = mongoose.Schema({
  trackingNumber: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  estimatedDeliveryDate: { type: Date },
  sender: {
    name: { type: String },
    address: { type: String },
    contact: { type: String },
  },
  recipient: {
    name: { type: String },
    address: { type: String },
    contact: { type: String },
  },
  weight: { type: Number },
  deliveryInstructions: { type: String },
});

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;
