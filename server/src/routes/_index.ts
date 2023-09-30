import express from "express";
import ticketRouter from "./ticket";
import { authorisedOnly } from "../middleware/auth";
const router = express.Router();

router.use("/ticket", ticketRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

router.get("/auth", authorisedOnly, (req, res) => {
  return res.status(200).send({ authorised: true });
});

export default router;
