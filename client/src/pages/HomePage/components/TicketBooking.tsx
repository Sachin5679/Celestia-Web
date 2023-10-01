import React, { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import useCoords from "../../../hooks/useCoords";
import axios from "axios";
import { serverUrl } from "../../../config";

function verifyInsstituteEmail(rollNumber: string): boolean {
  const rollNumberPattern =
    /^(bcs|imt|img|bee|bms)_(20(?:[0-9][0-9]))(00[0-9]|0[0-9][0-9]|1[0-9][0-9]|200)@iiitm\.ac\.in$/;

  return rollNumberPattern.test(rollNumber);
}

const Spline = React.lazy(() => import("@splinetool/react-spline"));

export default function TicketBooking() {
  const [bgOpacity, setBgOpacity] = useState(-2);

  const [show, setShow] = useState<"internal" | "external" | null>(null);
  const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  const initialPos = useCoords(sectRef);

  function sendEmail() {
    if (!verifyInsstituteEmail(emailRef.current.value)) {
      return alert("Invalid email, please try again");
    }

    axios.post(`${serverUrl}/email/send-form?email=${emailRef.current.value}`);
    alert(
      "We have sent out an email to your institute id! \nYou shall receive it in the next 2 mins"
    );

    setShow(null);
  }

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        const cl = (window.scrollY - initialPos.top) / window.innerHeight;
        setBgOpacity(cl);
      });
  }, [initialPos]);

  return (
    <>
      <section ref={sectRef} className="h-screen relative">
        <div
          className={twMerge(
            "fixed left-0 top-0 w-full h-full duration-100",
            bgOpacity < -1 && "hidden"
          )}
          style={{
            opacity: 1 + bgOpacity,
            filter: `contrast(${(1 - bgOpacity) * 100}%) saturate(${
              (2 - bgOpacity) * 100
            }%)`,
          }}
        >
          <Spline
            scene="https://prod.spline.design/a2-CAxt6N0VsodLg/scene.splinecode"
            className="-scale-x-100 -scale-y-100"
          />
        </div>

        <div className="flex flex-col relative z-10 w-full items-center pt-10">
          <h1 className="font-celestial text-5xl font-black text-black tracking-wide">
            GRAB YOUR TICKETS
          </h1>
          <div className="flex justify-center mt-16 text-xl font-light group duration-500">
            <button
              className="duration-inherit bg-black px-8 py-3 rounded-l-full border-r border-blue-500 hover:bg-[#000022] hover:px-20 hover:py-5 hover:bg-opacity-90 hover:backdrop-blur"
              onClick={() => setShow("internal")}
            >
              IIITM Student
            </button>

            <button
              className="duration-inherit bg-black px-8 py-3 rounded-r-full border-l border-pink-500 hover:bg-[#220022] hover:px-20 hover:py-5 hover:bg-opacity-90 hover:backdrop-blur"
              onClick={() => setShow("external")}
            >
              Other College
            </button>
          </div>
        </div>
      </section>

      {show === "internal" && (
        <div className="fixed top-0 left-0 z-[999] w-full h-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white w-[40vw] py-10 px-20 rounded-xl drop-shadow-lg">
            <h1 className="mb-10 font-celestialDecorative text-slate-700 text-center text-5xl rainbow-anim">
              CELESTIA
            </h1>
            <input
              type="text"
              placeholder="Enter your institude email"
              className="w-full rounded-full border border-black px-2 py-1 text-lg text-black"
              ref={emailRef}
            />

            <div className="flex w-full justify-evenly mt-10">
              <button
                className="bg-blue-500 px-6 py-2 rounded-full"
                onClick={sendEmail}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 px-6 py-2 rounded-full"
                onClick={() => setShow(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
