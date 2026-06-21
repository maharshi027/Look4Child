import dotenv from "dotenv";
import mongoose from "mongoose";
import { sendHtmlReceiptEmailInternal } from "./src/controllers/receipt.controller.js";
import Donation from "./src/models/donation.models.js";

dotenv.config();

const run = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected successfully!");

  // Find the last recorded cash donation
  const donation = await Donation.findOne({ paymentMode: "CASH" }).sort({ createdAt: -1 });
  if (!donation) {
    console.error("No donations found in database.");
    process.exit(1);
  }

  console.log("Found donation:", {
    _id: donation._id,
    donorName: donation.donorName,
    donorEmail: donation.donorEmail,
    paymentMode: donation.paymentMode,
    amount: donation.amount
  });

  console.log("Attempting to send email...");
  try {
    await sendHtmlReceiptEmailInternal(donation);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email sending failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
};

run().catch(console.error);
