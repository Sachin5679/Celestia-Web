import React, { useEffect, useRef, useState } from "react";
import FluidBG from "../../../../common/FluidBG";
import useCoords from "../../../../hooks/useCoords";
import { clampValue } from "../../../../utils";
import { twMerge } from "tailwind-merge";

export default function Isect() {
  const [opacity, setOpacity] = useState(0);

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        setOpacity(
          1 -
            clampValue(
              Math.abs(window.scrollY - initialPos.top) / window.innerHeight,
              {
                min: 0,
                max: 1,
              }
            )
        );
      });
  }, [initialPos]);

  return (
    <section
      className="relative h-screen"
      style={{ opacity: opacity }}
      ref={sectRef}
    >
      <div
        className={twMerge(
          "w-full h-full top-0 left-0 -z-0 bg-cyan-500",
          opacity < 0.01 ? "hidden" : "fixed"
        )}
      >
        <FluidBG config={{}} />
      </div>
      <div className="absolute-cover flex flex-col pl-[20vw] items-center pointer-events-none mix-blend-exclusion">
        <h1 className="flex items-baseline text-5xl font-celestial">
          <span className="font-celestialDecorative text-8xl -translate-y-2">
            I
          </span>
          <span className="ml-[0.2ch]">mmesion on a next level</span>
        </h1>
      </div>
    </section>
  );
}
