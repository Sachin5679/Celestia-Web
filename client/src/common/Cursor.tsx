import React, { useEffect, useState } from "react";

export default function Cursor() {
  const [mousePos, setMousePos] = useState({
    x: window.innerWidth / 2,
    y: -window.innerHeight / 3,
  });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [bubblePos, setBubblePos] = useState(mousePos);

  function moveCursor(event: MouseEvent) {
    setMousePos({ x: event.clientX, y: event.clientY });

    const disVec = { x: mousePos.x - bubblePos.x, y: mousePos.y - bubblePos.y };
    // setVelocity({})
  }

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);

    document.documentElement.style.cursor = "none";
  }, []);

  return (
    <>
      <figure className="pointer-events-none z-[999] fixed" />
      <figure
        className="pointer-events-none z-[999] fixed w-1 h-1 rounded-full bg-[#ff0000]"
        style={{ top: mousePos.y, left: mousePos.x }}
      />
    </>
  );
}
