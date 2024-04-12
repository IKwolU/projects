import { useState } from "react";
import { Button } from "./button";

interface ConfirmationProps {
  title: string;
  text?: string;
  type: "red" | "green";
  cancel: () => void;
  accept: () => void;
  trigger: JSX.Element;
}

const Confirmation = ({
  title,
  type,
  accept,
  cancel,
  trigger,
  text,
}: ConfirmationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = () => {
    accept();
    setIsOpen(false);
  };

  const handleCancel = () => {
    cancel();
    setIsOpen(false);
  };
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 z-[53] flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center max-w-xs px-8 py-4 text-xl text-center bg-zinc-100 border border-grey shadow min-w-80 rounded-xl">
            {title}
            <div className="">{text}</div>
            <div className="flex w-full mt-2 space-x-2 ">
              {type === "red" && (
                <>
                  <Button
                    variant="reject"
                    className="text-black bg-white border-2 border-grey"
                    onClick={handleAccept}
                  >
                    Да
                  </Button>
                  <Button className="font-normal" onClick={handleCancel}>
                    Нет
                  </Button>
                </>
              )}
              {type !== "red" && (
                <>
                  <Button
                    variant="reject"
                    className="text-black bg-white border-2 border-grey"
                    onClick={handleCancel}
                  >
                    Нет
                  </Button>
                  <Button onClick={handleAccept}>Да</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="w-full" onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
    </>
  );
};

export default Confirmation;
