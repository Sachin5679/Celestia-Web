import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import PersistentName from "./components/PersistentName";
import STsect from "./components/sections/STsect";
import ELsect from "./components/sections/ELsect";
import Esect from "./components/sections/Esect";
import { mapValueToColor } from "../../utils";
import Csect from "./components/sections/Csect";
import BrochureButton from "./components/BrochureButton";
import TicketButton from "./components/TicketButton";
import TicketBooking from "./components/TicketBooking";
import Isect from "./components/sections/Isect";
import Asect from "./components/sections/Asect";

export default function HomePage() {
  useEffect(() => {
    const accentMapValuesFrom: number[] = [0];
    const accentMapValuesTo: number[][] = [
      [255, 255, 255],
      [255, 130, 20], //C
      [50, 50, 50],
      [0, 0, 255],
      [255, 0, 255],
      [255, 255, 255],
      [0, 0, 0],
      [255, 255, 255],
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
      <Hero />
      <TicketButton />
      <BrochureButton />
      

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
        <div className="h-screen" />
        <Asect />
        <div className="h-screen bg-black" />
        <TicketBooking />
      </div>
    </>
  );
}
