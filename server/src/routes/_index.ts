import express from "express";
import ticketRouter from "./ticket";
import authRouter from "./auth";
const router = express.Router();

router.use("/ticket", ticketRouter);
router.use("/auth", authRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
