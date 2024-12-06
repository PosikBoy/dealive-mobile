export const passportNumberHandler = (newValue: string, oldValue) => {
  const regex = /[0-9]/;
  if (oldValue.length - newValue.length == 1) {
    return newValue;
  }
  if (regex.test(newValue[newValue.length - 1]) && newValue.length < 12) {
    newValue = newValue.replaceAll(/\D/g, "");
    newValue =
      (newValue[0] ? newValue[0] : "") +
      (newValue[1] ? newValue[1] : "") +
      (newValue[2] ? newValue[2] : "") +
      (newValue[3] ? newValue[3] + " " : "") +
      (newValue[4] ? newValue[4] : "") +
      (newValue[5] ? newValue[5] : "") +
      (newValue[6] ? newValue[6] : "") +
      (newValue[7] ? newValue[7] : "") +
      (newValue[8] ? newValue[8] : "") +
      (newValue[9] ? newValue[9] : "");
    return newValue;
  }
  return oldValue;
};
