import Spline from "@splinetool/react-spline";
import { useEffect, useRef, useState } from "react";
import useCoords from "../../../../hooks/useCoords";
import { twMerge } from "tailwind-merge";
import { clampValue } from "../../../../utils";

export default function Csect() {
  const [offset, setOffset] = useState(0);

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;

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
    <section ref={sectRef} className={twMerge("h-screen")}>
      {/* <Spline scene="https://prod.spline.design/Y67p3m0ljbnXao1Q/scene.splinecode" /> */}
    </section>
  );
}
