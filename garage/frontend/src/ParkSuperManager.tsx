import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserType, Parks3, Body51, User } from "./api-client";
import { parkAtom } from "./atoms";
import { client } from "./backend";
import Confirmation from "@/components/ui/confirmation";
import ArrayStringSelect from "./ArrayStringSelect";
import { Button } from "@/components/ui/button";

export const ParkSuperManager = ({ user }: { user: User }) => {
  const [park, setPark] = useRecoilState(parkAtom);

  const [parksInitData, setParksInitData] = useState<Parks3[] | undefined>();

  const parkBlock = async () => {
    await client.blockParkSuperManager();
    setPark({ ...park, is_blocked: true });
  };

  const parkUnblock = async () => {
    await client.unblockParkSuperManager();
    setPark({ ...park, is_blocked: false });
  };

  const getParksInitData = async () => {
    const data = await client.getParksInitDataSuperManager();
    setParksInitData(data.parks);
  };

  useEffect(() => {
    getParksInitData();
  }, []);

  const selectPark = async (value: string) => {
    await client.selectParkForSuperManager(
      new Body51({
        id: parksInitData?.find((x) => x.park_name === value)!.id,
      })
    );
    window.location.href = "/";
  };

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }

  return (
    <>
      {parksInitData && (
        <div className="absolute z-10 w-[600px] top-2 right-2">
          <div className="flex justify-end w-full space-x-4">
            <div className="w-fit min-w-44 text-nowrap">
              <ArrayStringSelect
                list={parksInitData.map((x) => x.park_name!)}
                onChange={(value) => selectPark(value)}
                resultValue={park.park_name!}
              />
            </div>
            {!park.is_blocked && (
              <div className="w-44">
                <Confirmation
                  accept={() => parkBlock()}
                  cancel={() => {}}
                  title=""
                  type="red"
                  text={`Показ объявлений от парка ${park.park_name} будет отключен. Подвердить?`}
                  trigger={
                    <Button
                      variant={"reject"}
                      className="w-full text-black h-9"
                    >
                      Блокировать парк
                    </Button>
                  }
                />
              </div>
            )}
            {!!park.is_blocked && (
              <div className="w-44">
                <Confirmation
                  accept={() => parkUnblock()}
                  cancel={() => {}}
                  title=""
                  type="red"
                  text={`Показ объявлений от парка ${park.park_name} будет включен. Подвердить?`}
                  trigger={
                    <Button variant={"default"} className="text-black h-9">
                      Разблокировать парк
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
