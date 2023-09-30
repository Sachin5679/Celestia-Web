import React, { useRef, useState } from "react";
import admin, { setAdminKey } from "../../../services/admin";
import { saveTokenToLocalStorage } from "../../../utils";

export default function Login(props: {
  setAuthed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const tokenRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  async function login(key: string) {
    setLoading(true);
    setAdminKey(key);
    saveTokenToLocalStorage(key);
    const valid = await admin.verify(key);
    if (!valid) {
      alert("Invalid Admin Key, pehle Kartik / Spandan se key lelo");
    }
    props.setAuthed(valid);

    tokenRef.current.value = "";
    setLoading(false);
  }

  return (
    <section className="flex flex-col items-center p-page">
      <input
        type="text"
        className="w-1/2 mobile:w-full border bg-transparent bg-blue-200 bg-opacity-10 rounded-md px-5 py-1 my-5 text-lg"
        ref={tokenRef}
        placeholder="Key"
      />
      <button
        className="bg-blue-500 w-1/2 mobile:w-full py-2 font-celestial font-black rounded-md disabled:animate-pulse disabled:cursor-progress disabled:opacity-70"
        disabled={loading}
        onClick={() => login(tokenRef.current.value)}
      >
        Go
      </button>
    </section>
  );
}
