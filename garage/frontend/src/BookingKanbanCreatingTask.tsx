import { useState } from "react";
import { client } from "./backend";
import { Body43 } from "./api-client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/ui/phone-input";
import carsList from "../../backend/public/assets/json/carsValid.json";
import Confirmation from "@/components/ui/confirmation";
import { Input } from "@/components/ui/input";
import { useRecoilState } from "recoil";
import { parkAtom } from "./atoms";

interface Division {
  id: number;
  name: string;
}

export const BookingKanbanCreatingTask = ({
  close,
  accept,
}: {
  close: () => void;
  accept: () => void;
}) => {
  const [newApplicationPhone, setNewApplicationPhone] = useState("");
  const [park] = useRecoilState(parkAtom);

  const [newApplication, setNewApplication] = useState<Body43>(
    new Body43({
      advertising_source: "Без рекламы",
      division_id: park.divisions?.[0].id,
      planned_arrival: undefined,
      driver_license: undefined,
      license_issuing_country: undefined,
    })
  );
  const [newApplicationModel, setNewApplicationModel] = useState<{
    model: string | undefined;
    brand: string | undefined;
  }>({
    model: undefined,
    brand: undefined,
  });

  const createNewApplication = async () => {
    await client.createApplicationManager(
      new Body43({
        ...newApplication,
        phone: newApplicationPhone,
        chosen_model: newApplicationModel.model,
        chosen_brand: newApplicationModel.brand,
      })
    );
  };

  const uniqueDivisions: Division[] = park.divisions!.map((division: any) => ({
    id: division.id,
    name: division.name,
  }));

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-start justify-center w-full h-full pt-10 bg-lightgrey">
        <div className="flex flex-col items-center p-4 space-y-2 bg-white rounded-xl max-w-[1206px] w-full border-2 border-pale px-6">
          <h3 className="mb-4">Создание новой заявки</h3>
          <div className="flex flex-wrap justify-between w-full ">
            <div className="w-1/2 px-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="text-center">Источник рекламы</div>
                <select
                  className="h-10 p-1 m-0 border-2 border-grey rounded-xl"
                  name=""
                  id=""
                  onChange={(e) =>
                    setNewApplication(
                      new Body43({
                        ...newApplication,
                        advertising_source: e.target.value,
                      })
                    )
                  }
                >
                  {["Без рекламы", "BeeBeep", "Avito"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between space-x-4">
                <div className="text-center">Подразделение</div>
                <select
                  className="h-10 p-1 m-0 border-2 border-grey rounded-xl"
                  name=""
                  id=""
                  onChange={(e) =>
                    setNewApplication(
                      new Body43({
                        ...newApplication,
                        division_id: Number(e.target.value),
                      })
                    )
                  }
                >
                  {uniqueDivisions.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))}
                </select>{" "}
              </div>{" "}
              <Separator className="my-4" />
              <div className="flex items-center justify-between space-x-4">
                <div className="w-1/2">Телефон водителя</div>
                <PhoneInput
                  className="lg:m-0 max-h-10 max-w-44"
                  onChange={(e) => setNewApplicationPhone(e.target.value)}
                />
              </div>{" "}
              <Separator className="my-4" />
              <div className="flex items-center justify-between space-x-4">
                <div className="w-1/2">Планирует прийти</div>
                <Input
                  className="m-0 w-44"
                  type="datetime-local"
                  onChange={(e) =>
                    setNewApplication(
                      new Body43({
                        ...newApplication,
                        planned_arrival: new Date(e.target.value),
                      })
                    )
                  }
                />
              </div>
            </div>
            <div className="w-1/2 px-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="text-center ">
                  Номер водительского удостоверения
                </div>
                <Input
                  onChange={(e) =>
                    setNewApplication(
                      new Body43({
                        ...newApplication,
                        driver_license: e.target.value,
                      })
                    )
                  }
                  type="text"
                  className="m-0 w-44"
                  placeholder="Значение"
                />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between space-x-2">
                <div className="text-center ">Марка\модель авто</div>
                <select
                  className="h-10 p-1 m-0 border-2 w-44 border-grey rounded-xl"
                  name=""
                  id=""
                  onChange={(e) =>
                    setNewApplicationModel({
                      ...newApplicationModel,
                      brand: e.target.value,
                    })
                  }
                >
                  <option value={""}>Марка</option>
                  {carsList.map((y) => (
                    <option key={y.name} value={y.name}>
                      {y.name}
                    </option>
                  ))}
                </select>
                <select
                  className="h-10 p-1 m-0 border-2 w-44 border-grey rounded-xl"
                  name=""
                  id=""
                  onChange={(e) =>
                    setNewApplicationModel({
                      ...newApplicationModel,
                      model: e.target.value,
                    })
                  }
                >
                  <option value={""}>Модель</option>
                  {newApplicationModel.brand &&
                    newApplicationModel.brand !== "Модель" &&
                    carsList!
                      .find(({ name }) => name === newApplicationModel.brand!)
                      ?.models.map((y: string) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                </select>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between space-x-4">
                <div className="text-center ">Страна выдачи прав</div>
                <Input
                  onChange={(e) =>
                    setNewApplication(
                      new Body43({
                        ...newApplication,
                        license_issuing_country: e.target.value,
                      })
                    )
                  }
                  type="text"
                  className="m-0 w-44"
                  placeholder="Значение"
                />
              </div>
              <Separator className="my-4" />
            </div>
            <div className="flex justify-end w-full space-x-2 ">
              <div className="w-44">
                {newApplicationPhone && (
                  <Confirmation
                    accept={() => {
                      createNewApplication();
                      accept();
                    }}
                    cancel={() => {}}
                    title="Создать заявку?"
                    trigger={<Button>Создать</Button>}
                    type="green"
                  />
                )}
                {!newApplicationPhone && <Button disabled>Создать</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed z-50 top-10 left-10">
        <Button
          variant={"reject"}
          className="text-black"
          onClick={() => close()}
        >
          Назад
        </Button>
      </div>
    </>
  );
};
