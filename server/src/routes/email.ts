import express from "express";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import fs from "fs";
import path from "path";

function readHTMLFile(path: string, callback: Function) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
}

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const mail = fs.readFileSync(path.join(__dirname, "../assets/mail.html"));

router.post("/send-form", async (req, res) => {
  const { email } = req.query;

  if (!email) return res.sendStatus(400);

  const mailOptions: Mail.Options = {
    from: "celestia.iiitm@gmail.com",
    to: email.toString(),
    subject: "Celestia | Get your tickets",
    text: mail,
  };

  await transporter.sendMail(mailOptions).catch((err) => console.error(err));

  return res.sendStatus(200);
});

export default router;
