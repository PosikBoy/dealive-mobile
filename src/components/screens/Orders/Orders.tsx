import React, { useState } from 'react';
import { Animated, StyleSheet, Switch, View } from 'react-native';

import { Header } from '@/components/shared/Header/Header';
import { Toggler } from '@/components/ui/HorizontalToggler/HorizontalToggler';
import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { useTypedDispatch, useTypedSelector } from '@/hooks/redux.hooks';
import { useTabAnimation } from '@/hooks/useTabAnimation';
import { useTheme } from '@/hooks/useTheme';
import { setAcceptingOrders } from '@/store/orderOffer/orderOffer.slice';

import ActiveOrders from './components/ActiveOrders';
import AvailableOrders from './components/AvailableOrders';
import RecommendedOrders from './components/RecommendedOrders';

const TABS = ['Доступные', 'Лучшие', 'Активные'];

export const Orders = () => {
  const { colors } = useTheme();
  const dispatch = useTypedDispatch();
  const isAcceptingOrders = useTypedSelector(state => state.orderOffer.isAcceptingOrders);
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  const {
    availableTranslate,
    activeTranslate,
    routeTranslate: recommendedTranslate,
    availableOpacity,
    activeOpacity,
    routeOpacity: recommendedOpacity,
  } = useTabAnimation(activeTab, TABS);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <Header title='Заказы' isButtonBackShown={false} />
      <View style={[styles.acceptingRow, { backgroundColor: colors.background }]}>
        <ThemedText type='mediumText' weight='medium' align='left'>
          Предлагать заказы
        </ThemedText>
        <Switch
          value={isAcceptingOrders}
          onValueChange={(value: boolean) => {
            dispatch(setAcceptingOrders(value));
          }}
          trackColor={{ false: '#ccc', true: colors.primary }}
          thumbColor='#fff'
        />
      </View>
      <View style={styles.togglerContainer}>
        <Toggler options={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </View>

      <View style={styles.ordersContainer}>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: availableOpacity,
              transform: [{ translateX: availableTranslate }],
              pointerEvents: activeTab === TABS[0] ? 'auto' : 'none',
            },
          ]}
        >
          <AvailableOrders />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: recommendedOpacity,
              transform: [{ translateX: recommendedTranslate }],
              pointerEvents: activeTab === TABS[1] ? 'auto' : 'none',
            },
          ]}
        >
          <RecommendedOrders />
        </Animated.View>
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: activeOpacity,
              transform: [{ translateX: activeTranslate }],
              pointerEvents: activeTab === TABS[2] ? 'auto' : 'none',
            },
          ]}
        >
          <ActiveOrders />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  acceptingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    marginTop: 10,
  },
  togglerContainer: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  ordersContainer: {
    flex: 1,
  },
  tabContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
});
