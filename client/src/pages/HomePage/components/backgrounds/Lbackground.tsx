import React, { useRef, useState, useEffect } from "react";
import { getCoords, linearMap } from "../../../../utils";

export default function Lbackground() {
  const [initialY, setInitialY] = useState(0);
  const [imageScroll, setImageScroll] = useState("0px");

  const sectRef = useRef() as React.MutableRefObject<HTMLImageElement>;

  useEffect(() => {
    setInitialY(getCoords(sectRef.current).top);

    window.addEventListener("scroll", () => {
      setImageScroll(
        `${linearMap(
          scrollY,
          { from: initialY, to: initialY + window.innerHeight },
          { from: 0, to: 100 }
        )}px`
      );
    });
  }, []);

  return (
    <section className="h-screen overflow-hidden" ref={sectRef}>
      <img
        src="/images/neon-moon-cat.jpeg"
        alt="bg neon moon"
        className="-translate-y-[var(--scroll)] -z-1"
        style={{ "--scroll": imageScroll } as React.CSSProperties}
      />
    </section>
  );
}
