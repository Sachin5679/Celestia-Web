import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import useCoords from "../../../hooks/useCoords";
import Spline from "@splinetool/react-spline";

export default function TicketBooking() {
  const [bgOpacity, setBgOpacity] = useState(0);
  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        const cl = (window.scrollY - initialPos.top) / window.innerHeight;
        setBgOpacity(cl);
      });
  }, [initialPos]);

  return (
    <section ref={sectRef} className="h-screen relative">
      <div
        className={twMerge(
          "fixed left-0 top-0 w-full h-full duration-100",
          bgOpacity < -1 && "hidden"
        )}
        style={{ opacity: 1 + bgOpacity }}
      >
        <Spline scene="https://prod.spline.design/a2-CAxt6N0VsodLg/scene.splinecode" />
      </div>
    </section>
  );
}
