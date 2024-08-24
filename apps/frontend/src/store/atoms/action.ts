import { atom } from "recoil";


export interface AvailableAction{
    id:string,
    name:string,
    imageURL:string,
}

export const availableActionsAtom = atom<AvailableAction[]>({
  key: 'availableActions', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});