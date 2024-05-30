import { useState } from "react";
import {
  faChevronDown,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Body49, ParkInventoryTypes } from "./api-client";
import { parkListsAtom } from "./atoms";
import { client } from "./backend";
import { useRecoilState } from "recoil";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const ListSelect = ({
  type,
  onChange,
  resultValue,
}: {
  type: ParkInventoryTypes;
  resultValue: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parkLists, setParkLists] = useRecoilState(parkListsAtom);
  const [search, setSearch] = useState("");
  const [newListItem, setNewListItem] = useState<{
    type: ParkInventoryTypes | undefined;
    content: string | undefined;
  }>({ type, content: undefined });

  const getParkLists = async () => {
    const data = await client.getParkInventoryListsManager();
    setParkLists(data.lists!);
  };

  const createParkListItem = async () => {
    await client.createParkInventoryListItemManager(
      new Body49({ content: newListItem.content, type: newListItem.type })
    );
    getParkLists();
    setNewListItem({ content: undefined, type });
  };

  const selectedList = parkLists.filter((x) => x.type === type);

  const searchedSelectedList = selectedList.filter((x) =>
    search !== ""
      ? x.content!.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(!isOpen);
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
              className="flex items-center justify-between"
              onClick={() => setIsOpen(!isOpen)}
            >
              {resultValue || "Не указано"}{" "}
              <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {isOpen && (
              <div className="absolute z-10 left-0 w-full h-[200px] bg-white border-2 top-8 border-pale rounded-b-xl ">
                <Input
                  className="h-8 m-0 rounded-none "
                  placeholder="Поиск"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-y-auto h-[160px] scrollbar-hide">
                  <div className="flex items-center py-1 space-x-1">
                    <Input
                      className="h-8 m-0 rounded-none "
                      placeholder="Новый элемент"
                      value={newListItem.content ? newListItem.content : ""}
                      onChange={(e) =>
                        setNewListItem({ content: e.target.value, type })
                      }
                    />
                    <FontAwesomeIcon
                      onClick={() => createParkListItem()}
                      icon={faPenToSquare}
                      className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                        !newListItem.content ? "text-pale" : "text-black"
                      }`}
                    />
                  </div>
                  <Separator />

                  {searchedSelectedList.map((x) => (
                    <div className="">
                      <div
                        key={x.id}
                        className="p-1 text-sm transition-colors hover:bg-lightgrey"
                        onClick={() => handleOptionClick(x.content!)}
                      >
                        {x.content}
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

export default ListSelect;
