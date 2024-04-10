import { useEffect, useRef, useState } from "react";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Body8, Body9 } from "./api-client";
import React from "react";
import { useTimer } from "react-timer-hook";
import { useLocation } from "react-router-dom";
import PhoneInput from "@/components/ui/phone-input";
import ym from "react-yandex-metrika";

export const DriverLogin = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get("code");

  const CODE_LENGTH = 4;

  const [codeRequested, setRequested] = useState(false);
  const [codeHasError, setCodeHasError] = useState(false);
  const [codeAttempts, setCodeAttempts] = useState(0);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(0);

  const inputRef = useRef<any>(null);

  const getCode = async () => {
    const time = new Date();
    codeAttempts < 3
      ? time.setSeconds(time.getSeconds() + 60)
      : time.setSeconds(time.getSeconds() + 300);
    codeAttempts < 3 ? setCodeAttempts(codeAttempts + 1) : setCodeAttempts(0);
    await client.createAndSendCode(new Body9({ phone }));
    setRequested(true);
    restart(time);
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 100);
  };

  const login = async () => {
    try {
      const loginData = await client.loginOrRegister(
        new Body8({ phone, code, referral_code: referralCode })
      );

      localStorage.setItem("token", loginData.token!);

      if (loginData.register) {
        ym("reachGoal", "registr_completed", 96683881);
      }
      if (!loginData.register) {
        ym("reachGoal", "avtorization", 96683881);
      }

      window.location.href = "/";
    } catch (error) {
      setCodeHasError(true);
    }
  };

  const { minutes, seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });

  useEffect(() => {
    const storedTimerState = localStorage.getItem("timerState");
    const storedPhoneState = localStorage.getItem("phone");
    if (storedPhoneState) {
      setPhone(JSON.parse(storedPhoneState));
    }
    if (storedTimerState) {
      const timerState = JSON.parse(storedTimerState);
      if (timerState) {
        const expiryTimestamp = new Date(
          new Date().getTime() +
            timerState.minutes * 60 * 1000 +
            timerState.seconds * 1000
        );
        setRequested(true);
        restart(expiryTimestamp);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timerState", JSON.stringify({ minutes, seconds }));
    localStorage.setItem("phone", JSON.stringify(phone));
  }, [minutes, seconds]);

  const handleFocus = () => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef!.current!.setSelectionRange(0, 0);
        inputRef!.current!.click();
      }, 300);
    }
  };

  useEffect(() => {
    if (!codeRequested) {
      localStorage.removeItem("timerState");
      localStorage.removeItem("phone");
    }
  }, [codeRequested]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCode(parseInt(e.target.value));

  const handleInput = ({ target: { value } }: any) => setPhone(value);

  return (
    <>
      <div className="mx-auto w-80 sm:w-full">
        <h2 className="my-10 text-xl text-center">
          Зарегистрируйтесь или войдите в личный кабинет
        </h2>

        <div className="max-w-sm mx-auto">
          <Label className="text-lg">Введите ваш телефон</Label>
          <PhoneInput onChange={handleInput} />

          {codeRequested && (
            <>
              <Label className="text-lg" htmlFor="code">
                Введите код из смс
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                ref={inputRef}
                className="h-12 p-4 mt-1 text-lg md:mt-2"
                onChange={handleCodeChange}
                id="code"
                placeholder="_ _ _ _"
                onFocus={handleFocus}
                autoFocus={true}
              />
              {codeHasError && (
                <p className="my-4 text-lg text-center text-red">
                  Вы ввели неправильный код
                </p>
              )}
            </>
          )}

          <div className="space-y-6 text-center">
            {!codeRequested && (
              <Button className="text-lg" onAsyncClick={getCode}>
                Получить код
              </Button>
            )}
            {codeRequested && !(!!minutes || !!seconds) && (
              <Button
                className="text-lg text-black"
                variant={"reject"}
                onAsyncClick={getCode}
              >
                Отправить код повторно
              </Button>
            )}
            {(!!minutes || !!seconds) && (
              <Button className="text-base bg-lightgrey active:bg-lightgrey hover:bg-lightgrey">
                Повторная отправка через: ({`${minutes}:${seconds}`})
              </Button>
            )}
            {codeRequested && (
              <Button
                className="text-lg"
                onAsyncClick={login}
                disabled={code.toString().length != CODE_LENGTH}
              >
                Войти
              </Button>
            )}
          </div>

          {codeRequested && (
            <div className="flex flex-col my-4 text-base text-center">
              Нажимая &laquo;Войти&raquo; вы соглашаетесь с{" "}
              <a className="text-base text-blue-800 underline" href="kwol.ru">
                условиями договора
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
