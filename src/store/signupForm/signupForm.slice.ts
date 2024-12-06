import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./signupForm.types";

const initialState: IInitialState = {
  phoneNumber: "",
  password: "",
  code: "",
  email: "",
  isRulesAccepted: false,
  name: "",
  secondName: "",
  lastName: "",
  birthDate: "",
  documentNumber: "",
  documentFiles: [],
};
export const signupFormSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    addFirstPageData(state, action) {
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.code = action.payload.code;
      state.password = action.payload.password;
    },
    addSecondPageData(state, action) {
      state.name = action.payload.name;
      state.secondName = action.payload.secondName;
      state.lastName = action.payload.lastName;
      state.birthDate = action.payload.birthDate;
    },
    addThirdPageData(state, action) {
      state.documentNumber = action.payload.documentNumber;
      state.documentFiles[0] = action.payload.selfieWithPassportImage;
      state.documentFiles[1] = action.payload.passportPhotoImage;
    },
  },
});

export const { addFirstPageData, addSecondPageData, addThirdPageData } =
  signupFormSlice.actions;
