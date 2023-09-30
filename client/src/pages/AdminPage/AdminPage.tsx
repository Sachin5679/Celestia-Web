import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Panel from "./components/Panel";
import { getTokenFromLocalStorage } from "../../utils";
import admin, { setAdminKey } from "../../services/admin";
import { useLocation } from "react-router-dom";
import TicketPanel from "./components/TicketPanel";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("id");

  async function checkSessionKey() {
    const key = getTokenFromLocalStorage();
    if (key) {
      setLoading(true);
      setAdminKey(key);
      const valid = await admin.verify(key);
      if (!valid) {
        alert("Invalid Admin Key, pehle Kartik / Spandan se key lelo");
      }
      setAuthed(valid);
      setLoading(false);
    }
  }
  useEffect(() => {
    checkSessionKey();
  }, []);

  return (
    <div className="my-10">
      {loading ? (
        <>Loading</>
      ) : (
        <>
          {!authed && <Login setAuthed={setAuthed} />}
          {authed && !id && <Panel />}
          {authed && id && <TicketPanel id={id} />}
        </>
      )}
    </div>
  );
}
