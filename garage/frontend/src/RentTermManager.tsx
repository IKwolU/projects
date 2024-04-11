import { useState } from "react";
import { useRecoilState } from "recoil";
import { Body6, Rent_terms, Schemas } from "./api-client";
import { parkAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Confirmation from "@/components/ui/confirmation";

export const RentTermManager = () => {
  const [park] = useRecoilState(parkAtom);

  const [newRentTerm, setNewRentTerm] = useState({
    rent_term_id: undefined,
    deposit_amount_daily: undefined,
    deposit_amount_total: undefined,
    is_buyout_possible: undefined,
    name: undefined,
    minimum_period_days: undefined,
    schemas: [
      {
        id: 0,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      },
    ],
  });

  const [selectedId, setSelectedId] = useState(0);

  const upsertRentTerm = async () => {
    await client.createOrUpdateRentTermManager(
      new Body6({
        rent_term_id: selected?.id || undefined,
        deposit_amount_daily: newRentTerm.deposit_amount_daily,
        deposit_amount_total: newRentTerm.deposit_amount_total,
        is_buyout_possible:
          newRentTerm.is_buyout_possible || !!selected?.is_buyout_possible,
        name: newRentTerm.name || selected?.name,
        minimum_period_days:
          newRentTerm.minimum_period_days || selected?.minimum_period_days,
        schemas: [new Schemas(selectedSchemasList)],
      })
    );

    window.location.href = "/rent_terms";

    // const upsertedRentTerm = {
    //   rent_term_id: newRentTermData.rent_term_id,
    //   is_buyout_possible: newRentTerm.is_buyout_possible,
    //   name: newRentTerm,
    //   minimum_period_days: newRentTerm.is_buyout_possible,
    //   schemas: new Schemas(newRentTerm.schemas),
    //   id: newRentTermData.id,
    //   deposit_amount_daily: newRentTerm.deposit_amount_daily,
    // };

    // setPark({
    //   ...park,
    //   rent_terms: [
    //     ...rentTerms!.filter((rentTerm) =>
    //       newRentTerm.rent_term_id
    //         ? rentTerm.id !== newRentTerm.rent_term_id
    //         : rentTerm
    //     ),
    //     new Rent_terms(upsertedRentTerm),
    //   ],
    // });
  };

  const handleInputNewRentTermChange = (
    value: string | boolean,
    param: keyof Rent_terms
  ) => {
    setNewRentTerm({
      ...newRentTerm,
      [param]: value,
    });
  };

  const handleInputNewRentTermSchemaChange = (
    value: string,
    param: keyof Schemas,
    id: number
  ) => {
    const currentSchema = newRentTerm.schemas!.find(
      (schema) => schema.id === id
    );

    setNewRentTerm({
      ...newRentTerm,
      schemas: [
        ...newRentTerm.schemas!.filter((schema) => schema.id !== id),
        { ...currentSchema!, [param]: value },
      ],
    });
  };

  const rentTerms = park!.rent_terms;

  const selected = rentTerms!.find(
    (rentTerm) => rentTerm.id === selectedId
  ) as Rent_terms;

  const selectedSchemasList =
    selectedId > 0 ? selected.schemas : newRentTerm.schemas;

  const AddSchema = () => {
    if (selectedSchemasList && selectedSchemasList.length > 0) {
      const lastSchema = selectedSchemasList[selectedSchemasList.length - 1];
      const newId = lastSchema!.id! + 1;
      const newSchema = {
        id: newId,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      };
      if (selectedSchemasList.length < 10) {
        setNewRentTerm({
          ...newRentTerm,
          schemas: [...selectedSchemasList, new Schemas(newSchema)] as any,
        });
      }
    }
  };

  if (!rentTerms) {
    return <></>;
  }

  return (
    <>
      <div className="">Условия аренды</div>

      <div className="flex space-x-1">
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          <div className="flex flex-col items-center justify-between space-x-2">
            {rentTerms.length === 0 && (
              <div className="">
                <div className="">Условий аренды еще нет</div>{" "}
              </div>
            )}
            {rentTerms.map((x, i) => (
              <div className="" key={`rentTerm_${i}`}>
                <div className="" onClick={() => setSelectedId(x.id!)}>
                  {x.name}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-64 text-lg" onClick={() => setSelectedId(0)}>
            Создать
          </Button>
        </div>
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          <h3 className="my-4">Создание условий аренды</h3>
          {[
            {
              title: `Ежедневный депозит: ${
                selected?.deposit_amount_daily || ""
              }`,
              type: "nubmer",
              placeholder: "Введите значение",
              param: "deposit_amount_daily",
              value: selected?.deposit_amount_daily || undefined,
            },
            {
              title: `Всего депозит: ${selected?.deposit_amount_total || ""}`,
              type: "number",
              placeholder: "Введите значение",
              param: "deposit_amount_total",
              value: selected?.deposit_amount_total || undefined,
            },
            {
              title: `Возможность выкупа: ${
                selected?.is_buyout_possible ? "возможен" : "не возможен"
              }`,
              type: "checkbox",
              placeholder: "Введите значение",
              param: "is_buyout_possible",
              value: selected?.is_buyout_possible,
            },
            {
              title: `Минимальный срок аренды в днях: ${
                selected?.minimum_period_days || ""
              }`,
              type: "number",
              placeholder: "Введите значение",
              param: "minimum_period_days",
              value: selected?.minimum_period_days || undefined,
            },
            {
              title: `Название: ${selected?.name || ""}`,
              type: "text",
              placeholder: "Введите значение",
              param: "name",
              value: selected?.name || undefined,
            },
          ].map((input, index) => (
            <div
              key={`input_${index}`}
              className={`${
                input.type === "checkbox" &&
                "flex flex-row-reverse justify-end items-center gap-4"
              }`}
            >
              <h4>{input.title}</h4>
              <Input
                className={`${input.type === "checkbox" && "flex w-6 m-0 "}`}
                onChange={(e) =>
                  input.type === "checkbox"
                    ? handleInputNewRentTermChange(
                        e.target.checked,
                        input.param
                      )
                    : handleInputNewRentTermChange(e.target.value, input.param)
                }
                type={input.type}
                placeholder={input.placeholder}
              ></Input>
            </div>
          ))}
          <div className="flex items-center justify-between space-x-2">
            <h4>Схемы аренды:</h4>
            {selectedSchemasList!.length < 10 && (
              <Button className="w-1/2" onClick={AddSchema}>
                Добавить схему аренды
              </Button>
            )}
          </div>
          <div className="">
            {selectedSchemasList!.map((schema, i) => (
              <div
                key={`schema_${i}`}
                className="p-4 my-1 border border-grey rounded-xl"
              >
                {[
                  {
                    title: `Стоимость ежедневно ${schema?.daily_amount || ""}`,
                    type: "number",
                    placeholder: "Введите значение",
                    param: "daily_amount",
                    value: schema.daily_amount || 0,
                  },
                  {
                    title: `Рабочих дней ${schema?.working_days || ""}`,
                    type: "number",
                    placeholder: "Введите значение",
                    param: "non_working_days",
                    value: schema.non_working_days || 0,
                  },
                  {
                    title: `Не рабочих дней ${schema?.non_working_days || ""}`,
                    type: "number",
                    placeholder: "Введите значение",
                    param: "working_days",
                    value: schema.working_days || 0,
                  },
                ].map((input, index) => (
                  <div
                    key={`input_${index}`}
                    className="flex items-center justify-between"
                  >
                    <h4>{input.title}</h4>
                    <Input
                      className={"w-3/5 m-1"}
                      onChange={(e) =>
                        handleInputNewRentTermSchemaChange(
                          e.target.value,
                          input.param,
                          schema.id!
                        )
                      }
                      type={input.type}
                      placeholder={input.placeholder}
                    ></Input>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Confirmation
            accept={upsertRentTerm}
            cancel={() => {}}
            trigger={<Button className="w-60">Применить</Button>}
            title={"Создать подразделение?"}
            type="green"
          />
        </div>
      </div>
    </>
  );
};
