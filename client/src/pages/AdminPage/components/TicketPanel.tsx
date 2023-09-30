import { useState } from "react";
import admin from "../../../services/admin";
import { Attendant } from "../../../types/Data";

export default function TicketPanel(props: { id: string }) {
  const { id } = props;

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<Attendant>();

  async function loadData() {
    setLoading(true);
    setInfo(await admin.getTicketById(id));
  }

  return <section></section>;
}
