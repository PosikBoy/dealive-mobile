import { createSlice } from "@reduxjs/toolkit";
import { Gender, IInitialState } from "./signupForm.types";

const initialState: IInitialState = {
  phoneNumber: "",
  password: "",
  code: "",
  isRulesAccepted: false,
  firstName: "",
  secondName: "",
  thirdName: "",
  birthDate: "",
  passportNumber: "",
  issueDate: "",
  passportPhotoImage: null,
  selfieWithPassportImage: null,
};

export const signupFormSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    addFirstPageData(state, action) {
      state.phoneNumber = action.payload.phoneNumber;
      state.code = action.payload.code;
      state.password = action.payload.password;
    },
    addSecondPageData(state, action) {
      state.firstName = action.payload.firstName;
      state.secondName = action.payload.secondName;
      state.thirdName = action.payload.thirdName;
      state.birthDate = action.payload.birthDate;
    },
    addThirdPageData(state, action) {
      state.passportNumber = action.payload.passportNumber;
      state.issueDate = action.payload.issueDate;
      state.selfieWithPassportImage = action.payload.selfieWithPassportImage;
      state.passportPhotoImage = action.payload.passportPhotoImage;
    },
  },
});

export const { addFirstPageData, addSecondPageData, addThirdPageData } =
  signupFormSlice.actions;
