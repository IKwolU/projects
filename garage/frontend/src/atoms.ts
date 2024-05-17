import { atom } from "recoil";
import { Application, IPark2, User } from "./api-client";

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
const applicationsAtom = atom<Application[]>({
  key: "applicationsAtom",
  default: undefined,
});
export { userAtom, cityAtom, parkAtom, applicationsAtom };
