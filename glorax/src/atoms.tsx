import { atom } from "recoil";

const isContentShowedAtom = atom<boolean>({
  key: "isContentShowedAtom",
  default: false,
});
const currentTimeAtom = atom<number>({
  key: "currentTimeAtom",
  default: -1,
});
const navigationTimeAtom = atom<number>({
  key: "navigationTimeAtom",
  default: 1,
});
const titleContentAtom = atom<string>({
  key: "titleContentAtom",
  default: "Дом Башкирова",
});
export {
  isContentShowedAtom,
  currentTimeAtom,
  navigationTimeAtom,
  titleContentAtom,
};
