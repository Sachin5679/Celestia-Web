import Hero from "./components/Hero";
import PersistentName from "./components/PersistentName";
import Lbackground from "./components/backgrounds/Lbackground";

export default function HomePage() {
  return (
    <>
      <Hero />

      <PersistentName />
      <div className="h-screen bg-black" />
      <div className="h-screen bg-purple-500" />
      <div className="h-screen bg-black" />
      <div className="h-screen bg-purple-500"></div>
      <div className="h-screen bg-black" />
      <Lbackground />
      <div className="h-screen bg-purple-500" />
      <div className="h-screen bg-black" />
      <div className="h-screen bg-purple-500" />
    </>
  );
}
