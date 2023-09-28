import { useEffect, useState } from "react";
import LogoAnim from "./LogoAnim";
import Spline from "@splinetool/react-spline";

export default function Hero() {
  const [bgOpacity, setBgOpacity] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const r = window.scrollY / window.innerHeight;
      setBgOpacity(r > 1 ? 0 : 1 - r);
    });
  }, []);

  return (
    <section className="h-screen flex justify-center items-center relative p-page">
      <div className="relative z-1 w-5/6 h-full pointer-events-none">
        <LogoAnim delayStep={500} letterSpeed={1500} color={"#010"} />
      </div>
      <div
        className="fixed left-0 top-0 w-full h-full"
        style={{ opacity: bgOpacity }}
      >
        <Spline scene="https://prod.spline.design/a2-CAxt6N0VsodLg/scene.splinecode" />
      </div>
    </section>
  );
}
