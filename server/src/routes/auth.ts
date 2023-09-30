import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/validate", (req, res) => {
  const { token } = req.query;

  if (typeof token != "string") return res.send({ valid: false });

  jwt.verify(token, process.env.KEY, {}, (err, _) => {
    if (err) return res.send({ valid: false });
  });

  return res.status(200).send({ valid: true });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const valid =
    username == process.env.ADMIN_USERNAME &&
    password == process.env.ADMIN_PASSWORD;

  if (!valid) {
    return res.sendStatus(401);
  }

  const admin = { access: process.env.KEY };

  const accessToken = jwt.sign(admin, process.env.KEY, {
    expiresIn: "1h",
  });

  res.status(201).json({ accessToken: accessToken });
});

export default router;
