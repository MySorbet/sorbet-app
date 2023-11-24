export const neartoyocto = (near: number) => {
  const _tmp = `${near}000000000000000000000000`;
  return _tmp;
};

export const yoctotonear = (yocto: string) => {
  const _near = (parseInt(yocto) * 10) / 1e25;
  return _near;
};
