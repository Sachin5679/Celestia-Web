import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import PersistentName from "./components/PersistentName";
import STsect from "./components/sections/STsect";
import ELsect from "./components/sections/ELsect";
import Esect from "./components/sections/Esect";
import { mapValueToColor } from "../../utils";
import Csect from "./components/sections/Csect";
import TicketButton from "./components/TicketButton";
import TicketBooking from "./components/TicketBooking";
import Isect from "./components/sections/Isect";

export default function HomePage() {
  const [renderBody, setRenderBody] = useState(false);
  const [showTicketing, setShowTicketing] = useState(false);

  useEffect(() => {
    const accentMapValuesFrom: number[] = [0];
    const accentMapValuesTo: number[][] = [
      [255, 255, 255],
      [255, 130, 20], //C
      [50, 50, 50],
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
      if (!showTicketing && window.scrollY > window.innerHeight * (2 / 3))
        setShowTicketing(true);
    });
  }, []);

  return (
    <>
      <PersistentName />
      <Hero setRenderBody={setRenderBody} />
      {showTicketing && <TicketButton />}

      {renderBody && (
        <div className="overflow-hidden">
          <div className="h-screen" />
          <Csect />
          <div className="h-screen" />
          <ELsect />
          <div className="h-screen" />
          <Esect />
          <div className="h-screen" />
          <STsect />
          <div className="h-screen" />
          <Isect />
          <div className="h-screen bg-purple-500" />
          <div className="h-screen bg-purple-500" />
          <div className="h-screen bg-black" />
          {showTicketing && <TicketBooking />}
        </div>
      )}
    </>
  );
}
