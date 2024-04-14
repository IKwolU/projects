import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, IPark2 } from "./api-client";
import { parkAtom, userAtom } from "./atoms";
import { client } from "./backend";

export const BookingsManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useRecoilState(parkAtom);

  useEffect(() => {
    if (user.user_type === UserType.Manager && !park) {
      const getPark = async () => {
        const parkData: IPark2 = await client.getParkManager();
        setPark(parkData.park);
      };

      getPark();
    }
  }, []);

  if (!park) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="flex justify-between w-full space-x-4 cursor-pointer sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]"></div>
      </div>
    </>
  );
};
