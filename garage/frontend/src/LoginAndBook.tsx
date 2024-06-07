import {
  Body16,
  Body21,
  BookingStatus,
  Bookings2,
  Cars3,
  Schema,
  User,
} from "./api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { client } from "./backend";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Login } from "./Login";
import ym from "react-yandex-metrika";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRoubles } from "@/lib/utils";
import Confirmation from "@/components/ui/confirmation";
import BookingAlert from "./booking-alert";
import { BookingCanceling } from "./BookingCanceling";

export const LoginAndBook = ({
  schemaId = undefined,
  car,
  close,
  isModal = true,
}: {
  car: Cars3 | undefined;
  close: () => void;
  isModal?: boolean;
  schemaId?: number | undefined;
}) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isBooked, setIsBooked] = useState(false);
  const [startCancelBooking, setStartCancelBooking] = useState(false);

  const [selectedSchema, setSelectedSchema] = useState(
    car!.rent_term!.schemas![0]!.id
  );

  const activeBooking = user?.bookings?.find(
    (x) => x.status === BookingStatus.Booked
  );

  const cancelBooking = async (reason: string) => {
    await client.cancelBooking(
      new Body21({
        id: activeBooking!.id,
        reason,
      })
    );
    setUser(
      new User({
        ...user,
        bookings: [
          ...user.bookings!.filter((x) => x !== activeBooking),
          new Bookings2({
            ...activeBooking,
            status: BookingStatus.UnBooked,
            end_date: new Date().toISOString(),
          }),
        ],
      })
    );
    ym("reachGoal", "tobook_tc_cancel", 96683881);

    book(user);
  };

  //  временно удаляем проверку на верификацию!!!
  const book = async (user: User, variant_id: number | null = null) => {
    // if (user.user_status === UserStatus.Verified) {
    const bookingData = await client.book(
      new Body16({
        id: variant_id ? variant_id : car!.id,
        schema_id: schemaId || selectedSchema,
      })
    );

    const potentialExistingBooking = activeBooking
      ? [
          new Bookings2({
            ...activeBooking,
            status: BookingStatus.UnBooked,
            end_date: new Date().toISOString(),
          }),
        ]
      : [];

    setUser(
      new User({
        ...user,
        bookings: [
          ...user.bookings!.filter((x) => x !== activeBooking),
          ...potentialExistingBooking,
          new Bookings2(bookingData.booking),
        ],
      })
    );
    setIsBooked(true);
    // close();
    ym("reachGoal", "tobook_tc", 96683881);
    // } else {
    //   navigate("account");
    // }
  };
  const { schemas } = car!.rent_term!;

  useEffect(() => {
    if (user && schemaId) {
      book(user);
    }
  }, []);

  const handleTariffChange = (value: string) => {
    setSelectedSchema(Number(value));
    ym("reachGoal", "select_tarif", 96683881);
  };

  const handleBook = (user: User) => {
    if (user?.bookings?.find((x) => x.status === BookingStatus.Booked)) {
      setStartCancelBooking(true);
    } else {
      book(user);
    }
  };

  const handleChangeReason = (value: string) => {
    setStartCancelBooking(false);
    cancelBooking(value);
  };

  return (
    <>
      {startCancelBooking && activeBooking && (
        <BookingCanceling
          booking={activeBooking}
          close={() => setStartCancelBooking(false)}
          success={(value) => handleChangeReason(value)}
        />
      )}
      {isBooked && <BookingAlert />}
      {!isBooked && (
        <div className="p-4 bg-white rounded-xl min-w-80">
          {!schemaId && <p className="">Выберите стоимость и схему дней</p>}
          <div className="">
            <div className="flex flex-wrap w-full gap-1 lg:pb-1">
              {!schemaId && (
                <div className="inset-x-0 flex justify-center w-full max-w-full px-0 py-2 mx-auto space-x-2 bg-white">
                  <Select
                    onValueChange={(value) => handleTariffChange(value)}
                    defaultValue={`${schemas![0].id}`}
                  >
                    <SelectTrigger
                      className={`w-full h-auto pt-0 pb-1 text-xl text-left border-none bg-grey rounded-xl max-w-full`}
                    >
                      <SelectValue placeholder="Схема аренды" />
                    </SelectTrigger>
                    <SelectContent className="z-[56] w-full h-auto p-1 pb-0 text-left border-none bg-grey rounded-xl">
                      {schemas!.map((currentSchema: Schema, i: number) => (
                        <SelectItem
                          className="mb-1 border rounded-xl border-zinc-300 "
                          key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                          value={`${currentSchema.id}`}
                        >
                          {`${formatRoubles(currentSchema.daily_amount!)}`}
                          <div className="text-xs font-medium text-black ">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!user && (
                <p className="">
                  {!schemaId && "И "} оставьте свой номер телефона. Менеджер
                  свяжется с вами в ближайшее время!
                </p>
              )}
              {user && (
                <div className="flex w-full space-x-1">
                  {isModal && (
                    <Button
                      onClick={() => close()}
                      className="w-1/2 text-black "
                      variant={"reject"}
                    >
                      Отмена
                    </Button>
                  )}
                  {!activeBooking && (
                    <div
                      className={`relative  ${isModal ? "w-1/2" : "w-full"} `}
                    >
                      <Button onClick={() => handleBook(user)} className="">
                        Забронировать
                      </Button>
                    </div>
                  )}
                  {!!activeBooking && (
                    <div
                      className={`relative  ${isModal ? "w-1/2" : "w-full"} `}
                    >
                      <Confirmation
                        title={`У вас есть активная бронь:
                        ${activeBooking.car?.brand}
                        ${activeBooking.car?.model}`}
                        text={`Отменить и забронировать ${car!.brand} ${
                          car!.model
                        }`}
                        type="green"
                        accept={() => handleBook(user)}
                        cancel={() => {}}
                        trigger={<Button className="">Забронировать</Button>}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {!user && (
            <div className="mb-4">
              <Login
                isModal={isModal}
                cancel={() => close()}
                success={(user) => handleBook(user)}
                hiddenRegister={true}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
