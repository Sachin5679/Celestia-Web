import Spline from "@splinetool/react-spline";
import { useEffect, useRef, useState } from "react";
import useCoords from "../../../../hooks/useCoords";
import { twMerge } from "tailwind-merge";
import { clampValue } from "../../../../utils";

const parallaxIntensity = 2;

export default function Csect() {
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const [opacity, setOpacity] = useState(1);
  const [state, setState] = useState<"fixed" | "relative">("relative");

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("mousemove", (event) => {
        const xoffset = (event.clientX - window.innerWidth / 2) / 100;
        const yoffset = (event.clientY - window.innerHeight / 2) / 100;

        setOffset([xoffset * parallaxIntensity, yoffset * parallaxIntensity]);
      });

    initialPos &&
      window.addEventListener("scroll", () => {
        if (window.scrollY > window.innerHeight * 2)
          setOpacity(
            1 -
              clampValue(
                Math.abs(
                  (window.scrollY - initialPos.top) / window.innerHeight
                ),
                { min: 0, max: 1 }
              )
          );
        else setOpacity(1);

        if (window.scrollY > initialPos.top + window.innerHeight) {
          setState("relative");
        } else {
          setState("fixed");
        }
      });
  }, [initialPos]);

  return (
    <section
      ref={sectRef}
      className={twMerge("h-screen")}
      style={{ opacity: opacity }}
    >
      <img
        src="/images/psychedelic.jpg"
        alt="trip"
        className={twMerge(
          "-z-1",
          state === "relative" && "hidden",
          state === "fixed" && "fixed top-0 left-0 w-full h-full"
        )}
        style={{
          transform: `scale(105%) translateX(${offset[0]}px) translateY(${offset[1]}px)`,
        }}
      />

      <div className="flex ml-[33vw] flex-col h-screen gap-y-3 group mt-20">
        <div className="bg-black px-10 py-5 rounded-2xl w-max bg-opacity-80">
          <h1 className="text-7xl">IT'S HAPPENING AND</h1>
          <h2 className="text-5xl">IT'S GONNA BE</h2>
          <h3 className="text-9xl peer rainbow-anim text-red-500 cursor-default">
            CRAZIER{" "}
            <span className="text-xs italic animate-pulse">
              hover for a trip
            </span>
          </h3>
          <h4 className="text-3xl">
            THAN YOU IMAGINED{" "}
            <span className="animate-pulse text-lg tracking-widest">
              ......
            </span>
          </h4>

          <div className="fixed top-0 left-0 w-full h-full z-[999] pointer-events-none duration-300 scale-0 opacity-0 peer-hover:opacity-100 peer-hover:scale-100">
            <p className="absolute top-16 left-1/3 -translate-x-1/2 -translate-y-1/2 mix-blend-difference text-white bg-black px-10 py-1 rounded-md">
              Use your mouse to discover more effects like this
            </p>
          </div>

          <div className="fixed w-full h-full top-0 left-0 z-[999] mix-blend-exclusion bg-blue-500 opacity-0 duration-1000 peer-hover:opacity-100 pointer-events-none rainbow-anim" />

          <div className="fixed w-full h-full top-0 left-0 z-[1000] opacity-0 peer-hover:duration-1000 duration-[20000ms] peer-hover:opacity-100 pointer-events-none brightness-200 overflow-hidden">
            <div className="fog" id="foglayer_01">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
            <div className="fog" id="foglayer_02">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
            <div className="fog" id="foglayer_03">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
            <div className="fog" id="foglayer_01">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
            <div className="fog" id="foglayer_02">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
            <div className="fog" id="foglayer_03">
              <div className="image01"></div>
              <div className="image02"></div>
            </div>
          </div>
        </div>
        <div className="mt-32 bg-black bg-opacity-80 w-1/2 self-center px-10 py-5 rounded-xl">
          At celestia we believe in crazy crzy Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Voluptates obcaecati expedita nisi alias
          dolor repudiandae.
        </div>
        <div className="mt-32 bg-black bg-opacity-80 w-1/2 self-start px-10 py-5 rounded-xl">
          At celestia we believe in crazy crzy Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Voluptates obcaecati expedita nisi alias
          dolor repudiandae.
        </div>
      </div>
    </section>
  );
}
