import React, { useEffect, useState } from "react";
import MaterialIcon from "../../../common/MaterialIcon";
import { twMerge } from "tailwind-merge";
import { clampValue } from "../../../utils";

export default function TicketButton() {
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
      className="fixed bottom-5 right-5 z-[1005] bg-[var(--accent)] h-14 aspect-square rounded-full flex justify-center items-center duration-300 hover:pl-4 hover:pr-32 group"
      style={{
        paddingRight: `${expansion * 128}px`,
        paddingLeft: `${expansion * 16}px`,
      }}
    >
      <MaterialIcon
        icon="confirmation_number"
        className="mix-blend-difference text-4xl"
      />
      <p
        className={twMerge(
          "mix-blend-difference whitespace-nowrap absolute left-16 opacity-0 duration-1000 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-max"
        )}
        style={{ opacity: expansion, width: `${expansion * 100}%` }}
      >
        Get Tickets
      </p>
    </button>
  );
}
