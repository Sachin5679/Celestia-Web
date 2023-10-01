import React, { useEffect, useRef, useState } from "react";
import useCoords from "../../../../hooks/useCoords";
import { clampValue } from "../../../../utils";
import { twMerge } from "tailwind-merge";

export default function Asect() {
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
          "w-full h-full top-0 left-0 -z-0",
          opacity < 0.01 ? "hidden" : "fixed"
        )}
      ></div>
    </section>
  );
}
