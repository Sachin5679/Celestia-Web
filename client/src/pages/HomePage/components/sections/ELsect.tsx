import { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import { clampValue, getCoords, linearMap } from "../../../../utils";

export default function ELsect() {
  const [initialPos, setInitialPos] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState(0);
  const [conf, setConf] = useState({ bgOpacity: 1, scale: 1 });

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  useEffect(() => {
    setInitialPos(getCoords(sectRef.current));
    window.addEventListener("scroll", () => {
      setOffset((window.scrollY - initialPos.top) / window.innerHeight);
    });
  }, []);

  return (
    <section
      className="h-screen relative -z-10"
      ref={sectRef}
      style={{
        opacity:
          1 - clampValue(Math.pow(Math.abs(offset), 3), { min: 0, max: 1 }),
      }}
    >
      {/* <Spline scene="https://prod.spline.design/5lWC5WoX9dv-OXDo/scene.splinecode" /> */}
    </section>
  );
}
