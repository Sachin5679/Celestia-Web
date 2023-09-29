import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import PersistentName from "./components/PersistentName";
import STsect from "./components/sections/STsect";
import ELsect from "./components/sections/ELsect";
import Esect from "./components/sections/Esect";
import { mapValueToColor } from "../../utils";
import Csect from "./components/sections/Csect";

export default function HomePage() {
  const [renderBody, setRenderBody] = useState(false);

  useEffect(() => {
    const accentMapValuesFrom: number[] = [0];
    const accentMapValuesTo: number[][] = [
      [255, 255, 255],
      [255, 0, 255],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    for (let i = 0; i < 7; i++) {
      accentMapValuesFrom.push(
        window.innerHeight * 2 + window.innerHeight * i * 2
      );
    }

    window.addEventListener("scroll", () => {
      document.documentElement.style.setProperty(
        "--accent",
        mapValueToColor(window.scrollY, accentMapValuesFrom, accentMapValuesTo)
      );
    });
  }, []);

  return (
    <>
      <PersistentName />
      <Hero setRenderBody={setRenderBody} />
      {renderBody && (
        <>
          <section className="h-screen"></section>
          <Csect />
          <div className="h-screen" />
          <ELsect />
          <div className="h-screen" />
          <Esect />
          <div className="h-screen" />
          <STsect />
          <div className="h-screen" />
          <div className="h-screen bg-black" />
          <div className="h-screen bg-purple-500" />
          <div className="h-screen bg-purple-500" />
        </>
      )}
    </>
  );
}
