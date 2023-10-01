import { useEffect, useState } from "react";
import LogoAnim from "./LogoAnim";
import Spline from "@splinetool/react-spline";
import { twMerge } from "tailwind-merge";

const delayStep = 500;
const letterSpeed = 1500;

export default function Hero() {
// {
//   setRenderBody,
// }: {
//   setRenderBody: React.Dispatch<React.SetStateAction<boolean>>;
// }
  const [bgOpacity, setBgOpacity] = useState(1);
  const [animFlag, setAnimFlag] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const r = window.scrollY / window.innerHeight;
      setBgOpacity(r > 1 ? 0 : 1 - r);
    });

    // setTimeout(() => {
    //   setRenderBody(true);
    //   setAnimFlag(true);
    // }, (6 + 1) * delayStep + letterSpeed);
  }, []);

  return (
    <section
      className={twMerge(
        "h-screen flex justify-center items-center relative p-page",
        !animFlag && "overflow-hidden"
      )}
    >
      <div className="relative z-1 w-5/6 h-full pointer-events-none mix-blend-difference">
        <LogoAnim
          delayStep={delayStep}
          letterSpeed={letterSpeed}
          color={"#ffffff"}
        />
      </div>
      <div
        className={twMerge(
          "fixed left-0 top-0 w-full h-full duration-100",
          bgOpacity < 0.01 && "hidden"
        )}
        style={{ opacity: bgOpacity }}
      >
        <Spline
          onLoad={() => {}}
          scene="https://prod.spline.design/a2-CAxt6N0VsodLg/scene.splinecode"
        />
      </div>

      <div className="absolute-cover overflow-hidden pointer-events-none">
        <div
          style={
            {
              opacity: Math.pow(bgOpacity, 10),
              "--scale": 1 + (1 - Math.pow(bgOpacity, 10)) / 2,
              "--blurBy": `${2 * (1 - Math.pow(bgOpacity, 10))}px`,
            } as React.CSSProperties
          }
          className={twMerge(
            "absolute left-1/2 -translate-x-1/2 text-center text-back font-celestial font-black duration-300 text-xl whitespace-nowrap scale-[var(--scale)] blur-[var(--blurBy)]",
            animFlag ? "bottom-[10vh]" : "-bottom-[20vh]",
            Math.pow(bgOpacity, 10) < 0.01 && "hidden"
          )}
        >
          <h1>We are excited to announce, for the first time ever!</h1>
        </div>
      </div>
      <div
        className={twMerge(
          "top-0 w-full h-full -z-10",
          bgOpacity < 0.01 ? "absolute translate-y-full" : "fixed"
        )}
      >
        <img
          src="/images/psychedelic.webp"
          alt="trip"
          className="object-cover w-full h-full -z-10 hidden"
        />
      </div>
    </section>
  );
}
