import { Button } from "@/components/ui/button";
import { Body22, BookingStatus, Bookings2, User } from "./api-client";
import { useTimer } from "react-timer-hook";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import dataAnimation from "./assets/hourglass.json";
import { getFormattedTimerValue } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { client } from "./backend";

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
  const [isUnbooked, setIsUnbooked] = useState(false);
  const [expiryTime, setExpiryTime] = useState(new Date());

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
            new Bookings2({
              ...activeBooking,
              status: BookingStatus.BookingTimeOver,
              end_date: new Date().toISOString(),
            }),
          ],
        })
      );
      setIsUnbooked(true);
    },
  });

  useEffect(() => {
    if (activeBooking) {
      restart(new Date(activeBooking.end_date!));
    }
  }, [activeBooking]);

  const checkActiveBooking = async () => {
    if (activeBooking) {
      const response = await client.checkActiveBookingDriver(
        new Body22({ id: activeBooking.id })
      );
      if (response.result) {
        const userData = await client.getUser();
        setUser(userData.user!);
        setIsUnbooked(true);
      }
    }
  };

  const intervalTime = new Date();
  intervalTime.setSeconds(intervalTime.getSeconds() + 60);

  useTimer({
    expiryTimestamp: expiryTime,
    autoStart: true,
    onExpire: () => {
      checkActiveBooking();
      const newExpiryTime = new Date();
      newExpiryTime.setSeconds(newExpiryTime.getSeconds() + 60);
      setExpiryTime(newExpiryTime);
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkActiveBooking();
      setExpiryTime(new Date());
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (!activeBooking) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center content-center justify-center px-2 py-2 my-4 bg-white rounded-xl">
      {isUnbooked && (
        <div className="fixed left-0 top-0 w-full h-full z-[54] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-2xl max-w-80 md:max-w-[600px] h-fit">
            <h3 className="text-center">Бронирование завершено!</h3>
            <p className="pb-4 text-center">Ваша бронь была завершена.</p>
            <Link to="/" className="">
              <Button variant={"default"} onClick={() => setIsUnbooked(false)}>
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className="">
        <Animation />
      </div>
      <div className="pl-1 mt-2 text-lg text-center md:text-xl">
        <p className="w-full text-lg text-center">Вы забронировали</p>
        <h1 className="">
          {`${activeBooking.car!.brand} ${activeBooking.car!.model}`}{" "}
          {activeBooking.car!.year_produced}
        </h1>
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
            В течение 15 минут менеджер парка свяжется с Вами для уточнения
            деталей бронирования.
          </p>
        )}
      </div>
    </div>
  );
};
