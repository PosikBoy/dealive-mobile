import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import TakeOrderSheet, { ITakeOrderSheet } from "./TakeOrderSheet";
import {
  CompleteActionSheet,
  ICompleteActionSheet,
} from "./CompleteActionSheet";
import LogOutSheet from "./LogOutSheet";

registerSheet("take-order-sheet", TakeOrderSheet);
registerSheet("complete-action-sheet", CompleteActionSheet);
registerSheet("log-out-sheet", LogOutSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "take-order-sheet": SheetDefinition<{
      payload: ITakeOrderSheet;
    }>;
    "complete-action-sheet": SheetDefinition<{
      payload: ICompleteActionSheet;
    }>;
    "log-out-sheet": SheetDefinition;
  }
}

export {};
