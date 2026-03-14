import React from 'react';
import { FieldValues } from 'react-hook-form';

import { IInputField, InputField } from '../InputField/InputField';
import { createPhoneFormatter } from './utils';

export const PhoneInputField = <TFieldValues extends FieldValues = FieldValues>(
  props: IInputField<TFieldValues>,
) => {
  // Получаем начальное значение из control
  const initialValue = props.control._formValues[props.name] as string | undefined;
  const formatPhone = createPhoneFormatter(initialValue);

  return (
    <InputField {...props} handler={formatPhone} rules={{ required: 'Введите номер телефона' }} />
  );
};
