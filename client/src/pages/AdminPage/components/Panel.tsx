import React, { useRef, useState } from "react";
import { Attendant } from "../../../types/Data";
import admin from "../../../services/admin";
import TicketGenerator from "./TicketGenerator";

export default function Panel() {
  const newNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const newMobileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const oldIdRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [oldTicket, setOldTicket] = useState<Attendant>();
  const [loading, setLoading] = useState(false);
  const [newId, setNewId] = useState<string>();
  const [newMobile, setNewMobile] = useState<string>("");

  async function getOldTicketInfo() {
    setLoading(true);
    setOldTicket(undefined);
    try {
      const ticketInfo = await admin.getTicketById(oldIdRef.current.value);
      if (ticketInfo.name && ticketInfo.id && ticketInfo.mobile) {
        setOldTicket(ticketInfo);
      } else {
        alert("Unable to get ticket info. check id");
      }
    } catch {
      alert("Something went wrong");
      location.reload();
    }
    setLoading(false);
  }

  async function mintNewTicket() {
    setLoading(true);
    const name = newNameRef.current.value;
    const mobile = newMobileRef.current.value;

    if (name.length > 3 && mobile.length == 10) {
      const ticket = await admin.newTicket(Number(mobile), name);
      setNewId(ticket.id);
      setNewMobile(ticket.mobile.toString());
    } else {
      alert("name atleast 3 letters and 10 digit mobile number");
    }
    setLoading(false);
  }

  return (
    <section className="p-page my-10 flex flex-col gap-y-5 items-center">
      <h1 className="font-celestial font-black">New Ticket</h1>
      {!newId && (
        <>
          <input
            type="text"
            ref={newNameRef}
            className="w-1/2 mobile:w-full bg-transparent border rounded-md p-2 bg-blue-300 bg-opacity-5"
            placeholder="name"
          />
          <input
            type="text"
            ref={newMobileRef}
            className="w-1/2 mobile:w-full bg-transparent border rounded-md p-2 bg-blue-300 bg-opacity-5"
            placeholder="mobile"
          />
          <button
            className="bg-blue-500 rounded-md w-1/2 mobile:w-full py-2 disabled:animate-pulse disabled:opacity-75 disabled:cursor-progress"
            disabled={loading}
            onClick={() => mintNewTicket()}
          >
            Mint
          </button>
        </>
      )}
      {newId && <TicketGenerator id={newId} mobile={newMobile} />}

      <div className="my-16" />

      <h1 className="font-celestial font-black">Ticket Info</h1>
      <input
        type="text"
        ref={oldIdRef}
        className="w-1/2 mobile:w-full bg-transparent border rounded-md p-2 bg-blue-500 bg-opacity-5"
        placeholder="id on ticket (below QR Code)"
      />
      <button
        className="bg-blue-500 py-2 w-1/2 mobile:w-full rounded-md disabled:opacity-70 disabled:cursor-progress disabled:animate-pulse"
        disabled={loading}
        onClick={() => getOldTicketInfo()}
      >
        Get Info
      </button>

      {oldTicket && (
        <>
          <div className="my-5" />
          <p className="text-xl">
            <span className="mr-3 text-blue-400"> Name :</span>{" "}
            <span>{oldTicket.name}</span>
          </p>
          <p className="text-xl">
            <span className="mr-3 text-blue-400">Mobile :</span>
            <span>{oldTicket.mobile}</span>
          </p>
          <div className="flex flex-col items-center gap-y-2">
            <h2 className="mt-3 text-blue-400 border-b border-blue-400">
              Activities
            </h2>
            <div className="flex flex-col">
              {Object.keys(oldTicket.activities).map((key, index) => {
                return (
                  <div className="flex text-lg justify-end" key={key}>
                    <h3 className="flex-1">{key}</h3>
                    <p className="ml-8 opacity-20 font-extralight">|</p>
                    <p className="font-mono w-8 text-right">
                      {
                        oldTicket.activities[
                          key as keyof typeof oldTicket.activities
                        ]
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
