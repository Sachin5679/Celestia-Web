import express from "express";
import { authorisedOnly } from "../middleware/auth";
import Attendant from "../models/Attendant";
import { generateRandomString, getDefaultActivities } from "../utils";
const router = express.Router();

router.post("/", authorisedOnly, async (req, res) => {
  if (!req.body.name || !req.body.mobile) return res.sendStatus(400);

  const preExisting = await Attendant.findOne({ mobile: req.body.mobile });

  if (preExisting) return res.status(200).send(preExisting);

  let newId = generateRandomString(7);
  while (await Attendant.findOne({ id: newId })) {
    newId = generateRandomString(7);
  }

  const newUser = await Attendant.create({
    name: req.body.name,
    mobile: req.body.mobile,
    activities: getDefaultActivities(),
    id: newId,
  });

  return res.status(200).send(newUser);
});

router.get("/:id", authorisedOnly, async (req, res) => {
  if (!req.params.id) return res.sendStatus(400);

  const ticket = await Attendant.findOne({ id: req.params.id.toLowerCase() });

  if (!ticket) return res.sendStatus(404);

  return res.status(200).send(ticket);
});

export default router;
