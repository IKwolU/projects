interface CustomSheetProps {
  isOpen: boolean;
  content: JSX.Element;
}

const CustomSheet = ({ isOpen, content }: CustomSheetProps) => {
  return (
    <>
      {
        <div
          className={`fixed top-0 right-0 z-50 h-full max-w-96 transform transition-all ease-in-out bg-black space-y-4 p-4 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full">{content}</div>
        </div>
      }
    </>
  );
};

export default CustomSheet;
