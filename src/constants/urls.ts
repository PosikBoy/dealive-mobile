import Constants from "expo-constants";

export const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL;
export const REFRESH_TOKEN_URL = SERVER_URL + "/courier" + "/refresh";
export const LOGIN_URL = SERVER_URL + "/courier" + "/login";
export const REGISTER_URL = SERVER_URL + "/courier" + "/registration";
export const IS_USER_EXIST_URL = SERVER_URL + "/courier" + "/exist";
export const GET_IS_APPROVAL = SERVER_URL + "/courier" + "/isApproved";
// export const LOGOUT_URL = process.env.SERVER_URL + "/logout";
// export const ORDER_URL = process.env.SERVER_URL + "/order";
// export const ORDERS_URL = process.env.SERVER_URL + "/orders";
// export const PROFILE_URL = process.env.SERVER_URL + "/profile";
// export const SUGGESTIONS_URL = process.env.SERVER_URL + "/suggestions";
