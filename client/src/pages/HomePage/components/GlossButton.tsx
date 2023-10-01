import React, { ReactNode } from "react";

export default function GlossButton(props: {
  children: ReactNode;
  clr: [string, string];
}) {
  const customProperties = {
    "--hue2": "calc(var(--hue) + 60deg)",
    "--sat2": "calc(var(--sat) + 10%)",
    "--text": "hsla(var(--hue), 70%, 10%, .9)",
    "--gradoffset": "45%",
    "--gradgap": "30%",
  };

  return (
    <div
      className="relative transition duration-500 ease-in-out outline-none hover:outline-none"
      style={
        {
          ...customProperties,
          "--clr": props.clr[0],
          "--clr2": props.clr[1],
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-transparent to-[var(--clr2)] bg-blend-overlay bg-no-repeat bg-center"
        style={{
          boxShadow:
            "inset 0 0.25em 0.75em hsla(var(--hue), 70%, 80%, 0.3), inset 0 0.25em 0.3em -0.2em hsl(var(--hue) 90% 70%), inset 0 0.25em 0.5em hsla(var(--hue),20%,30%, 0.2), inset 0 -2px 2px rgba(255,255,255,0.2)",
          backgroundSize: "200% 80%, cover",
          backgroundPosition: "center 220%",
          filter: "blur(calc(var(--blur) * 0.5))",
          mixBlendMode: "overlay",
        }}
      ></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-hsla(var(--hue2),100%,90%,.9) to-hsla(var(--hue2),calc(var(--sat2)*0.7),50%,.75) via-transparent to-[var(--clr2)] top-0.075em left-0.75em right-0.75em bottom-1.4em filter blur(var(--blur)) mix-blend-screen"></div>
      <button className="text-[var(--text)] font-medium tracking-[0.025em] bg-[var(--clr)] bg-no-repeat bg-center bg-size-100% 200% px-6 py-4 rounded-full border-none shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 focus:ring-offset-white hover:bg-[var(--clr2)] hover:bg-gradient-to-b hover:from-transparent hover:via-transparent hover:to-[var(--clr2)] hover:bg-no-repeat hover:bg-center hover:bg-size-100% 200%">
        {props.children}
      </button>
    </div>
  );
}
