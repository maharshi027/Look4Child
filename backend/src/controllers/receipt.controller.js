import PDFDocument from "pdfkit";
import Donation from "../models/donation.models.js";

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

// Generate and stream the transaction receipt PDF matching Image 1
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

    // Set response headers to force download as a PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transaction_receipt_${donation.transactionId}.pdf`,
    );

    // Create a portrait A4 PDF document
    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
    });

    // Pipe PDF directly to response stream
    doc.pipe(res);

    const width = doc.page.width;
    const pageMargin = 54;
    const contentWidth = width - 2 * pageMargin;

    // --- TOP REFERENCE & DATE ---
    const receiptDateStr = getReceiptDateStr(donation.donationDate);
    
    doc
      .fillColor("#000000")
      .font("Times-Roman")
      .fontSize(10);
      
    // Write reference on left and date on right in the same line
    doc.text("45147/2025-26/L4C", pageMargin, 54, { continued: true });
    doc.text(receiptDateStr, { align: "right" });

    // --- TO ADDRESS BLOCK ---
    doc.moveDown(3);
    doc.font("Times-Roman").fontSize(10);
    doc.text("To,");
    doc.text(donation.donorName);
    doc.text(donation.donorAddress, { width: 300 });

    // --- SALUTATION ---
    doc.moveDown(2);
    doc.text("Dear Sir/Madam,");

    // --- LETTER BODY ---
    doc.moveDown(1.5);
    doc.text("This is to inform you that your donation has been successfully received.", {
      lineGap: 4
    });
    
    doc.moveDown(0.8);
    doc.text(
      "We at Look For Child Foundation show our absolute gratitude towards the donation made by you for saving a life of a child. Efforts made by you and us will surely bring bright change in one's life.",
      { lineGap: 4, width: contentWidth }
    );
    
    doc.moveDown(0.8);
    doc.text(
      "Thanks for being a part of our project JEEVAN. Indeed it feels great to be a reason for others smiles.",
      { lineGap: 4, width: contentWidth }
    );

    doc.moveDown(0.8);
    doc.text(
      "Further queries will be welcomed by Look For Child Foundation on the following contacts:-",
      { lineGap: 4, width: contentWidth }
    );

    // --- CONTACT DETAILS CENTER ---
    doc.moveDown(1.5);
    doc.text("You Can", { align: "center" });
    doc.text("Call us : +91-9899818585", { align: "center" });
    doc.text("Write us On: info@look4child.ngo", { align: "center" });
    doc.text("View us: www.look4child.ngo", { align: "center" });

    // --- WARM REGARDS ---
    doc.moveDown(2);
    doc.text("With Warm Regards,");
    doc.moveDown(1.5);
    doc.text("Team");
    doc.moveDown(1);
    doc.font("Times-Bold").text("Look For Child Foundation.");

    // --- DONATION DETAILS HEADER ---
    doc.moveDown(2.5);
    doc
      .font("Times-Bold")
      .fontSize(11)
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
      { label: "Amount", value: String(donation.amount) },
    ];

    // --- DRAW TABLE ---
    const tableStartY = doc.y + 15;
    let currentY = tableStartY;
    const col1Width = 180;
    const col2Width = contentWidth - col1Width;
    const cellPadding = 6;

    rows.forEach((row) => {
      // Calculate height required for text in columns to support wrapping
      const labelHeight = doc.heightOfString(row.label, {
        width: col1Width - 2 * cellPadding,
        font: "Times-Roman",
        fontSize: 10,
      });
      const valueHeight = doc.heightOfString(row.value, {
        width: col2Width - 2 * cellPadding,
        font: "Times-Roman",
        fontSize: 10,
      });
      const rowHeight = Math.max(22, Math.max(labelHeight, valueHeight) + 2 * cellPadding);

      // Draw top line for the row
      doc
        .lineWidth(0.5)
        .strokeColor("#D1D5DB")
        .moveTo(pageMargin, currentY)
        .lineTo(width - pageMargin, currentY)
        .stroke();

      // Write cell text
      doc.fillColor("#000000").font("Times-Roman").fontSize(10);
      doc.text(row.label, pageMargin + cellPadding, currentY + cellPadding, {
        width: col1Width - 2 * cellPadding,
      });
      doc.text(row.value, pageMargin + col1Width + cellPadding, currentY + cellPadding, {
        width: col2Width - 2 * cellPadding,
      });

      currentY += rowHeight;
    });

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
    doc.y = currentY + 15;
    doc
      .fillColor("#000000")
      .font("Times-Bold")
      .fontSize(10);

    doc.text("For: Look For Child Foundation.", pageMargin, currentY + 15, { continued: true });
    doc.text("PAN: AAAAL4939Q", { align: "right" });

    // --- DOWNLOAD CERTIFICATE LINK ---
    const appUrl = process.env.VITE_APP_URL || "http://localhost:5000";
    const certificateUrl = `${appUrl}/api/certificate/download-certificate/${donation._id}`;

    doc.y = currentY + 45;
    doc
      .fillColor("#0000FF")
      .font("Times-Roman")
      .fontSize(10);

    doc.text("Click here to print your certificate.", {
      align: "center",
      underline: true,
      link: certificateUrl,
    });

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
