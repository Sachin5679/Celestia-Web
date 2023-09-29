import { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import {
  clampValue,
  getCoords,
  linearMap,
  mapValueToColor,
} from "../../../../utils";

export default function ELsect() {
  const [initialPos, setInitialPos] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState(0);
  const [conf, setConf] = useState({ bgOpacity: 1, scale: 1, hueRotate: 0 });

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  useEffect(() => {
    setInitialPos(getCoords(sectRef.current));
    window.addEventListener("scroll", () => {
      setOffset((window.scrollY - initialPos.top) / window.innerHeight);
    });

    sectRef.current.addEventListener("mousemove", (event) => {
      // const t = window.innerWidth / 6;
      // const newColor = mapValueToColor(
      //   event.clientX,
      //   [0, t, t * 2, t * 3, t * 4, t * 5, t * 6],
      //   [
      //     [148, 0, 211],
      //     [75, 0, 130],
      //     [0, 0, 255],
      //     [0, 255, 0],
      //     [255, 255, 0],
      //     [255, 165, 0],
      //     [255, 0, 0],
      //   ]
      // );
      setConf((p) => {
        return {
          ...p,
          hueRotate: linearMap(
            event.clientX,
            { from: 0, to: window.innerWidth },
            { from: 0, to: 180 }
          ),
        };
      });
    });
  }, []);

  return (
    <section
      className="h-screen relative"
      ref={sectRef}
      style={{
        opacity:
          1 - clampValue(Math.pow(Math.abs(offset), 3), { min: 0, max: 1 }),
      }}
    >
      <video
        src="/videos/concert.webm"
        className="absolute-cover relative object-cover -z-10"
        style={{
          filter: `grayscale(100%) sepia(100%) hue-rotate(${conf.hueRotate}deg)`,
        }}
        autoPlay
        muted
        loop
      />
    </section>
  );
}
