import { useEffect, useState } from "react";
// import logo from "./assets/mon-garage.svg";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { client } from "./backend";
import { Finder } from "./Finder";
import { Account } from "./Account";
import { ParkManager } from "./ParkManager";
import { DriverLogin } from "./DriverLogin";
import { Admin } from "./Admin";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { YMInitializer } from "react-yandex-metrika";

import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { User, UserType } from "./api-client";
import { CityPicker } from "./CityPicker";
import { BookingDrawer } from "./BookingDrawer";
import { BookingTimer } from "./BookingTimer";
import Confirmation from "@/components/ui/confirmation";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Terms } from "./Terms";

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        (window as any).token = token;
        try {
          const userData = await client.getUser();

          setUser(userData.user!);
        } catch (error) {
          //
        } finally {
          setLoaded(true);
        }
      }
    };

    checkAuth();
  }, []);

  if (!loaded) {
    return (
      <>
        <div className="">Loading...</div>
      </>
    );
  }

  return (
    <>
      <YMInitializer
        accounts={[96683881]}
        options={{
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: "dataLayer",
        }}
      />
      {user?.user_type === UserType.Manager && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1208px]">
          <ParkManager />
        </div>
      )}
      {user?.user_type === UserType.Admin && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1208px]">
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        </div>
      )}
      {(!user || user.user_type === UserType.Driver) && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1208px]">
          <div className="flex items-end justify-end mb-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="h-4 mr-2 sm:h-5 text-gray mb-0.5"
            />
            <CityPicker />
          </div>
          <Separator />
          <div className="flex justify-between my-0 space-x-2">
            <Menu user={user} />
            {/* <span className="font-bold text-md text-gray"></span> */}
          </div>
          <Link to="bookings">
            <BookingTimer />
          </Link>
          <Routes>
            <Route path="/" element={<Finder />} />
            <Route path="account" element={<Account user={user} />} />
            <Route path="bookings" element={<BookingDrawer />} />
            {!user && <Route path="login/driver" element={<DriverLogin />} />}
          </Routes>
        </div>
      )}
      {!user && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1208px]">
          <Routes>
            <Route path="/termsofuse" element={<Terms />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;

const LogoutHandler = () => {
  client.logout();
  localStorage.clear();
  window.location.href = "/";
};

const Menu = ({ user }: { user: User }) => (
  <div className="flex items-start justify-between w-full space-x-4 sm:mx-0 sm:mb-2 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between  lg:max-w-[1208px]">
    <Link to="/" className="">
      <div className="flex flex-col md:flex-row md:items-end">
        <div className="mr-6 text-2xl font-bold sm:text-3xl"> BeeBeep </div>{" "}
        <div className="font-regular sm:text-lg">
          {" "}
          cервис аренды автомобилей{" "}
        </div>
      </div>
      {/* <img className="h-5 sm:h-7" src={logo} alt="logo" /> */}
    </Link>
    {/* <Link className="hover:text-yellow" to="/">
      <FontAwesomeIcon icon={faTaxi} className="h-4 sm:h-5" />
    </Link>{" "} */}
    {/* {user && (
      <Link
        className="flex items-center hover:text-yellow"
        to={user ? "account" : "login/driver"}
      >
        <FontAwesomeIcon
          icon={faUser}
          className="h-4 cursor-pointer sm:h-5 md:hidden"
        />
        <div className="hidden text-xl cursor-pointer md:block">Кабинет</div>
      </Link>
    )} */}
    {user && (
      <Popover>
        <PopoverTrigger asChild>
          <FontAwesomeIcon icon={faBars} className="mt-2 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-64 mx-4 space-y-1 rounded-xl">
          <Link
            className="flex items-center p-2 text-base hover:bg-grey hover:rounded-md"
            to="bookings"
          >
            Моё бронирование
          </Link>
          {/* <Separator /> */}
          <Link
            className="flex items-center p-2 text-base hover:bg-grey hover:rounded-md"
            target="_blank"
            to="https://forms.yandex.ru/cloud/6617d44102848f0fb4b9bbf5/"
          >
            {/* <FontAwesomeIcon
              icon={faPhoneVolume}
              className="h-4 mr-2 sm:h-5 hover:text-yellow"
            /> */}
            Поддержка
          </Link>
          {/* <Separator /> */}
          {/* <CommandGroup className="w-[200px] p-0 h-96 overflow-y-scroll">
          {allCities.map((c: string) => (
            <CommandItem
              key={c}
              value={c}
              onSelect={() => {
                setCity(c);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  city === c ? "opacity-100" : "opacity-0"
                )}
              />
              {c}
            </CommandItem>
          ))}
        </CommandGroup> */}

          <div className="flex items-center text-black cursor-pointer">
            <Confirmation
              accept={LogoutHandler}
              cancel={() => {}}
              title="Выйти из аккаунта?"
              trigger={
                <div className="flex items-center p-2 cursor-pointer hover:bg-grey hover:rounded-md">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="h-4 mr-2 transition-all duration-300 rounded-md sm:h-5"
                  />
                  <span>Выйти</span>
                </div>
              }
              type="red"
            />
          </div>
        </PopoverContent>
      </Popover>
    )}
    {!user && (
      <Link
        className="flex items-center mt-2 hover:text-gray"
        to="login/driver"
      >
        <Button variant="outline" style={{ width: "105px", flexShrink: 0 }}>
          {" "}
          <div className="flex items-center justify-center">
            <FontAwesomeIcon
              icon={faArrowRightToBracket}
              className="h-4 mr-2 cursor-pointer sm:h-5"
            />
            <span className=" sm:text-base">Войти</span>
          </div>
        </Button>
      </Link>
    )}
  </div>
);
