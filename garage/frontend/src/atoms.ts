import { atom } from "recoil";
import { IPark2, User } from "./api-client";

const userAtom = atom<User>({
  key: "userAtom",
  default: undefined,
});
const cityAtom = atom<string>({
  key: "cityAtom",
  default: "Москва",
});
const parkAtom = atom<IPark2>({
  key: "parkAtom",
  default: undefined,
});
export { userAtom, cityAtom, parkAtom };
