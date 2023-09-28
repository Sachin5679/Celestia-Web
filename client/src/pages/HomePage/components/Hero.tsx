import LogoAnim from "./LogoAnim";

export default function Hero() {
  return (
    <section className="h-screen flex justify-center items-center relative ">
      <div className="relative z-1 w-5/6 h-1/2 pointer-events-none">
        <LogoAnim delayStep={500} letterSpeed={1500} color={"#ffffff"} />
      </div>
    </section>
  );
}
