import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { UserType } from "./api-client";
import { useEffect } from "react";
import { client } from "./backend";

export const SuperAdmin = () => {
  const [user, setUser] = useRecoilState(userAtom);
  if (user.user_type !== UserType.Admin) {
    return <></>;
  }
  // useEffect(() => {
  //   const getParks = async () => {
  //     const parksData = await client.getParks;
  //     if (token) {
  //       (window as any).token = token;
  //       try {
  //         const userData = await client.getUser();

  //         setUser(userData.user!);
  //       } catch (error) {}
  //     }
  //   };

  //   checkAuth();
  // }, []);
  return <></>;
};
