import { Button } from "@/components/ui/button";
import { BookingStatus, Bookings, User } from "./api-client";
import { useTimer } from "react-timer-hook";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { useEffect } from "react";
import Lottie from "react-lottie";
import dataAnimation from "./assets/hourglass.json";
import { getFormattedTimerValue } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const Animation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: dataAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={40} width={40} />;
};

export default Animation;

export const BookingTimer = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const location = useLocation();

  const activeBooking = user?.bookings!.find(
    (x) => x.status === BookingStatus.Booked
  );

  const { days, minutes, hours, seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      setUser(
        new User({
          ...user,
          bookings: [
            ...user.bookings!.filter((x) => x !== activeBooking),
            new Bookings({
              ...activeBooking,
              status: BookingStatus.BookingTimeOver,
              end_date: new Date().toISOString(),
            }),
          ],
        })
      );
    },
  });

  useEffect(() => {
    if (activeBooking) {
      restart(new Date(activeBooking.end_date!));
    }
  }, [activeBooking]);

  if (!activeBooking) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center content-center justify-center px-2 py-2 my-4 bg-white rounded-xl">
      <div className="">
        <Animation />
      </div>
      <div className="flex flex-col mb-2 text-lg text-center sm:flex-row sm:items-center sm:gap-2">
        До конца бронирования осталось:{" "}
        <span>{getFormattedTimerValue(days, hours, minutes, seconds)}</span>
      </div>
      <div className="flex w-full mb-2 space-x-1">
        {location.pathname !== "/bookings" && (
          <Button className="w-full  max-w-[300px] mx-auto">Подробнее</Button>
        )}
        {location.pathname === "/bookings" && (
          <p className="w-full text-center">
            Нажмите здесь, чтобы узнать маршрут до пункта проката, или нажмите
            на кнопку для звонка, если хотите связаться с нами.
          </p>
        )}
      </div>
    </div>
  );
};
