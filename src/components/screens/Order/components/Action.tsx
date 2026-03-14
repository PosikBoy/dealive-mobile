import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { IAddress, IOrderAction, IOrderActionType } from '@/domain/orders/types';
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();
  const { action, disabled } = props;
  const icon = actionIcons[action.actionType];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.action,
        { backgroundColor: colors.background },
        action.isCompleted && styles.actionCompleted,
      ]}
    >
      <View style={styles.iconContainer}>
        <Image tintColor={colors.tint} source={icon} style={{ width: 20, height: 20 }} />
      </View>
      <ThemedText type='mediumText' weight='medium' style={{ textAlign: 'left', flex: 1 }}>
        {action.description}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  action: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCompleted: {
    backgroundColor: colors.green,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 10,
  },
});
