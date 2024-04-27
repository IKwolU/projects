import { useEffect, useState } from "react";
import {
  Body34,
  BookingStatus,
  Bookings,
  CancellationSources,
} from "./api-client";
import { client } from "./backend";
import { useTimer } from "react-timer-hook";
import {
  getCancelationSourceDisplayName,
  getFormattedTimerValue,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Confirmation from "@/components/ui/confirmation";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableItem,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CityPicker } from "./CityPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecoilState } from "recoil";
import { cityAtom, parkAtom } from "./atoms";
import { format } from "date-fns";

const storedApprovedBookings = localStorage.getItem("approvedBookings");
const initialApprovedBookings = storedApprovedBookings
  ? JSON.parse(storedApprovedBookings)
  : [];

type BookingFilter = {
  startDate: string | undefined;
  endDate: string | undefined;
  status: string | undefined;
  divisionId: number | undefined;
  model: string | undefined;
  licensePlate: string | undefined;
  phone: string | undefined;
  reason: string | undefined;
};

export const BookingManager = () => {
  const [bookings, setBookings] = useState<Bookings[]>();
  const [selected, setSelected] = useState<Bookings>();
  const [isReasonSelect, setIsReasonSelect] = useState(false);
  const [approvedBookings, setApprovedBookings] = useState<number[]>(
    initialApprovedBookings
  );
  const [reason, setReason] = useState("Не выбрано");
  const [subReason, setSubReason] = useState("Не выбрано");
  const [commentReason, setCommentReason] = useState("");
  const [park, setPark] = useRecoilState(parkAtom);
  const [city] = useRecoilState(cityAtom);

  const [filters, setFilters] = useState<BookingFilter>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    divisionId: undefined,
    licensePlate: undefined,
    model: undefined,
    phone: undefined,
    reason: undefined,
  });

  const getBookings = async () => {
    const data = await client.getParkBookingsManager();
    setBookings(data.bookings!);
  };
  useEffect(() => {
    getBookings();
  }, []);

  const { days, minutes, hours, seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      getBookings();
    },
  });

  useEffect(() => {
    if (selected) {
      restart(new Date(selected.end_date!));
    }
  }, [selected]);

  const changeBookingStatus = async (status: BookingStatus) => {
    await client.updateCarBookingStatusManager(
      new Body34({ status: status, vin: selected!.car!.car_id })
    );
    getBookings();
  };

  const canselBooking = async (status: BookingStatus) => {
    const reasonForUnbook =
      reason +
      (subReason === "Не выбрано" ? "" : " - " + subReason) +
      (commentReason ? "\nКомментарий: " + commentReason : "");

    await client.updateCarBookingStatusManager(
      new Body34({
        status: status,
        vin: selected!.car!.car_id,
        reason: reasonForUnbook,
      })
    );
    getBookings();
    setIsReasonSelect(false);
  };
  const HandleApprovedBookings = (id: number) => {
    setApprovedBookings([...approvedBookings, id]);
    localStorage.setItem(
      "approvedBookings",
      JSON.stringify([...approvedBookings, id])
    );
  };

  const reasonList = [
    "Не выбрано",
    "Передумал",
    "Не подходит для работы в такси",
    "Не отвечает",
    "Нет ID КИСАРТ (Москва и МО)",
    "Изменение даты бронирования",
    "Не понравилась модель машины",
    "Не устроили условия аренды",
    "Другое",
  ];
  const driverReasonList = [
    "Изменились планы",
    "Не понравилась модель машины",
    "Не устроили условия аренды",
    "Со мной не связались",
  ];
  const subReasonList = [
    {
      reason: "Не подходит для работы в такси",
      subreasons: [
        "Не выбрано",
        "Иностранное ВУ",
        "Стаж менее 3 лет",
        "Возраст",
      ],
    },
  ];

  const subReasonItems = subReasonList.filter((y) => y.reason === reason);

  const activeBookings = bookings
    ? bookings.filter((x) => x.status === BookingStatus.Booked)
    : [];

  const bookingStatusForManager = (
    status: BookingStatus,
    source: CancellationSources | undefined
  ) => {
    if (status === BookingStatus.Booked) {
      return "Активно";
    }
    if (status === BookingStatus.RentStart) {
      return "Аренда";
    }
    if (source) {
      return getCancelationSourceDisplayName(source);
    }
    return "Отменена";
  };

  const unBookingReasonForManager = (
    status: BookingStatus,
    reason: string | undefined
  ) => {
    if (status === BookingStatus.Booked) {
      return "Активно";
    }
    if (status === BookingStatus.RentStart) {
      return "Аренда";
    }
    if (reason) {
      return reason;
    }
    return "Нет инфо";
  };

  const filterByDate = (date: string) => {
    if (filters.startDate) {
      if (date < filters.startDate) {
        return false;
      }
    }
    if (filters.endDate) {
      if (date > filters.endDate) {
        return false;
      }
    }
    return true;
  };

  const filterByStatus = (
    status: BookingStatus,
    sourse: CancellationSources | undefined
  ) => {
    if (filters.status && filters.status !== "all") {
      if (filters.status !== bookingStatusForManager(status, sourse)) {
        return false;
      }
    }
    return true;
  };

  const filterByReason = (reason: string | undefined) => {
    if (filters.reason && filters.reason !== "all") {
      if (filters.reason !== reason) {
        return false;
      }
    }
    return true;
  };

  const filterByDivision = (id: number) => {
    if (filters.divisionId) {
      if (filters.divisionId !== id) {
        return false;
      }
    }
    return true;
  };

  const filterByModel = (brand: string, model: string) => {
    if (filters.model) {
      if (
        !brand.toLowerCase().includes(filters.model.toLowerCase()) &&
        !model.toLowerCase().includes(filters.model.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  };

  const filterByLicensePlate = (licensePlate: string) => {
    if (filters.licensePlate) {
      if (
        !licensePlate.toLowerCase().includes(filters.licensePlate.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  };

  const filterByPhone = (phone: string) => {
    if (filters.phone) {
      if (!phone.toLowerCase().includes(filters.phone.toLowerCase())) {
        return false;
      }
    }
    return true;
  };

  const filteredBookings = bookings?.filter(
    (x) =>
      filterByDate(x.booked_at!) &&
      filterByStatus(x.status!, x.cancellation_source) &&
      x.car!.division!.city!.name === city &&
      filterByDivision(x.car!.division!.id!) &&
      filterByModel(x.car!.brand!, x.car!.model!) &&
      filterByLicensePlate(x.car!.license_plate!) &&
      filterByPhone(x.driver!.user!.phone!) &&
      filterByReason(x.cancellation_reason!)
  );

  if (!bookings) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        {!!selected && isReasonSelect && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="p-4 bg-white rounded-xl w-[552px]">
              <h3>Выберите причину отмены бронирования</h3>
              <select
                onChange={(e) => setReason(e.target.value)}
                name=""
                id=""
                className="w-full py-2 my-2 border-2 border-grey rounded-xl"
              >
                {reasonList.map((x) => (
                  <option selected={reason === x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {!!subReasonItems.length && (
                <select
                  onChange={(e) => setSubReason(e.target.value)}
                  name=""
                  id=""
                  className="w-full py-2 mb-2 -mt-1 border-2 border-grey rounded-xl"
                >
                  {subReasonItems[0].subreasons.map((x) => (
                    <option selected={subReason === x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              )}
              {reason === "Другое" && (
                <Input
                  type="text"
                  placeholder="Введите причину"
                  value={subReason}
                  onChange={(e) => setSubReason(e.target.value)}
                />
              )}
              <Input
                type="text"
                placeholder="Комментарий"
                value={commentReason}
                onChange={(e) => setCommentReason(e.target.value)}
              />
              <div className="flex items-center justify-end space-x-2">
                {reason !== "Не выбрано" && (
                  <div className="w-1/2">
                    <Confirmation
                      accept={() => canselBooking(BookingStatus.UnBooked)}
                      cancel={() => setIsReasonSelect(false)}
                      title={`Отменить бронирование №${selected.id}  ${
                        selected.car!.brand
                      } ${selected.car!.model}?`}
                      trigger={
                        <Button variant={"manager"}>Отмена брони</Button>
                      }
                      type="red"
                    />
                  </div>
                )}
                <Button
                  variant={"manager"}
                  onClick={() => setIsReasonSelect(false)}
                >
                  Назад
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between w-full space-x-4 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
          {activeBookings!.length === 0 && (
            <div className="">Бронирований нет</div>
          )}
          {activeBookings!.length > 0 && (
            <>
              <div className="w-1/3 p-4 space-y-2 bg-white rounded-xl">
                {activeBookings!.map((booking) => (
                  <div key={booking.id} className="">
                    <div
                      onClick={() => setSelected(booking)}
                      className={`${
                        selected?.id === booking.id ? "text-yellow" : ""
                      }`}
                    >
                      Бронирование №{booking.id}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
              {!!selected && (
                <div className="w-2/3 p-4 space-y-2 bg-white rounded-xl">
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <p>
                        Авто: {selected.car!.brand} {selected.car!.model}{" "}
                        {selected.car!.year_produced}
                      </p>
                      <p>Г/н: {selected.car!.license_plate}</p>
                      <p>VIN: {selected.car!.car_id}</p>
                      <p>Город: {selected.car!.division!.city!.name}</p>
                      <p>Подразделение: {selected.car!.division!.name}</p>
                      <p>
                        Схема аренды: {selected.schema!.working_days}/
                        {selected.schema!.non_working_days}{" "}
                        {selected.schema!.daily_amount}
                      </p>
                      <p>
                        До конца бронирования осталось{" "}
                        <span>
                          {getFormattedTimerValue(
                            days,
                            hours,
                            minutes,
                            seconds
                          )}
                        </span>
                      </p>
                      <p>Телефон водителя: {selected.driver!.user!.phone}</p>
                    </div>
                    <div className="w-1/2 space-y-2 ">
                      <Button
                        variant={"manager"}
                        onClick={() => setIsReasonSelect(true)}
                      >
                        Отмена брони
                      </Button>

                      {/* <Button variant={"manager"}>Продление брони</Button>
                      <Button variant={"manager"}>Смена авто</Button> */}
                      <div className="flex gap-2">
                        {!approvedBookings.includes(selected.id!) && (
                          <Confirmation
                            accept={() => HandleApprovedBookings(selected.id!)}
                            cancel={() => {}}
                            title="Подтвердить бронь?"
                            trigger={
                              <Button variant={"manager"}>
                                Подтвердить бронь
                              </Button>
                            }
                            type="green"
                          />
                        )}
                        {!!approvedBookings.length &&
                          approvedBookings.includes(selected.id!) && (
                            <Confirmation
                              accept={() =>
                                changeBookingStatus(BookingStatus.RentStart)
                              }
                              cancel={() => {}}
                              title="Выдать авто?"
                              trigger={
                                <Button variant={"manager"}>Выдать авто</Button>
                              }
                              type="green"
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 space-x-2 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
        <div className="flex items-center space-x-1">
          <div className="flex items-center p-1 space-x-1 text-xl border-2 border-grey rounded-xl">
            {" "}
            <span>с</span>{" "}
            <Input
              type="date"
              className="m-0"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />{" "}
            <span>по</span>{" "}
            <Input
              type="date"
              className="m-0"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
          <Select
            onValueChange={(value) => setFilters({ ...filters, status: value })}
            // onValueChange={(value) => handleTariffChange(value)}
            defaultValue={`all`}
          >
            <SelectTrigger className="flex items-center w-auto px-1 py-2 text-base font-normal text-left border-2 bg-lightgrey border-grey rounded-xl">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-lightgrey rounded-xl">
              <SelectItem
                className="mb-1 border rounded-xl border-zinc-300 "
                value="all"
              >
                Статус
              </SelectItem>
              <SelectItem
                className="mb-1 border rounded-xl border-zinc-300 "
                value="Active"
              >
                Активно
              </SelectItem>
              {Object.values(CancellationSources)!.map(
                (source: CancellationSources, i: number) => (
                  <SelectItem
                    className="mb-1 border rounded-xl border-zinc-300 "
                    key={`${source}_${i}`}
                    value={`${source}`}
                  >
                    {getCancelationSourceDisplayName(source)}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <div className="px-1 py-4 text-base border-2 border-grey rounded-xl">
            <CityPicker />
          </div>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, divisionId: Number(value) })
            }
            // onValueChange={(value) => handleTariffChange(value)}
            defaultValue={`all`}
          >
            <SelectTrigger className="flex items-center w-auto px-1 py-2 text-base font-normal text-left border-2 bg-lightgrey border-grey rounded-xl">
              <SelectValue placeholder="Подразделение" />
            </SelectTrigger>
            <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-lightgrey rounded-xl">
              <SelectItem
                className="mb-1 border rounded-xl border-zinc-300 "
                value="all"
              >
                Подразделение
              </SelectItem>
              {park.divisions!.map((division, i: number) => (
                <SelectItem
                  className="mb-1 border rounded-xl border-zinc-300 "
                  key={`${division.id}_${i}`}
                  value={`${division.id}`}
                >
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            type="text"
            placeholder="Марка"
            className="w-20 h-full px-1 py-2 m-0 border-2 bg-lightgrey border-grey rounded-xl"
          />
          <Input
            onChange={(e) =>
              setFilters({ ...filters, licensePlate: e.target.value })
            }
            type="text"
            placeholder="Гос номер "
            className="w-20 h-full px-1 py-2 m-0 border-2 bg-lightgrey border-grey rounded-xl"
          />
          <Input
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
            type="text"
            placeholder="Телефон"
            className="w-20 h-full px-1 py-2 m-0 border-2 bg-lightgrey border-grey rounded-xl"
          />
          <Select
            onValueChange={(value) => setFilters({ ...filters, reason: value })}
            // onValueChange={(value) => handleTariffChange(value)}
            defaultValue={`all`}
          >
            <SelectTrigger className="flex items-center w-auto px-1 py-2 text-base font-normal text-left border-2 max-w-40 bg-lightgrey border-grey rounded-xl">
              <SelectValue placeholder="Подразделение" />
            </SelectTrigger>
            <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-lightgrey rounded-xl">
              <SelectItem
                className="mb-1 border rounded-xl border-zinc-300 "
                value="all"
              >
                Причина отмены
              </SelectItem>
              {driverReasonList.map((reason, i: number) => (
                <SelectItem
                  className="mb-1 border rounded-xl border-zinc-300 "
                  key={`${reason}_${i}`}
                  value={reason}
                >
                  {reason}
                </SelectItem>
              ))}
              {reasonList.map((reason, i: number) => (
                <SelectItem
                  className="mb-1 border rounded-xl border-zinc-300 "
                  key={`${reason}_${i}`}
                  value={reason}
                >
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 space-x-2 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
        <Table>
          <TableHead>
            <TableRow>
              <TableItem>Дата</TableItem>
              <TableItem>Время</TableItem>
              <TableItem>ID</TableItem>
              <TableItem>Статус</TableItem>
              <TableItem>Город</TableItem>
              <TableItem>Колонна</TableItem>
              <TableItem>Марка автомобиля</TableItem>
              <TableItem>Гос номер</TableItem>
              <TableItem>График работы</TableItem>
              <TableItem>Телефон</TableItem>
              <TableItem>Причина отмены</TableItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings?.map(function (booking, i) {
              return (
                <>
                  {booking && (
                    <TableRow key={`booking_${i}`}>
                      <TableItem>
                        {format(booking.booked_at!, "dd.MM.yyyy")}
                      </TableItem>
                      <TableItem>
                        {format(booking.booked_at!, "HH:mm")}
                      </TableItem>
                      <TableItem>{booking.id}</TableItem>
                      <TableItem
                        className={`${
                          bookingStatusForManager(
                            booking.status!,
                            booking.cancellation_source
                          ) === "Активно"
                            ? "text-green-800"
                            : "text-zinc-500"
                        }`}
                      >
                        {bookingStatusForManager(
                          booking.status!,
                          booking.cancellation_source
                        )}
                      </TableItem>
                      <TableItem>{booking.car!.division!.city!.name}</TableItem>
                      <TableItem>{booking.car!.division!.name}</TableItem>
                      <TableItem>
                        {booking.car!.brand} {booking.car!.model}
                      </TableItem>
                      <TableItem>{booking.car!.license_plate}</TableItem>
                      <TableItem>
                        {booking.schema!.working_days}/
                        {booking.schema!.non_working_days}
                      </TableItem>
                      <TableItem>{booking.driver!.user!.phone}</TableItem>
                      <TableItem>
                        {unBookingReasonForManager(
                          booking.status!,
                          booking.cancellation_reason
                        )}
                      </TableItem>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
