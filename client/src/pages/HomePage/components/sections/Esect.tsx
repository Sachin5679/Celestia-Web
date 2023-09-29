import React, { useRef, useEffect, useState } from "react";
import useCoords from "../../../../hooks/useCoords";
import { clampValue } from "../../../../utils";
import Icon from "../../../../types/icons";
import MaterialIcon from "../../../../common/MaterialIcon";
import { twMerge } from "tailwind-merge";

const p =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero minus vitae dolorum rerum natus inventore veniam, consequatur voluptatem quas consequuntur maiores expedita labore assumenda repudiandae quam, possimus quisquam eius facilis dolorem? Deleniti reiciendis, culpa veritatis quod nesciunt soluta, qui sequi perferendis repudiandae delectus eum veniam.";

interface Content {
  icon: Icon;
  imageUrl?: string;
  title: string;
  content: string;
}

const content: Content[] = [
  { icon: "album", title: "Concernt Something", content: p },
  { icon: "brand_awareness", title: "Promotion Something", content: p },
  {
    icon: "checkroom",
    title: "Fashion Something",
    imageUrl:
      "https://assets.gqindia.com/photos/64c0d40a55d9445b48560c0f/master/pass/Barbie-vs-Oppenheimer.jpg",
    content: p,
  },
  {
    icon: "activity_zone",
    title: "Activities lots",
    imageUrl: "https://adatis.co.uk/wp-content/uploads/VR.jpg",
    content: p,
  },
];
export default function Esect() {
  const sectRef = useRef() as React.MutableRefObject<HTMLElement>;
  const [offset, setOffset] = useState(1);
  const [currentContent, setCurrentContent] = useState<Content>();

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
    <section
      ref={sectRef}
      className="h-screen relative justify-end overflow-hidden"
    >
      <video
        className="absolute -z-10 w-full h-full object-cover contrast-150"
        autoPlay
        loop
        muted
        src="/videos/neon_hands.mp4"
      />
      <div
        style={
          {
            "--scale": `${Math.max(1, 2 * Math.abs(offset))}`,
            "--blur": `${Math.abs(Math.pow(offset, 1) * 2)}px`,
          } as React.CSSProperties
        }
        className="scale-[var(--scale)] blur-[var(--blur)] mt-10 bg-clip-text text-transparent animated-text-gradient-blue"
      >
        <h1 className="text-center font-celestial self-stretch text-4xl tracking-widest">
          Experience The Psychedelics
        </h1>
        <p className="text-center mt-5 font-light text-opacity-80 text-sm">
          But only Metaphorically!
        </p>
      </div>
      <div className="absolute z-10 flex flex-col right-0 bottom-0 items-center w-full h-5/6">
        <div className="flex-1 w-full self-end p-6 flex flex-col items-center">
          <div
            className={twMerge(
              "bg-white bg-opacity-10 w-max backdrop-blur-md rounded-xl duration-300 border border-white border-opacity-20",
              currentContent
                ? "opacity-100 scale-100 blur-none"
                : "scale-150 translate-y-10 opacity-0 blur-lg"
            )}
          >
            {currentContent && (
              <div className="p-6 max-w-[35vw] flex flex-col gap-y-5 items-center">
                <h1 className="font-raleway font-light text-3xl">
                  {currentContent.title}
                </h1>

                {currentContent.imageUrl && (
                  <img
                    src={currentContent.imageUrl}
                    className="rounded-xl max-h-[30vh] object-cover shadow-lg"
                  />
                )}

                <p className="font-light text-sm">{currentContent.content}</p>
              </div>
            )}
          </div>
        </div>
        <div className="basis-1/6 self-stretch flex justify-center items-center gap-x-10 pb-10">
          {content.map((item, key) => (
            <button
              key={key}
              onMouseEnter={() => setCurrentContent(item)}
              onMouseLeave={() => setCurrentContent(undefined)}
              className="bg-blue-600 w-16 h-16 rounded-full flex justify-center items-center animated-text-gradient-blue brightness-75 contrast-200 hover:scale-90 hover:bg-5 duration-200 group cursor-pointer"
            >
              <MaterialIcon
                icon={item.icon}
                opticalSize={10}
                className="text-4xl"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
