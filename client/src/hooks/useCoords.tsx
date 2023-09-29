import React, { ReactNode, useEffect, useState } from "react";
import { getCoords } from "../utils";

export default function useCoords(
  element: React.MutableRefObject<HTMLElement>
) {
  const [pos, setPos] = useState<{ top: number; left: number }>();

  useEffect(() => {
    setPos(getCoords(element.current));
  }, []);

  return pos;
}
