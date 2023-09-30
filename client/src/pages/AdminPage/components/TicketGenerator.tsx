import React, { useEffect, useState, useRef } from "react";
import * as qr from "qrcode";

const qrSize = 432;
const placeAt = [
  2597.5 - qrSize / 2,
  338 - qrSize / 2,
  qrSize,
  qrSize,
] as const; //x,y,w,h

export default function TicketGenerator(props: { id: string; mobile: string }) {
  const link = `localhost:5173/admin?id=${props.id}`;
  const [editedImageURL, setEditedImageURL] = useState<string | null>(null);

  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;

  async function generateEditedImage() {
    try {
      const qrDataUrl = await qr.toDataURL(link, {
        color: {
          dark: "#000",
          light: "#0000",
        },
        width: 1024,
      });

      const backgroundImage = new Image();
      backgroundImage.src = "/images/holder.png";

      backgroundImage.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;

        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        ctx.font = "bold 35px Arial";
        ctx.textAlign = "center";

        ctx.fillText(props.id.toUpperCase(), 2596.5, 626);

        const qr = new Image();
        qr.src = qrDataUrl;

        qr.onload = () => {
          ctx.drawImage(qr, ...placeAt);

          const editedImageURL = canvas.toDataURL("image/png");
          setEditedImageURL(editedImageURL);
        };
      };
    } catch (_) {
      alert("Error generating QR");
    }
  }

  function downloadEditedImage() {
    if (editedImageURL) {
      const linkElement = document.createElement("a");
      linkElement.href = editedImageURL;
      linkElement.download = `${props.mobile}.png`;
      linkElement.click();
    }
  }

  useEffect(() => {
    generateEditedImage();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="max-w-[80vw] hidden" />
      {editedImageURL && (
        <div className="flex flex-col items-center">
          <img
            src={editedImageURL}
            alt="Edited Image"
            className="max-w-[80vw] mobile:max-w-full"
          />
          <button
            className="bg-emerald-400 text-black w-1/6 mobile:w-full py-2 rounded-md mt-2"
            onClick={downloadEditedImage}
          >
            Download Ticket
          </button>
          <button
            className="bg-red-500 w-1/6 mobile:w-full py-2 rounded-md mt-2"
            onClick={location.reload}
          >
            Generate New
          </button>
        </div>
      )}
    </div>
  );
}
