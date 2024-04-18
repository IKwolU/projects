import { atom } from "recoil";

const contentIdAtom = atom<number>({
  key: "contentIdAtom",
  default: -1,
});
const currentTimeAtom = atom<number>({
  key: "currentTimeAtom",
  default: -1,
});
export { contentIdAtom, currentTimeAtom };
