import { Button } from "@/components/ui/button";
import { BookingStatus, Bookings, User } from "./api-client";
import { useTimer } from "react-timer-hook";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { useEffect } from "react";
import Lottie from "react-lottie";
import dataAnimation from "./assets/hourglass.json";

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
              status: BookingStatus.UnBooked,
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
    <div className="flex flex-col items-center content-center justify-center px-2 py-2 my-4 font-semibold bg-white rounded-xl">
      <div className="">
        <Animation />
      </div>
      <div className="flex flex-col mb-2 text-lg text-center sm:flex-row sm:items-center sm:gap-2">
        До конца бронирования осталось:{" "}
        <span>
          {!!days && `${days}д:`}
          {(days !== 0 || minutes !== 0 || hours !== 0) &&
            `${hours}ч:${minutes}м`}
          {days === 0 && minutes === 0 && hours === 0 && `${seconds}c`}
        </span>
      </div>
      <div className="flex w-full mb-2 space-x-1 max-w-[300px]">
        {window.location.pathname !== "/bookings" && (
          <Button className="w-full">Подробнее</Button>
        )}
      </div>
    </div>
  );
};
