import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  IAddress,
  IOrderAction,
  IOrderActionType,
} from "@/types/order.interface";

import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

type Props = {
  action: IOrderAction;
  disabled: boolean;
  address: IAddress;
};

const actionIcons = {
  [IOrderActionType.GO_TO]: icons.goTo,
  [IOrderActionType.ARRIVED_AT]: icons.mapDot,
  [IOrderActionType.PICKUP]: icons.parcel,
  [IOrderActionType.DELIVER]: icons.parcel,
  [IOrderActionType.COLLECT_PAYMENT]: icons.money,
  [IOrderActionType.PAY_COMMISION]: icons.money,
  [IOrderActionType.COMPLETE_ORDER]: icons.check,
};

export const Action = (props: Props) => {
  const colorScheme = useColorScheme();
  const { action, disabled } = props;
  const icon = actionIcons[action.actionType];

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        style={[
          styles.action,
          action.isCompleted && styles.actionCompleted,
          { backgroundColor: colors[colorScheme].white },
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            tintColor={colors[colorScheme].black}
            source={icon}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <ThemedText
          type="mediumText"
          weight="medium"
          style={{ textAlign: "left", flex: 1 }}
        >
          {action.description}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    paddingHorizontal: 10,
  },
  action: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionCompleted: {
    backgroundColor: colors.green,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
  },
});
