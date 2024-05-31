import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArrayStringSelect = ({
  list,
  onChange,
  resultValue,
}: {
  list: string[];
  resultValue: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchedList = list.filter((x) =>
    search !== "" ? x!.toLowerCase().includes(search.toLowerCase()) : true
  );

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(!isOpen);
    setSearch("");
  };

  return (
    <div className="flex items-center justify-between w-full">
      {isOpen && (
        <div
          className="fixed top-0 left-0 z-10 w-full h-full "
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="relative flex items-center w-full space-x-1">
        <div
          className={`flex relative space-x-2 items-start justify-center w-full px-2 py-1 bg-white border-2 border-pale  ${
            isOpen ? "rounded-t-xl" : "rounded-xl"
          }`}
        >
          <div className="w-full cursor-pointer">
            <div
              className="flex items-center justify-between text-normal"
              onClick={() => setIsOpen(!isOpen)}
            >
              {resultValue || "Не указано"}{" "}
              <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {isOpen && (
              <div className="absolute z-10 left-0 w-full h-[200px] bg-white border-2 top-8 border-pale rounded-b-xl ">
                <Input
                  value={search}
                  className="h-8 m-0 rounded-none "
                  placeholder="Поиск"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-y-auto h-[160px] scrollbar-hide">
                  {searchedList.map((x) => (
                    <div className="" key={x}>
                      <div
                        key={x}
                        className="p-1 text-sm transition-colors hover:bg-lightgrey"
                        onClick={() => handleOptionClick(x!)}
                      >
                        {x}
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ArrayStringSelect;
