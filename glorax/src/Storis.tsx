import closeIcon from "../public/img/close_icon.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import storisJSON from "./assets/storis.json";
import iconButton from "../public/img/Icon_Button.svg";

function Storis({ close, question }: { close: () => void; question: string }) {
  const [id, setId] = useState(0);

  const storisList = storisJSON.questions.find(
    (x) => x.question === question
  )?.storis;

  useEffect(() => {
    if (storisList) {
      if (id < storisList.length - 1) {
        setTimeout(() => {
          id !== storisList.length && setId(id + 1);
        }, 15000);
      }
    }
  }, [id]);

  if (!storisList) {
    return <></>;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[55] bg-lightpink bg-opacity-25 space-x-2 flex justify-center items-center sm:rounded-lg">
      <div className="flex relative items-center justify-center space-x-0 bg-opacity-25  bg-lightpink w-full h-full sm:max-w-80 sm:rounded-lg  sm:max-h-[650px] overflow-hidden ">
        <img
          src={closeIcon}
          alt=""
          onClick={() => close()}
          className="absolute z-50 w-10 cursor-pointer right-2 top-2"
        />
        {storisList.map((storis, i) => (
          <div
            onClick={() => i < storisList.length - 1 && setId(id + 1)}
            className={`w-screen p-10 sm:p-2 bg-brown absolute sm:w-80 left-0 h-auto transition-transform ${
              id === i
                ? "translate-x-0"
                : id > i
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            key={storis}
          >
            <img
              src={`./img/storis/${storis}.png`}
              alt=""
              className={`object-contain w-screen sm:w-80`}
            />
            {!!i && (
              <div
                className="absolute z-50 flex items-center justify-start gap-4 p-2 mb-6 text-sm uppercase rotate-180 border-none rounded-full left-2 bottom-2 w-fit bg-blue"
                onClick={(e) => {
                  e.stopPropagation();
                  setId(id - 1);
                }}
              >
                <img src={iconButton} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Storis;
