import { useState, useEffect, useRef } from "react";
import { clampValue, linearMap } from "../../../../utils";
import useCoords from "../../../../hooks/useCoords";
import MaterialIcon from "../../../../common/MaterialIcon";

const content = [
  {
    icon: "genres",
    content:
      "laksdnj andk akd ak dakd ka da dsgkav dkasdlad as dhalh dlasj dbjasflgv lgja jal asgfa f.scl aslja dadad askjdb la bdlah dla dlj adjv asdv alvd lav la d;aoi sdhui ihabd[aobudiavdsb na[dj aoubdl adkhba sd hahba dabh nnbh nabhbn djdbdjbnd nvnv ncsf fdn dndndmnsfdfdndnndb   fdfdewsfd",
  },
  {
    icon: "noise_aware",
    content:
      "laksdnj andk akd ak dakd ka da dsgkav dkasdlad as dhalh dlasj dbjasflgv lgja jal asgfa f.scl aslja dadad",
  },
  {
    icon: "headphones",
    content:
      "laksdnj andk akd ak dakd ka da dsgkav dkasdlad as dhalh dlasj dbjasflgv lgja jal asgfa f.scl aslja dadad",
  },
];

export default function ELsect() {
  const [conf, setConf] = useState({
    bgOpacity: 1,
    scale: 1,
    hueRotate: 0,
    bgScale: 1,
  });

  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;
  const initialPos = useCoords(sectRef);

  useEffect(() => {
    initialPos &&
      window.addEventListener("scroll", () => {
        setConf((p) => {
          return {
            ...p,
            bgScale:
              1 +
              clampValue(
                Math.pow(
                  Math.abs(
                    (window.scrollY - initialPos.top) / window.innerHeight
                  ),
                  2
                ),
                { min: 0, max: 1 }
              ),
          };
        });
      });
    initialPos &&
      sectRef.current.addEventListener("mousemove", (event) => {
        setConf((p) => {
          return {
            ...p,
            hueRotate: linearMap(
              event.clientX,
              { from: 0, to: window.innerWidth },
              { from: 0, to: 720 }
            ),
          };
        });
      });
  }, [initialPos]);

  return (
    <section className="h-screen relative overflow-hidden" ref={sectRef}>
      <video
        src="/videos/concert.webm"
        className="absolute w-full h-full object-cover -z-10 scale-[var(--scaler)]"
        style={
          {
            filter: `grayscale(100%) sepia(100%) hue-rotate(${conf.hueRotate}deg)`,
            "--scaler": conf.bgScale,
          } as React.CSSProperties
        }
        autoPlay
        muted
        loop
      />
      <div className="relative z-20 flex flex-col items-center my-20 gap-y-5">
        <h1
          className="cursor-default group w-2/3 py-8 self-end px-16 duration-500 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] hover:[clip-path:polygon(0%_0%,100%_0%,100%_100%,5%_100%)]
        relative z-10"
        >
          <span
            className="relative text-slate-400 font-medium text-2xl bg-black group"
            style={{
              filter: `grayscale(100%) sepia(100%) hue-rotate(${conf.hueRotate}deg)`,
            }}
          >
            Electrifying EDM
            <span className="absolute bottom-0 left-0 whitespace-nowrap text-xs -z-1 opacity-0 duration-700 group-hover:left-full group-hover:translate-x-4 group-hover:opacity-100">
              move your mouse to feel the lights of the concert
            </span>
          </span>
          <div className="absolute-cover duration-inherit group-hover:-translate-y-2 bg-blue-500 -z-1" />
          <div className="absolute-cover duration-inherit group-hover:translate-y-1 bg-pink-500 -z-1" />
          <div className="absolute-cover duration-inherit group-hover:translate-y-2 bg-black -z-1" />
        </h1>
      </div>

      <div className="absolute top-1/2 left-0 w-full h-1/2 flex flex-col text-5xl group">
        {content.map((item, key) => (
          <div
            key={key}
            className="absolute duration-500 text-inherit flex w-1/3 h-1/2 left-[calc(100%_-_1.3em)] peer peer-hover:translate-x-full hover:-translate-x-[calc(100%_-_2em)]"
            style={{ top: key * 83 }}
          >
            <MaterialIcon
              icon={item.icon}
              className="text-4xl border border-[var(--accent)] bg-black h-max p-3 translate-x-1 border-r-transparent"
            />
            <div className="border border-[var(--accent)] max-w-[50vw] bg-black px-8 py-5">
              <p className="text-sm">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
