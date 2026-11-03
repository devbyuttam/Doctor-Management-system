const PDFDocument = require("pdfkit");

const generatePrescriptionPdf = (prescription, doctor, patient, res) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(res);

  // Header
  doc.fontSize(20).text("HOSPITAL / CLINIC NAME", { align: "center" });
  doc.fontSize(10).text("123 Health Ave, Medical City", { align: "center" });
  doc.moveDown();

  // Doctor Info
  doc.fontSize(12).text(`Dr. ${doctor.userId.name}`, { align: "right" });
  doc.fontSize(10).text(`${doctor.specialization}`, { align: "right" });
  doc.moveDown();

  // Patient Info
  doc.fontSize(10).text(`Patient Name: ${patient.userId.name}`);
  doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Diagnosis
  doc.fontSize(12).text("Diagnosis:", { underline: true });
  doc.fontSize(10).text(prescription.diagnosis);
  doc.moveDown();

  // Medicines Table Header
  doc.fontSize(12).text("Medicines:", { underline: true });
  doc.moveDown(0.5);

  prescription.medicines.forEach((med, index) => {
    doc
      .fontSize(10)
      .text(
        `${index + 1}. ${med.name} - ${med.dosage} (${med.frequency}) for ${med.duration}`,
      );
    if (med.instructions) {
      doc
        .fontSize(9)
        .text(`   Instructions: ${med.instructions}`, { color: "gray" });
    }
    doc.moveDown(0.5);
  });

  // Notes
  if (prescription.additionalNotes) {
    doc.moveDown();
    doc.fontSize(12).text("Additional Notes:", { underline: true });
    doc.fontSize(10).text(prescription.additionalNotes);
  }

  // Footer / Signature
  doc.moveDown(4);
  doc
    .fontSize(10)
    .text("Doctor Signature ____________________", { align: "right" });

  doc.moveDown(2);
  doc
    .fontSize(8)
    .text("This is a computer generated document.", {
      align: "center",
      color: "gray",
    });

  doc.end();
};

module.exports = { generatePrescriptionPdf };
