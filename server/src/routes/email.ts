import express from "express";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import fs from "fs";
import path from "path";

function readHTMLFile(
  path: string,
  callback?: (arg0: Error | null, arg1: string | null) => void
) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback && callback(err, "");
    } else {
      callback && callback(null, html);
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

let mail = "mailto";

readHTMLFile(path.join(__dirname, "../assets/mail.html"), (err, html) => {
  if (err) console.error(err);
  if (html) mail = html;
});

router.post("/send-form", async (req, res) => {
  const { email } = req.query;

  if (!email) return res.sendStatus(400);

  const mailOptions: Mail.Options = {
    from: "celestia.iiitm@gmail.com",
    to: email.toString(),
    subject: "Celestia | Get your tickets",
    text: "For clients with plaintext support only",
    html: mail,
    amp: mail,
  };

  await transporter.sendMail(mailOptions).catch((err) => console.error(err));

  return res.sendStatus(200);
});

export default router;
