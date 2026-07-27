const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

const sendEmail = ({ to, subject, body }) => {
  const response = transporter.sendMail({
    from:process.env.SENDER_EMAIL,
    to,
    subject,
    body,
  });
};

module.exports=sendEmail