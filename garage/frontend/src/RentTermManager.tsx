import { useState } from "react";
import { useRecoilState } from "recoil";
import { Body41, Body6, IPark2, Rent_terms, Schemas } from "./api-client";
import { parkAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Confirmation from "@/components/ui/confirmation";

export const RentTermManager = () => {
  const [park, setPark] = useRecoilState(parkAtom);

  const [newRentTerm, setNewRentTerm] = useState({
    rent_term_id: undefined,
    deposit_amount_daily: undefined,
    deposit_amount_total: undefined,
    is_buyout_possible: undefined,
    name: undefined,
    minimum_period_days: undefined,
    schemas: [
      new Schemas({
        id: 0,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      }),
    ],
  });

  const [selectedId, setSelectedId] = useState(0);

  const getPark = async () => {
    const parkData: IPark2 = await client.getParkManager();
    setPark(parkData.park);
  };

  const createRentTerm = async () => {
    try {
      const newRentTermData = await client.createOrUpdateRentTermManager(
        new Body6({
          rent_term_id: undefined,
          deposit_amount_daily: newRentTerm.deposit_amount_daily,
          deposit_amount_total: newRentTerm.deposit_amount_total,
          is_buyout_possible: !!newRentTerm.is_buyout_possible,
          name: newRentTerm.name,
          minimum_period_days: newRentTerm.minimum_period_days,
          schemas: newRentTerm.schemas,
        })
      );

      const upsertedRentTerm = {
        is_buyout_possible: newRentTerm.is_buyout_possible,
        name: newRentTerm.name,
        minimum_period_days: newRentTerm.is_buyout_possible,
        schemas: [new Schemas(newRentTerm.schemas)],
        id: newRentTermData.id,
        deposit_amount_daily: newRentTerm.deposit_amount_daily,
      };
      setSelectedId(0);
      setPark({
        ...park,
        rent_terms: [
          ...rentTerms!.filter(
            (rentTerm) => rentTerm.id !== newRentTerm.rent_term_id
          ),
          new Rent_terms(upsertedRentTerm),
        ],
      });
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

  const updateRentTerm = async () => {
    try {
      await client.createOrUpdateRentTermManager(
        new Body6({
          rent_term_id: selected!.id,
          deposit_amount_daily: Number(selected.deposit_amount_daily),
          deposit_amount_total: Number(selected.deposit_amount_total),
          is_buyout_possible: !!selected.is_buyout_possible,
          name: selected.name,
          minimum_period_days: selected.minimum_period_days,
          schemas: selected.schemas!.map((schema) => new Schemas(schema)),
        })
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

  const handleInputNewRentTermChange = (
    value: string | boolean,
    param: keyof Rent_terms
  ) => {
    setNewRentTerm({
      ...newRentTerm,
      [param]: value,
    });
  };

  const handleInputRentTermChange = (
    value: string | boolean,
    param: keyof Rent_terms
  ) => {
    setPark({
      ...park,
      rent_terms: [
        ...rentTerms!.filter((rentTerm) => rentTerm.id !== selectedId),
        new Rent_terms({
          ...selected,
          [param]: value,
        }),
      ],
    });
  };

  const deleteSchema = async (id: number) => {
    await client.deleteSchemaManager(new Body41({ id: id }));
    getPark();
  };

  const handleInputNewRentTermSchemaChange = (
    value: string,
    param: keyof Schemas,
    id: number
  ) => {
    setNewRentTerm({
      ...newRentTerm,
      schemas: [
        ...newRentTerm.schemas!.filter((schema) => schema.id !== id),
        new Schemas({
          ...newRentTerm.schemas!.find((schema) => schema.id === id)!,
          [param]: value,
        }),
      ],
    });
  };

  const handleInputRentTermSchemaChange = (
    value: string,
    param: keyof Schemas,
    id: number
  ) => {
    setPark({
      ...park,
      rent_terms: [
        ...rentTerms!.filter((rentTerm) => rentTerm.id !== selectedId),
        new Rent_terms({
          ...selected,
          schemas: [
            ...selected.schemas!.filter((schema) => schema.id !== id),
            new Schemas({
              ...selected.schemas!.find((schema) => schema.id === id)!,
              [param]: value,
            }),
          ],
        }),
      ],
    });
  };

  const rentTerms = park!.rent_terms
    ?.slice()
    .sort((a, b) => a.name!.localeCompare(b.name!));

  const selected = rentTerms!.find(
    (rentTerm) => rentTerm.id === selectedId
  ) as Rent_terms;

  const addSchema = () => {
    if (newRentTerm.schemas && newRentTerm.schemas.length > 0) {
      const lastSchema = newRentTerm.schemas[newRentTerm.schemas.length - 1];
      const newId = lastSchema!.id! + 1;
      const newSchema = {
        id: newId,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      };
      if (newRentTerm.schemas.length < 10) {
        setNewRentTerm({
          ...newRentTerm,
          schemas: [...newRentTerm.schemas, new Schemas(newSchema)],
        });
      }
    }
  };

  const addSchemaUpdate = () => {
    if (selected.schemas && selected.schemas.length > 0) {
      const lastSchema = selected.schemas[selected.schemas.length - 1];
      const newId = lastSchema!.id! + 1;
      const newSchema = {
        id: newId,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      };
      if (selected.schemas.length < 10) {
        setPark({
          ...park,
          rent_terms: [
            ...rentTerms!.filter((rentTerm) => rentTerm.id !== selectedId),
            new Rent_terms({
              ...selected,
              schemas: [...selected.schemas, new Schemas(newSchema)],
            }),
          ],
        });
      }
    }
  };

  const dellNewSchema = (id: number) => {
    if (newRentTerm.schemas.length < 10) {
      setNewRentTerm({
        ...newRentTerm,
        schemas: [...newRentTerm.schemas.filter((schema) => schema.id !== id)],
      });
      getPark();
    }
  };

  const sortedSchemas = selected?.schemas
    ? [...selected.schemas].sort((a, b) => a.id! - b.id!)
    : [];

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
                <div
                  className={`${selectedId === x.id && "text-yellow"}`}
                  onClick={() => setSelectedId(x.id!)}
                >
                  {x.name}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-64 text-lg" onClick={() => setSelectedId(0)}>
            Создать
          </Button>
        </div>
        {selectedId === 0 && (
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <h3 className="my-4">Создание условий аренды</h3>
            {[
              {
                title: `Ежедневный депозит: ${
                  newRentTerm.deposit_amount_daily || ""
                }`,
                type: "nubmer",
                placeholder: "Введите значение",
                param: "deposit_amount_daily",
                value: newRentTerm.deposit_amount_daily || undefined,
              },
              {
                title: `Всего депозит: ${
                  newRentTerm.deposit_amount_total || ""
                }`,
                type: "number",
                placeholder: "Введите значение",
                param: "deposit_amount_total",
                value: newRentTerm.deposit_amount_total || undefined,
              },
              {
                title: `Возможность выкупа`,
                type: "checkbox",
                placeholder: "Введите значение",
                param: "is_buyout_possible",
                value: newRentTerm.is_buyout_possible,
              },
              {
                title: `Минимальный срок аренды в днях: ${
                  newRentTerm.minimum_period_days || ""
                }`,
                type: "number",
                placeholder: "Введите значение",
                param: "minimum_period_days",
                value: newRentTerm.minimum_period_days || undefined,
              },
              {
                title: `Название: ${newRentTerm.name || ""}`,
                type: "text",
                placeholder: "Введите значение",
                param: "name",
                value: newRentTerm.name || undefined,
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
                {input.type !== "checkbox" && (
                  <Input
                    onChange={(e) => {
                      handleInputNewRentTermChange(e.target.value, input.param);
                    }}
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                )}
                {input.type === "checkbox" && (
                  <Input
                    className="flex w-6 m-0 "
                    onChange={() => {
                      handleInputNewRentTermChange(!input.value, input.param);
                    }}
                    checked={!!input.value}
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between space-x-2">
              <h4>Схемы аренды:</h4>
              {newRentTerm.schemas!.length < 10 && (
                <Button className="w-1/2" onClick={addSchema}>
                  Добавить схему аренды
                </Button>
              )}
            </div>
            <div className="">
              {newRentTerm
                .schemas!.sort((a, b) => a.id - b.id)
                .sort((a, b) => a.id - b.id)
                .map((schema, i) => {
                  return (
                    <div key={`schema_${i}`}>
                      <div className="p-4 my-1 border border-grey rounded-xl">
                        {[
                          {
                            title: "Стоимость ежедневно",
                            type: "number",
                            placeholder: "Введите значение",
                            param: "daily_amount",
                            value: schema.daily_amount,
                          },
                          {
                            title: "Рабочих дней",
                            type: "number",
                            placeholder: "Введите значение",
                            param: "working_days",
                            value: schema.working_days,
                          },
                          {
                            title: "Нерабочих дней",
                            type: "number",
                            placeholder: "Введите значение",
                            param: "non_working_days",
                            value: schema.non_working_days,
                          },
                        ].map((input, index) => (
                          <div key={`input_${index}`}>
                            <div className="flex items-center justify-between">
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
                                value={input.value}
                              ></Input>
                            </div>
                          </div>
                        ))}
                        {newRentTerm.schemas!.length > 1 && (
                          <Button
                            variant={"manager"}
                            onClick={() => dellNewSchema(schema.id)}
                          >
                            Удалить схему
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <Confirmation
              accept={createRentTerm}
              cancel={() => {}}
              trigger={<Button className="w-60">Применить</Button>}
              title={"Создать условие аренды?"}
              type="green"
            />
          </div>
        )}
        {selectedId !== 0 && (
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <h3 className="my-4">Изменение условий аренды</h3>
            {[
              {
                title: `Ежедневный депозит: ${
                  selected.deposit_amount_daily || ""
                }`,
                type: "nubmer",
                placeholder: "Введите значение",
                param: "deposit_amount_daily",
                value: selected.deposit_amount_daily || undefined,
              },
              {
                title: `Всего депозит: ${selected.deposit_amount_total || ""}`,
                type: "number",
                placeholder: "Введите значение",
                param: "deposit_amount_total",
                value: selected.deposit_amount_total || undefined,
              },
              {
                title: `Возможность выкупа`,
                type: "checkbox",
                placeholder: "Введите значение",
                param: "is_buyout_possible",
                value: selected.is_buyout_possible,
              },
              {
                title: `Минимальный срок аренды в днях: ${
                  selected.minimum_period_days || ""
                }`,
                type: "number",
                placeholder: "Введите значение",
                param: "minimum_period_days",
                value: selected.minimum_period_days || undefined,
              },
              {
                title: `Название: ${selected.name || ""}`,
                type: "text",
                placeholder: "Введите значение",
                param: "name",
                value: selected.name || undefined,
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
                {input.type !== "checkbox" && (
                  <Input
                    onChange={(e) => {
                      handleInputRentTermChange(e.target.value, input.param);
                    }}
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                )}
                {input.type === "checkbox" && (
                  <Input
                    className="flex w-6 m-0 "
                    onChange={() => {
                      handleInputRentTermChange(!input.value, input.param);
                    }}
                    checked={!!input.value}
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between space-x-2">
              <h4>Схемы аренды:</h4>
              {selected.schemas!.length < 10 && (
                <Button className="w-1/2" onClick={addSchemaUpdate}>
                  Добавить схему аренды
                </Button>
              )}
            </div>
            <div className="">
              {sortedSchemas.map((schema, i) => (
                <div key={`schema_${i}`}>
                  <div className="p-4 my-1 border border-grey rounded-xl">
                    {[
                      {
                        title: `Стоимость ежедневно ${
                          schema?.daily_amount || 0
                        }`,
                        type: "number",
                        placeholder: "Введите значение",
                        param: "daily_amount",
                        value: schema.daily_amount || 0,
                      },
                      {
                        title: `Рабочих дней ${schema?.working_days || 0}`,
                        type: "number",
                        placeholder: "Введите значение",
                        param: "working_days",
                        value: schema.working_days || 0,
                      },
                      {
                        title: `Нерабочих дней ${
                          schema?.non_working_days || 0
                        }`,
                        type: "number",
                        placeholder: "Введите значение",
                        param: "non_working_days",
                        value: schema.non_working_days || 0,
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
                            handleInputRentTermSchemaChange(
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
                  {selected.schemas!.length > 1 && (
                    <Confirmation
                      accept={() => deleteSchema(schema.id!)}
                      cancel={() => {}}
                      title="Удалить схему?"
                      trigger={
                        <Button variant={"manager"}>Удалить схему</Button>
                      }
                      type="red"
                    />
                  )}
                </div>
              ))}
            </div>

            <Confirmation
              accept={updateRentTerm}
              cancel={() => {}}
              trigger={<Button className="w-60">Применить</Button>}
              title={"Создать условие аренды?"}
              type="green"
            />
          </div>
        )}
      </div>
    </>
  );
};
