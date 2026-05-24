import Donation from "../models/donation.models.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  validateRequired,
  validateAmount,
  checkRecordExists,
  handleControllerError,
  ValidationError,
  BadRequestError,
} from "../utils/errorHandler.js";

// Initiate an online donation order
export const initiateOnline = async (req, res) => {
  const { name, email, phone, amount } = req.body || {};

  try {
    validateRequired({ name, email, amount }, ["name", "email", "amount"]);
    const numericAmount = validateAmount(amount);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isSimulation =
      !keyId || !keySecret || keyId === "" || keySecret === "";

    let order = null;
    let orderId = "";

    if (isSimulation) {
      orderId = "order_mock_" + Math.random().toString(36).substring(2, 15);
      order = {
        id: orderId,
        amount: Math.round(numericAmount * 100),
        currency: "INR",
        mock: true,
      };
    } else {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: Math.round(numericAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      order = await razorpay.orders.create(options);
      orderId = order.id;
    }

    const donation = new Donation({
      donorName: name,
      donorEmail: email,
      donorPhone: phone || "",
      amount: numericAmount,
      paymentMode: "ONLINE",
      paymentStatus: "PENDING",
      razorpayOrderId: orderId,
    });

    await donation.save();

    res.status(200).json({
      success: true,
      order,
      donationId: donation._id,
      simulation: isSimulation,
    });
  } catch (error) {
    handleControllerError(error, res, "Initiate Online Donation");
  }
};

// Verify the Razorpay payment signature
export const verifyOnline = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};

  try {
    if (!razorpay_order_id || !razorpay_payment_id) {
      throw new ValidationError("Payment parameters missing");
    }

    const isMock = razorpay_order_id.startsWith("order_mock_");

    if (isMock) {
      const donation = await Donation.findOne({
        razorpayOrderId: razorpay_order_id,
      });
      checkRecordExists(donation, "Donation");

      donation.paymentStatus = "SUCCESS";
      donation.razorpayPaymentId = razorpay_payment_id;
      donation.razorpaySignature = razorpay_signature || "mock_signature";
      await donation.save();

      return res.status(200).json({
        success: true,
        message: "Simulated donation verified successfully",
        donationId: donation._id,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const donation = await Donation.findOne({
        razorpayOrderId: razorpay_order_id,
      });
      checkRecordExists(donation, "Donation");

      donation.paymentStatus = "SUCCESS";
      donation.razorpayPaymentId = razorpay_payment_id;
      donation.razorpaySignature = razorpay_signature;
      await donation.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        donationId: donation._id,
      });
    }

    const donation = await Donation.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (donation) {
      donation.paymentStatus = "FAILED";
      await donation.save();
    }

    throw new BadRequestError("Invalid payment signature");
  } catch (error) {
    handleControllerError(error, res, "Verify Online Payment");
  }
};

// Record cash donation
export const recordCash = async (req, res) => {
  const { name, email, phone, amount } = req.body || {};

  try {
    validateRequired({ name, email, amount }, ["name", "email", "amount"]);
    const numericAmount = validateAmount(amount);

    const donation = new Donation({
      donorName: name,
      donorEmail: email,
      donorPhone: phone || "",
      amount: numericAmount,
      paymentMode: "CASH",
      paymentStatus: "SUCCESS",
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: "Cash donation recorded successfully",
      donationId: donation._id,
    });
  } catch (error) {
    handleControllerError(error, res, "Record Cash Donation");
  }
};

// Retrieve all donation history
export const getAllRecords = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    handleControllerError(error, res, "Fetch All Donation Records");
  }
};

// Update donor record details
export const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    donorName,
    donorEmail,
    donorPhone,
    amount,
    paymentMode,
    paymentStatus,
  } = req.body || {};

  try {
    const donation = await Donation.findById(id);
    checkRecordExists(donation, "Donation");

    if (donorName) donation.donorName = donorName;
    if (donorEmail) donation.donorEmail = donorEmail;
    if (donorPhone !== undefined) donation.donorPhone = donorPhone;
    if (amount) donation.amount = validateAmount(amount);
    if (paymentMode) donation.paymentMode = paymentMode;
    if (paymentStatus) donation.paymentStatus = paymentStatus;

    await donation.save();

    res.status(200).json({
      success: true,
      message: "Donation record updated successfully",
      donation,
    });
  } catch (error) {
    handleControllerError(error, res, "Update Donation Record");
  }
};

// Delete donor record
export const deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Donation.findByIdAndDelete(id);
    checkRecordExists(result, "Donation");

    res.status(200).json({
      success: true,
      message: "Donation record deleted successfully",
    });
  } catch (error) {
    handleControllerError(error, res, "Delete Donation Record");
  }
};
