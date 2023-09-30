import express from "express";
import { Activity } from "../types/custom";

const router = express.Router();

router.get("/list", async (req, res) => {
  const activities = Object.keys(Activity).map(
    (key) => Activity[key as keyof typeof Activity]
  );

  return res.status(200).send({ activities });
});
