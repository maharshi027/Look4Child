import PDFDocument from "pdfkit";
import Donation from "../models/donation.models.js";
import { fileURLToPath } from "url";
import path from "path";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const letterheadPath = path.join(__dirname, "../assets/letterhead.jpg");

// Helper to format date as DD-MMM-YYYY (e.g. 10-Jun-2026)
const getReceiptDateStr = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper to format date as DD-MM-YYYY (e.g. 10-06-2026)
const getTableDateStr = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper to calculate the sequential receipt serial number
export const getReceiptSerialNumber = async (donation) => {
  const count = await Donation.countDocuments({
    createdAt: { $lt: donation.createdAt },
  });
  const baseNumber = 45147;
  const serialNo = baseNumber + count;

  // Financial year calculation
  const date = new Date(donation.donationDate);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed, so April is 3
  let fy = "";
  if (month >= 3) { // April or later
    fy = `${year}-${String(year + 1).slice(-2)}`;
  } else {
    fy = `${year - 1}-${String(year).slice(-2)}`;
  }
  return `${serialNo}/${fy}/L4C`;
};

// Extracted PDF drawing function to allow reuse
export const generateReceiptPDF = async (doc, donation) => {
  const width = doc.page.width;
  const height = doc.page.height;
  const pageMargin = 45;
  const contentWidth = width - 2 * pageMargin;

  // --- DRAW BACKGROUND LETTERHEAD ---
  doc.image(letterheadPath, 0, 0, { width, height });

  // --- TOP REFERENCE & DATE ---
  const receiptDateStr = getReceiptDateStr(donation.donationDate);
  const serialNumber = await getReceiptSerialNumber(donation);
  const refY = 130;
  
  doc
    .fillColor("#000000")
    .font("Times-Roman")
    .fontSize(9.5);
    
  // Write reference on left and date on right in the same line below the letterhead line
  doc.text(serialNumber, pageMargin, refY, { continued: true });
  doc.text(receiptDateStr, { align: "right" });

  // --- TO ADDRESS BLOCK ---
  doc.y = refY + 20;
  doc.font("Times-Roman").fontSize(9.5);
  doc.text("To,");
  doc.text(donation.donorName);
  doc.text(donation.donorAddress, { width: 300 });

  // --- SALUTATION ---
  doc.y = doc.y + 12;
  doc.text("Dear Sir/Madam,");

  // --- LETTER BODY ---
  doc.y = doc.y + 10;
  doc.text("This is to inform you that your donation has been successfully received.", {
    lineGap: 3
  });
  
  doc.moveDown(0.5);
  doc.text(
    "We at Look4Child Foundation show our absolute gratitude towards the donation made by you for saving a life of a child. Efforts made by you and us will surely bring bright change in one's life.",
    { lineGap: 3, width: contentWidth }
  );
  
  doc.moveDown(0.5);
  doc.text(
    "Thanks for being a part of our project JEEVAN. Indeed it feels great to be a reason for others smiles.",
    { lineGap: 3, width: contentWidth }
  );

  doc.moveDown(0.5);
  doc.text(
    "Further queries will be welcomed by Look For Child Foundation on the following contacts:-",
    { lineGap: 3, width: contentWidth }
  );
  // --- WARM REGARDS ---
  doc.moveDown(0.8);
  doc.text("With Warm Regards,", pageMargin);
  doc.text("Team ", { continued: true });
  doc.font("Times-Bold").text("Look For Child Foundation.");

  // --- DONATION DETAILS HEADER ---
  doc.moveDown(1.2);
  doc
    .font("Times-Bold")
    .fontSize(10)
    .text("Donation Details", { align: "center", underline: true });

  // Format donation number to match Image 1 L4C-[uniqueCode]
  let donationNumber = donation.transactionId;
  if (donationNumber && donationNumber.startsWith("TXN")) {
    donationNumber = donationNumber.substring(3);
  }
  if (donationNumber && !donationNumber.startsWith("L4C-")) {
    donationNumber = `L4C-${donationNumber}`;
  }

  const tableDateStr = getTableDateStr(donation.donationDate);
  const donationStatus = donation.paymentStatus === "SUCCESS" ? "Paid" : donation.paymentStatus;

  // Table rows data
  const rows = [
    { label: "Donation Number:", value: donationNumber },
    { label: "Donation Date:", value: tableDateStr },
    { label: "Donation Status:", value: donationStatus },
    { label: "Recieved with thanks from", value: donation.donorName },
    { label: "Address", value: donation.donorAddress },
    { label: "E-mail:", value: donation.donorEmail },
    { label: "Pan No.", value: donation.panNo || "" },
    { label: "Phone Number:", value: donation.donorPhone },
    { label: "Payment Mode:", value: (donation.gatewayName || donation.paymentMode || "CASH").toUpperCase() },
    { label: "Reference Number:", value: donation.transactionId || "N/A" },
    { label: "Amount", value: `INR ${donation.amount}/-` },
  ];

  // --- DRAW TABLE ---
  const tableStartY = doc.y + 8;
  let currentY = tableStartY;
  const col1Width = 180;
  const col2Width = contentWidth - col1Width;
  const cellPadding = 4.5;

  for (const row of rows) {
    // Calculate height required for text in columns to support wrapping
    const labelHeight = doc.heightOfString(row.label, {
      width: col1Width - 2 * cellPadding,
      font: "Times-Roman",
      fontSize: 9,
    });
    const valueHeight = doc.heightOfString(row.value, {
      width: col2Width - 2 * cellPadding,
      font: "Times-Roman",
      fontSize: 9,
    });
    const rowHeight = Math.max(18, Math.max(labelHeight, valueHeight) + 2 * cellPadding);

    // Draw top line for the row
    doc
      .lineWidth(0.5)
      .strokeColor("#D1D5DB")
      .moveTo(pageMargin, currentY)
      .lineTo(width - pageMargin, currentY)
      .stroke();

    // Write cell text
    doc.fillColor("#000000").font("Times-Roman").fontSize(9);
    doc.text(row.label, pageMargin + cellPadding, currentY + cellPadding, {
      width: col1Width - 2 * cellPadding,
    });
    doc.text(row.value, pageMargin + col1Width + cellPadding, currentY + cellPadding, {
      width: col2Width - 2 * cellPadding,
    });

    currentY += rowHeight;
  }

  // Draw bottom table boundary line
  doc
    .lineWidth(0.5)
    .strokeColor("#D1D5DB")
    .moveTo(pageMargin, currentY)
    .lineTo(width - pageMargin, currentY)
    .stroke();

  // Draw outer boundary rectangle
  doc
    .lineWidth(0.5)
    .strokeColor("#9CA3AF")
    .rect(pageMargin, tableStartY, contentWidth, currentY - tableStartY)
    .stroke();

  // Draw vertical cell division line
  doc
    .lineWidth(0.5)
    .strokeColor("#D1D5DB")
    .moveTo(pageMargin + col1Width, tableStartY)
    .lineTo(pageMargin + col1Width, currentY)
    .stroke();

  // --- TABLE FOOTER (For / PAN) ---
  doc.y = currentY + 10;
  doc
    .fillColor("#000000")
    .font("Times-Bold")
    .fontSize(9.5);

  doc.text("For: Look4Child Foundation.", pageMargin, currentY + 10, { continued: true });
  doc.text("PAN: AAAAL4939Q", { align: "right" });
};

// Generate and stream the transaction receipt PDF
export const downloadTransactionReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation record not found",
      });
    }

    const cleanDonorName = donation.donorName.replace(/[^a-zA-Z0-9]/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Donation Receipt_${cleanDonorName}.pdf"`,
    );

    // Create a portrait A4 PDF document
    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margins: { top: 30, bottom: 30, left: 45, right: 45 },
    });

    // Pipe PDF directly to response stream
    doc.pipe(res);

    // Draw the receipt content
    await generateReceiptPDF(doc, donation);

    // End Document stream
    doc.end();
  } catch (error) {
    console.error("Receipt Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate transaction receipt",
      error: error.message,
    });
  }
};

// Create transporter for sending emails using SMTP credentials
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || process.env.ADMIN_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.ADMIN_PASSWORD;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

// Generate and email the receipt to the donor
export const emailTransactionReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation record not found",
      });
    }

    // Generate the PDF into a buffer
    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margins: { top: 30, bottom: 30, left: 45, right: 45 },
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));
    });

    // Draw the PDF receipt
    await generateReceiptPDF(doc, donation);
    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    // Create transporter
    const transporter = createTransporter();

    const cleanDonorName = donation.donorName.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Donation Receipt_${cleanDonorName}.pdf`;

    // Mail options
    const mailOptions = {
      from: `Look For Child Foundation <${process.env.SMTP_USER || process.env.ADMIN_EMAIL}>`,
      to: donation.donorEmail,
      subject: `Donation Receipt - Look For Child Foundation`,
      text: `Dear ${donation.donorName},

Thank you for your generous contribution of INR ${donation.amount}/- to Look For Child Foundation.

Please find attached your donation transaction receipt.

With Warm Regards,
Team Look For Child Foundation.`,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Receipt emailed successfully to donor",
    });
  } catch (error) {
    console.error("Email Receipt Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to email donation receipt",
      error: error.message,
    });
  }
};
