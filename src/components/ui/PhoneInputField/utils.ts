export const createPhoneFormatter = (initialValue?: string) => {
  let previousValue = initialValue;

  const formatPhone = (value: string) => {
    if (previousValue?.length > value.length) {
      previousValue = value;
      return value;
    }

    let newValue = value.replaceAll(/\D/g, '');

    if (newValue.length == 1 && newValue[0] != '7' && newValue[0] != '8') {
      newValue = '7' + newValue;
    }

    if (newValue[0] == '7' || newValue[0] == '8') {
      newValue =
        '+7 (' +
        (newValue[1] ? newValue[1] : '') +
        (newValue[2] ? newValue[2] : '') +
        (newValue[3] ? newValue[3] + ') ' : '') +
        (newValue[4] ? newValue[4] : '') +
        (newValue[5] ? newValue[5] : '') +
        (newValue[6] ? newValue[6] + '-' : '') +
        (newValue[7] ? newValue[7] : '') +
        (newValue[8] ? newValue[8] + '-' : '') +
        (newValue[9] ? newValue[9] : '') +
        (newValue[10] ? newValue[10] : '');
    }

    previousValue = newValue;
    return newValue;
  };

  return formatPhone;
};
