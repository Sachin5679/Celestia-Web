import React, { useRef, useEffect, useState } from "react";
import useCoords from "../../../../hooks/useCoords";
import { clampValue } from "../../../../utils";

export default function Esect() {
  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;
  const [offset, setOffset] = useState(1);

  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        setOffset(
          clampValue((window.scrollY - initialPos.top) / window.innerHeight, {
            min: -1,
            max: 1,
          })
        );
      });
  }, [initialPos]);

  return (
    <section
      ref={sectRef}
      className="h-screen relative -z-1 justify-end overflow-hidden"
    >
      <video
        className="absolute -z-10 w-full h-full object-cover contrast-150"
        autoPlay
        loop
        muted
        src="/videos/neon_hands.mp4"
      />
      <div
        style={
          {
            "--scale": `${Math.max(1, 2 * Math.abs(offset))}`,
            "--blur": `${Math.abs(Math.pow(offset, 1) * 2)}px`,
          } as React.CSSProperties
        }
        className="scale-[var(--scale)] blur-[var(--blur)] mt-10 bg-clip-text text-transparent animated-text-gradient-blue"
      >
        <h1 className="text-center font-celestial self-stretch text-4xl tracking-widest">
          Experience The Psychedelics
        </h1>
        <p className="text-center mt-5 font-light text-opacity-80 text-sm">
          But only Metaphorically!
        </p>
      </div>
      <div className="flex flex-col items-center basis-3/5"></div>
    </section>
  );
}
