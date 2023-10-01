import React, { useEffect, useState } from "react";
import MaterialIcon from "../../../common/MaterialIcon";
import { twMerge } from "tailwind-merge";
import { clampValue } from "../../../utils";

export default function BrochureButton() {
  const [expansion, setExpansion] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setExpansion(
        1 -
          clampValue(Math.abs(window.scrollY / window.innerHeight - 1), {
            min: 0,
            max: 1,
          })
      );
    });
  }, []);

  return (
    <button
      className="fixed bottom-5 left-5 z-[1005] bg-[var(--accent)] h-14 aspect-square rounded-full flex justify-center items-center duration-300 hover:pl-4 hover:pr-32 group"
      style={{
        paddingRight: `${expansion * 128}px`,
        paddingLeft: `${expansion * 16}px`,
      }}
      onMouseEnter={() => {
        setExpansion(1);
      }}
      onMouseLeave={() => {
        setExpansion(0);
      }}
      onClick={() => {
        window.open('https://bit.ly/3Zsbr6U', '_blank')
      }}
    >
      <MaterialIcon
        icon="menu_book"
        className="mix-blend-difference text-4xl"
      />
      <p
        className={twMerge(
          "mix-blend-difference whitespace-nowrap absolute left-16 duration-1000 overflow-hidden"
        )}
        style={{
          opacity: expansion,
          width: expansion < 0.66 ? `${expansion * 100}%` : "max-content",
        }}
      >
        Brochure
      </p>
    </button>
  );
}
