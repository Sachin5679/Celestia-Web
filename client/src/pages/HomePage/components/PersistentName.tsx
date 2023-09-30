import React, { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function PersistentName() {
  const [currentLetter, setCurrentLetter] = useState("C");
  const [x, setX] = useState(`${-window.innerWidth / 2}px`);
  const [letterWidth, setLetterWidth] = useState(100);
  const [opacity, setOpacity] = useState(0);

  const ref = useRef() as React.MutableRefObject<HTMLElement>;

  const padLeft = 0.6;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setCurrentLetter(
        ["C", "C", "C", "EL", "EL", "E", "E", "ST", "ST", "I", "I", "A", "A"][
          Math.floor(
            (window.scrollY - window.innerHeight / 2) / window.innerHeight
          )
        ]
      );
      setLetterWidth(ref.current.clientWidth);

      if (window.scrollY < window.innerHeight * 1.5) {
        setX(`${-window.innerWidth}px`);
      } else {
        const tx =
          letterWidth * padLeft -
          letterWidth *
            (1 + padLeft) *
            Math.pow(
              Math.abs(
                1 -
                  Math.sin(
                    (window.innerHeight * 1.5 + Math.PI * window.scrollY) /
                      window.innerHeight
                  )
              ),
              2
            );
        setX(`${tx}px`);
        setOpacity(
          Math.sin(
            (window.innerHeight * 1.5 + Math.PI * window.scrollY) /
              window.innerHeight
          )
        );
      }
    });
  }, []);

  return (
    <article className="pointer-events-none">
      <figure
        ref={ref}
        style={
          {
            "--x": x,
            opacity: opacity > 0 ? opacity : 0,
            filter:
              (currentLetter === "C" &&
                "drop-shadow(0px 0px 2px #000) drop-shadow(0px 0px 5px #000) drop-shadow(0px 0px 8px #000) drop-shadow(0px 0px 10px #000) drop-shadow(0px 0px 1px #000)") ||
              (currentLetter === "EL" && "drop-shadow(0px 0px 1px #fff)") ||
              (currentLetter === "E" && "drop-shadow(0px 0px 1px #ffffff)"),
          } as React.CSSProperties
        }
        className={twMerge(
          "font-celestialDecorative fixed top-1/2 -translate-y-1/2 translate-x-[var(--x)] text-[30vh]",
          currentLetter === "C" && "z-0",
          currentLetter === "EL" && "text-[15vw]",
          currentLetter === "E" &&
            "font-thin bg-clip-text text-transparent animated-text-gradient-blue",
          currentLetter === "ST" && "drop-shadow-[0px_0px_10px_#ff44dd]",
          currentLetter === "I" && "mix-blend-difference z-1",
          currentLetter === "A" && "drop-shadow-[0px_0px_10px_#ff44dd]"
        )}
      >
        {currentLetter}
      </figure>
    </article>
  );
}
