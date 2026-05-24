import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    donorPhone: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMode: {
      type: String,
      enum: ["CASH", "ONLINE"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
