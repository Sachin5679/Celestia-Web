import LogoAnim from "./LogoAnim";

export default function Hero() {
  return (
    <section className="h-screen">
      {/* <img
        src="/vectors/logo.svg"
        draggable={false}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      /> */}
      <LogoAnim delayStep={1000} letterSpeed={2000} />
    </section>
  );
}
