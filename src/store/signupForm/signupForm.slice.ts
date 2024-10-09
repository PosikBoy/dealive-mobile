import { createSlice } from "@reduxjs/toolkit";
import { Gender, IInitialState } from "./signupForm.types";

const initialState: IInitialState = {
  phoneNumber: "",
  isRulesAccepted: false,
  firstName: "",
  secondName: "",
  thirdName: "",
  birthDay: "",
  gender: Gender.male,
  passportNumber: "",
  issueDate: "",
  passportPhotoImage: null,
  selfieWithPassportImage: null,
};

export const signupFormSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    addData(state, action) {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
      // Если не сработает, то можно попробовать перечислить все поля, типа такого
      // state.pickupAddress = action.payload.pickupAddress;
      // state.destinationAddress = action.payload.destinationAddress;
    },
  },
});

export const { addData } = signupFormSlice.actions;
