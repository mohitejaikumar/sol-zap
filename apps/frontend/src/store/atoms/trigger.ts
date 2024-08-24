import { atom } from "recoil";


export interface AvailableTrigger{
    id:string,
    name:string,
    imageURL:string,
}

export const availableTriggersAtom = atom<AvailableTrigger[]>({
  key: 'availableTriggers', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});