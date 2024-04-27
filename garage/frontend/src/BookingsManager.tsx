import { useEffect, useState } from "react";
import { Body34, BookingStatus, Bookings } from "./api-client";
import { client } from "./backend";
import { useTimer } from "react-timer-hook";
import { getFormattedTimerValue } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Confirmation from "@/components/ui/confirmation";
import { Input } from "@/components/ui/input";
import { BookingTableManager } from "./BookingsTableManager";

const storedApprovedBookings = localStorage.getItem("approvedBookings");
const initialApprovedBookings = storedApprovedBookings
  ? JSON.parse(storedApprovedBookings)
  : [];

export const BookingsManager = () => {
  const [bookings, setBookings] = useState<Bookings[]>();
  const [selected, setSelected] = useState<Bookings>();
  const [isReasonSelect, setIsReasonSelect] = useState(false);
  const [approvedBookings, setApprovedBookings] = useState<number[]>(
    initialApprovedBookings
  );
  const [reason, setReason] = useState("Не выбрано");
  const [subReason, setSubReason] = useState("Не выбрано");
  const [commentReason, setCommentReason] = useState("");

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
      new Body34({ status: status, vin: selected!.car!.vin })
    );
    getBookings();
  };

  const canselBooking = async (status: BookingStatus) => {
    const reasonForUnbook =
      reason +
      (subReason === "Не выбрано" ? "" : " - " + subReason) +
      (commentReason ? "\nКомментарий: " + commentReason : "");
    console.log(reasonForUnbook);

    await client.updateCarBookingStatusManager(
      new Body34({
        status: status,
        vin: selected!.car!.vin,
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

  if (!bookings) {
    return <></>;
  }

  return (
    <>
      <BookingTableManager />
    </>
  );

  // return (
  //   <>
  //     <div className="flex justify-end h-full mt-4">
  //       {!!selected && isReasonSelect && (
  //         <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
  //           <div className="p-4 bg-white rounded-xl w-[552px]">
  //             <h3>Выберите причину отмены бронирования</h3>
  //             <select
  //               onChange={(e) => setReason(e.target.value)}
  //               name=""
  //               id=""
  //               className="w-full py-2 my-2 border-2 border-grey rounded-xl"
  //             >
  //               {reasonList.map((x) => (
  //                 <option selected={reason === x} value={x}>
  //                   {x}
  //                 </option>
  //               ))}
  //             </select>
  //             {!!subReasonItems.length && (
  //               <select
  //                 onChange={(e) => setSubReason(e.target.value)}
  //                 name=""
  //                 id=""
  //                 className="w-full py-2 mb-2 -mt-1 border-2 border-grey rounded-xl"
  //               >
  //                 {subReasonItems[0].subreasons.map((x) => (
  //                   <option selected={subReason === x} value={x}>
  //                     {x}
  //                   </option>
  //                 ))}
  //               </select>
  //             )}
  //             {reason === "Другое" && (
  //               <Input
  //                 type="text"
  //                 placeholder="Введите причину"
  //                 value={subReason}
  //                 onChange={(e) => setSubReason(e.target.value)}
  //               />
  //             )}
  //             <Input
  //               type="text"
  //               placeholder="Комментарий"
  //               value={commentReason}
  //               onChange={(e) => setCommentReason(e.target.value)}
  //             />
  //             <div className="flex items-center justify-end space-x-2">
  //               {reason !== "Не выбрано" && (
  //                 <div className="w-1/2">
  //                   <Confirmation
  //                     accept={() => canselBooking(BookingStatus.UnBooked)}
  //                     cancel={() => setIsReasonSelect(false)}
  //                     title={`Отменить бронирование №${selected.id}  ${
  //                       selected.car!.brand
  //                     } ${selected.car!.model}?`}
  //                     trigger={
  //                       <Button variant={"manager"}>Отмена брони</Button>
  //                     }
  //                     type="red"
  //                   />
  //                 </div>
  //               )}
  //               <Button
  //                 variant={"manager"}
  //                 onClick={() => setIsReasonSelect(false)}
  //               >
  //                 Назад
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //       <div className="flex justify-between w-full space-x-4 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
  //         {bookings.length === 0 && <div className="">Бронирований нет</div>}
  //         {bookings.length > 0 && (
  //           <>
  //             <div className="w-1/3 p-4 space-y-2 bg-white rounded-xl">
  //               {bookings!.map((booking) => (
  //                 <div key={booking.id} className="">
  //                   <div
  //                     onClick={() => setSelected(booking)}
  //                     className={`${
  //                       selected?.id === booking.id ? "text-yellow" : ""
  //                     }`}
  //                   >
  //                     Бронирование №{booking.id}
  //                   </div>
  //                   <Separator />
  //                 </div>
  //               ))}
  //             </div>
  //             {!!selected && (
  //               <div className="w-2/3 p-4 space-y-2 bg-white rounded-xl">
  //                 <div className="flex space-x-2">
  //                   <div className="w-1/2">
  //                     <p>
  //                       Авто: {selected.car!.brand} {selected.car!.model}{" "}
  //                       {selected.car!.year_produced}
  //                     </p>
  //                     <p>Г/н: {selected.car!.license_plate}</p>
  //                     <p>VIN: {selected.car!.vin}</p>
  //                     <p>Город: {selected.car!.division!.city!.name}</p>
  //                     <p>Подразделение: {selected.car!.division!.name}</p>
  //                     <p>
  //                       Схема аренды: {selected.schema!.working_days}/
  //                       {selected.schema!.non_working_days}{" "}
  //                       {selected.schema!.daily_amount}
  //                     </p>
  //                     <p>
  //                       До конца бронирования осталось{" "}
  //                       <span>
  //                         {getFormattedTimerValue(
  //                           days,
  //                           hours,
  //                           minutes,
  //                           seconds
  //                         )}
  //                       </span>
  //                     </p>
  //                     <p>Телефон водителя: {selected.driver!.user!.phone}</p>
  //                   </div>
  //                   <div className="w-1/2 space-y-2 ">
  //                     <Button
  //                       variant={"manager"}
  //                       onClick={() => setIsReasonSelect(true)}
  //                     >
  //                       Отмена брони
  //                     </Button>

  //                     {/* <Button variant={"manager"}>Продление брони</Button>
  //                     <Button variant={"manager"}>Смена авто</Button> */}
  //                     <div className="flex gap-2">
  //                       {!approvedBookings.includes(selected.id!) && (
  //                         <Confirmation
  //                           accept={() => HandleApprovedBookings(selected.id!)}
  //                           cancel={() => {}}
  //                           title="Подтвердить бронь?"
  //                           trigger={
  //                             <Button variant={"manager"}>
  //                               Подтвердить бронь
  //                             </Button>
  //                           }
  //                           type="green"
  //                         />
  //                       )}
  //                       {!!approvedBookings.length &&
  //                         approvedBookings.includes(selected.id!) && (
  //                           <Confirmation
  //                             accept={() =>
  //                               changeBookingStatus(BookingStatus.RentStart)
  //                             }
  //                             cancel={() => {}}
  //                             title="Выдать авто?"
  //                             trigger={
  //                               <Button variant={"manager"}>Выдать авто</Button>
  //                             }
  //                             type="green"
  //                           />
  //                         )}
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             )}
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );
};
