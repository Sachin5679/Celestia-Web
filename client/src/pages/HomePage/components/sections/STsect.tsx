import React, { useRef, useState, useEffect } from "react";
import { getCoords, linearMap } from "../../../../utils";
import useCoords from "../../../../hooks/useCoords";

export default function Lsect() {
  const [imageScroll, setImageScroll] = useState("0px");

  const sectRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        setImageScroll(
          `${linearMap(
            scrollY,
            {
              from: initialPos.top - window.innerHeight,
              to: initialPos.top + window.innerHeight,
            },
            { from: 0, to: window.innerHeight }
          )}px`
        );
      });
  }, [initialPos]);

  return (
    <section className="h-screen overflow-hidden relative" ref={sectRef}>
      <img
        src="/images/neon-moon-cat.jpeg"
        alt="bg neon moon"
        className="relative -translate-y-[var(--scroll)] -z-10"
        style={{ "--scroll": imageScroll } as React.CSSProperties}
      />
    </section>
  );
}
