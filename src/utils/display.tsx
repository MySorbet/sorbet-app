import { utils } from "near-api-js";

export const neartoyocto = (near: number) => {
  const _tmp = utils.format.parseNearAmount(near.toString());
  return _tmp;
};

export const yoctotonear = (yocto: string) => {
  const _near = utils.format.formatNearAmount(yocto);
  return _near;
};
