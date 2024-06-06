import { Login } from "./Login";

export const DriverLogin = () => {
  return (
    <>
      <div className="mx-auto w-80 sm:w-full">
        <h2 className="my-10 text-xl text-center">
          Зарегистрируйтесь или войдите в личный кабинет
        </h2>
        <Login cancel={() => {}} success={() => (window.location.href = "/")} />
      </div>
    </>
  );
};
