import { useRecoilState } from "recoil";
import { parkAtom } from "./atoms";

import { Separator } from "@/components/ui/separator";
import {
  Body25,
  Body36,
  Body37,
  CarStatus,
  Cars4,
  IPark2,
  Statuses,
} from "./api-client";
import Resizer from "react-image-file-resizer";
import { useEffect, useState } from "react";
import SliderImages from "@/components/ui/slider-images";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "./backend";
import Confirmation from "@/components/ui/confirmation";
import FileInput from "@/components/ui/file-input";

export const CarsManager = () => {
  const [park, setPark] = useRecoilState(parkAtom);
  const [selected, setSelected] = useState<Cars4>();
  const [ids, setIds] = useState<number[]>([]);
  const [showFullInfo, setShowFullInfo] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [divisionId, setDivisionId] = useState<number | undefined>(
    park.divisions![0]?.id || undefined
  );
  const [tariffId, setTariffId] = useState<number | undefined>(
    park.tariffs![0]?.id || undefined
  );
  const [rentTermId, setRentTermId] = useState<number | undefined>(
    park.rent_terms![0]?.id || undefined
  );
  const [assignedType, setAssignedType] = useState<string | undefined>();
  const [statuses, setStatuses] = useState<Statuses[]>([]);

  const sortedCars = [...park.cars!].sort((a, b) => {
    if (a.brand === b.brand) {
      if (a.model! > b.model!) return 1;
      if (a.model! < b.model!) return -1;
      return 0;
    } else {
      if (a.brand! > b.brand!) return 1;
      if (a.brand! < b.brand!) return -1;
    }
    return 0;
  });

  const SearchedSortedCars = sortedCars.filter(
    (car: Cars4) =>
      car.license_plate!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPark = async () => {
    const parkData: IPark2 = await client.getParkManager();
    setPark(parkData.park);
  };

  useEffect(() => {
    const getStatuses = async () => {
      try {
        const data = await client.getParkStatusesManager();
        if (data.statuses) {
          setStatuses(data.statuses);
        }
      } catch (error: any) {
        if (error.errors) {
          const errorMessages = Object.values(error.errors).flatMap(
            (errorArray) => errorArray
          );
          const errorMessage = errorMessages.join("\n");
          alert("An error occurred:\n" + errorMessage);
        } else {
          alert("An error occurred: " + error.message);
        }
      }
    };
    getStatuses();
  }, []);

  const resizeFile = (file: File) =>
    new Promise((resolve, reject) => {
      if (file instanceof Blob) {
        Resizer.imageFileResizer(
          file,
          1920,
          1080,
          "WEBP",
          30,
          0,
          (uri) => {
            resolve(uri);
          },
          "blob"
        );
      } else {
        reject(new Error("File is not of type Blob"));
      }
    });

  const handlePhotos = async (fileList: FileList) => {
    try {
      const file: any = await resizeFile(fileList[0]);
      const image = await resizeFile(file);
      setPhotos([...photos, file as File]);
      console.log(image);
    } catch (err) {
      console.log(err);
    }
  };

  const addPhotosToCars = async () => {
    const fileParameters = await Promise.all(
      photos.map(async (file) => ({
        data: file,
        fileName: "any",
      }))
    );
    const stringIds = ids.join(",");
    try {
      await client.pushPhotosToCarsManager(fileParameters, stringIds);
      getPark();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const addDivisionToCars = async () => {
    try {
      await client.assignCarsToDivisionManager(
        new Body36({ division_id: divisionId, car_ids: ids })
      );
      getPark();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const addTariffToCars = async () => {
    try {
      await client.assignCarsToTariffManager(
        new Body37({ tariff_id: tariffId, car_ids: ids })
      );
      getPark();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const addRentTermToCars = async () => {
    try {
      await client.assignCarsToRentTermManager(
        new Body25({ rent_term_id: rentTermId, car_ids: ids })
      );
      getPark();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const getStatuses = async () => {
    await client.getCarsCurrentStatusesFromClientManager();
    getPark();
  };

  const getCars = async () => {
    try {
      await client.pushCarsFromParkClientManager();
      getPark();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const handleCheckboxes = (state: boolean, id: number) => {
    if (state) {
      setIds([...ids.filter((x) => x !== id), id]);
    }
    if (!state) {
      setIds([...ids.filter((x) => x !== id)]);
    }
  };

  return (
    <>
      <div className="">Авто</div>
      <div className="flex space-x-8">
        <div className="">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-yellow"
          />{" "}
          - авто скрыто
        </div>
        <div className="">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-red" />{" "}
          - не вся информация об авто заполнена
        </div>
        <div className="flex flex-wrap w-1/2 gap-2">
          {[
            { type: "division", text: "Привязать подразделение" },
            { type: "tariff", text: "Привязать тариф" },
            { type: "rent_term", text: "Привязать условия аренды" },
            { type: "photos", text: "Загрузить фото" },
          ].map((x) => (
            <Button
              key={x.type}
              variant={"manager"}
              onClick={() => setAssignedType(x.type)}
            >
              {x.text}
            </Button>
          ))}
          <Button variant={"manager"} onAsyncClick={() => getStatuses()}>
            Обновить статусы авто
          </Button>
          <Button variant={"manager"} onAsyncClick={() => getCars()}>
            Обновить авто
          </Button>
        </div>
      </div>

      {assignedType === "division" && (
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          Подразделение:
          <select
            className="p-1 m-1 border-2 border-grey rounded-xl"
            name=""
            id=""
            onChange={(e) => setDivisionId(Number(e.target.value))}
          >
            {park.divisions?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.city} {y.name}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addDivisionToCars}
            cancel={() => {}}
            title="Привязать подразделение"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      {assignedType === "tariff" && (
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          Тариф:
          <select
            className="p-1 m-1 border-2 border-grey rounded-xl"
            name=""
            id=""
            onChange={(e) => setTariffId(Number(e.target.value))}
          >
            {park.tariffs?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.city} {y.class}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addTariffToCars}
            cancel={() => {}}
            title="Привязапь тариф"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      {assignedType === "rent_term" && (
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          Тариф:
          <select
            className="p-1 m-1 border-2 border-grey rounded-xl"
            name=""
            id=""
            onChange={(e) => setRentTermId(Number(e.target.value))}
          >
            {park.rent_terms?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addRentTermToCars}
            cancel={() => {}}
            title="Привязапь условия"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      {assignedType === "photos" && (
        <div className="w-full p-2 my-8 space-y-4 bg-white rounded-xl">
          Фото:
          <div className="flex flex-wrap gap-2 ">
            {photos?.map((file, index) => (
              <div className="relative" key={index}>
                {file instanceof Blob && (
                  <div>
                    <img
                      className="object-contain h-64 w-80 rounded-xl bg-grey"
                      src={URL.createObjectURL(file)}
                      alt={`Image ${index}`}
                    />
                    <div
                      onClick={() =>
                        setPhotos([...photos.filter((x) => x !== file)])
                      }
                      className="absolute p-2 bg-white rounded-lg cursor-pointer top-1 right-1"
                    >
                      Отмена
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {photos.length < 3 && (
            <FileInput
              title="Загрузить"
              onChange={(fileList) => handlePhotos(fileList)}
            />
          )}
          {photos.length >= 1 && (
            <Confirmation
              accept={() => addPhotosToCars()}
              cancel={() => {}}
              title="Привязапь фото"
              trigger={<Button variant={"manager"}>Привязать</Button>}
              type="green"
            />
          )}
        </div>
      )}

      <div className="flex space-x-1">
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          <div className="flex flex-col items-center justify-between gap-1">
            <Button
              variant={"manager"}
              onClick={() => setShowFullInfo(!showFullInfo)}
            >
              {showFullInfo ? "Скрыть заполненные" : "Показать все авто"}
            </Button>
            <Input
              className="my-1"
              placeholder="Модель, марка, г/н"
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
            ></Input>
            {SearchedSortedCars!.map((car) => {
              const excludedFields = [
                "status_id",
                "old_status_id",
                "created_at",
                "updated_at",
              ];

              const infoIsNotFull = Object.keys(car)
                .filter((key) => !excludedFields.includes(key))
                .some((key) => car[key] === null);

              const hidden = car.status === CarStatus.Hidden;

              const status =
                statuses.find((status) => status.id === car.status_id)
                  ?.custom_status_name || "без статуса";

              return (
                <>
                  {(showFullInfo || infoIsNotFull) && (
                    <div key={car.id} className="w-full">
                      <div className="">
                        <div className="flex justify-between px-2">
                          <div className="flex items-center gap-1">
                            {hidden && (
                              <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                className="text-yellow"
                              />
                            )}
                            {infoIsNotFull && (
                              <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                className="text-red"
                              />
                            )}
                            <div
                              className={`${
                                selected?.id === car.id ? "text-yellow" : ""
                              }`}
                              onClick={() => setSelected(car!)}
                            >
                              {car.brand} {car.model} {car.license_plate} -{" "}
                              {status}
                            </div>
                          </div>
                          <Input
                            className="flex w-6 m-0"
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckboxes(e.target.checked, car!.id!)
                            }
                          ></Input>
                        </div>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <h3>VIN: {selected.vin}</h3>
            <p>Г/н: {selected.license_plate}</p>
            <p>Марка: {selected.brand}</p>
            <p>Модель: {selected.model}</p>
            <p>
              Подразделение:{" "}
              {park.divisions!.find((x) => x.id === selected.division_id!)
                ?.name || "еще нет"}
            </p>
            {!selected.images && <p>Фото: еще нет</p>}
            {selected.images && (
              <SliderImages
                classImages=""
                type="click"
                classPaginationImages=""
                images={selected.images}
                openIsAffordable={false}
              />
            )}
            <p>
              Условия аренды:{" "}
              {park.rent_terms!.find((x) => x.id === selected.rent_term_id!)
                ?.name || "еще нет"}
            </p>
            <p>
              Тариф:{" "}
              {park.tariffs!.find((x) => x.id === selected.tariff_id!)?.class ||
                "еще нет"}
            </p>
            <p>Статус: {selected.status || "еще нет"}</p>
          </div>
        )}
      </div>
    </>
  );
};
