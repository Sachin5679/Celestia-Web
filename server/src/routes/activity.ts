import express from "express";
import { Activity } from "../types/custom";
import { authorisedOnly } from "../middleware/auth";
import Attendant from "../models/Attendant";

const router = express.Router();

router.get("/list", async (req, res) => {
  const activities = Object.keys(Activity).map(
    (key) => Activity[key as keyof typeof Activity]
  );

  return res.status(200).send({ activities });
});

router.put("/count/:activity/up", authorisedOnly, async (req, res) => {
  const { activity } = req.params;

  if (
    !activity ||
    !Object.values(Activity).includes(activity as Activity) ||
    !req.query.id
  )
    return res.sendStatus(400);

  const exists = await Attendant.findOne({ id: req.query.id });

  if (!exists) return res.sendStatus(400);

  await Attendant.updateOne(
    { id: req.query.id },
    {
      $set: {
        activities: {
          ...exists.activities,
          [req.params.activity]: exists.activities[req.params.activity] + 1,
        },
      },
    }
  );

  const newA = await Attendant.findOne({ id: req.query.id });
  return res.status(200).send(newA);
});

export default router;
