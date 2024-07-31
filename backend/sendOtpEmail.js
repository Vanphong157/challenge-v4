const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vanphong150703@gmail.com",
    pass: "dovc njil qhlw nkac",
  },
});

const sendOtpEmail = (to, otp) => {
  const mailOptions = {
    from: "vanphong150703@gmail.com",
    to: to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

module.exports = sendOtpEmail;
