import { useEffect } from "react";
// import logo from "./assets/mon-garage.svg";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { client } from "./backend";
import { Finder } from "./Finder";
import { Account } from "./Account";
// import { ParkManager } from "./ParkManager";
import { DriverLogin } from "./DriverLogin";
import { Admin } from "./Admin";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { YMInitializer } from "react-yandex-metrika";

import {
  faArrowRightFromBracket,
  faClockRotateLeft,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { User, UserType } from "./api-client";
import { CityPicker } from "./CityPicker";
import { BookingDrawer } from "./BookingDrawer";
import { BookingTimer } from "./BookingTimer";
import Confirmation from "@/components/ui/confirmation";

function App() {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        (window as any).token = token;
        try {
          const userData = await client.getUser();

          setUser(userData.user!);
        } catch (error) {}
      }
    };

    checkAuth();
  }, []);
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
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1104px]">
          {/* <ParkManager /> */}
        </div>
      )}
      {user?.user_type === UserType.Admin && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1104px]">
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        </div>
      )}
      {(!user || user.user_type === UserType.Driver) && (
        <div className="max-w-sm p-4 mx-auto sm:max-w-[800px] lg:max-w-[1104px]">
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
  <div className="flex justify-between w-full space-x-4 p-4 my-4 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between  lg:max-w-[1104px]  text-white bg-black h-14 bg-opacity-85 rounded-2xl">
    <Link to="/" className="md:grow">
      <div className="flex items-end tracking-widest cursor-pointer">
        <div className="mr-2 text-sm font-semibold sm:text-xl"> BeeBeep </div>{" "}
        <div className="hidden font-regular sm:text-lg lg:block">
          {" "}
          - cервис аренды автомобилей{" "}
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
      <Link className="flex items-center hover:text-yellow" to="bookings">
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          className="h-4 cursor-pointer sm:h-5 md:hidden"
        />
        <div className="hidden text-xl cursor-pointer md:block">
          Моё бронирование
        </div>
      </Link>
    )}
    <div className="flex items-center cursor-pointer md:ml-auto md:flex md:justify-end md:w-44">
      <CityPicker />
    </div>
    {!user && (
      <Link className="flex items-center hover:text-yellow" to="login/driver">
        <FontAwesomeIcon
          icon={faRightToBracket}
          className="h-4 cursor-pointer sm:h-5"
        />
      </Link>
    )}
    {user && (
      <div className="flex items-center text-black">
        <Confirmation
          accept={LogoutHandler}
          cancel={() => {}}
          title="Выйти из аккаунта?"
          trigger={
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="h-4 text-white cursor-pointer sm:h-5 hover:text-yellow"
            />
          }
          type="red"
        />
      </div>
    )}
  </div>
);
