import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BookingAlert = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("bookings", {
      state: {
        bookingAttempt: true,
      },
    });
  };

  return (
    <div className="fixed left-0 top-0 w-full h-full z-[54] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-2xl max-w-80 md:max-w-[600px] h-fit">
        <h3 className="text-center">Бронирование подтверждено!</h3>
        <p className="pb-4 text-center">
          Ваша машина была успешно забронирована. Вы можете ознакомиться с
          подробностями бронирования, нажав на кнопку ниже.
        </p>
        <Button onClick={handleClick} className="mt-10 w-60">
          Смотреть бронирвание
        </Button>
      </div>
    </div>
  );
};
export default BookingAlert;
