import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, IPark2, Divisions2 } from "./api-client";
import { userAtom } from "./atoms";
import { client } from "./backend";

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useState<IPark2 | undefined>();

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        try {
          const parkData = await client.getPark();
          setPark(parkData.park![0]);
        } catch (error) {}
      };
      getPark();
    }
  }, []);

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }

  const divisions = park!.divisions! as Divisions2[];
  const rentTerms = park!.divisions as Divisions2[];

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="flex justify-between w-full space-x-4 cursor-pointer sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1104px]">
          <div className="flex items-center text-sm font-black tracking-widest sm:text-xl">
            МОЙ ГАРАЖ
          </div>
          <div className="flex items-center justify-end space-x-4 text-xl font-semibold">
            {park.park_name}
          </div>
        </div>
      </div>
    </>
  );
};
