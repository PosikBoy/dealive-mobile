import {
  FlatList,
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableHighlight,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import OnBoardingItem from "./components/OnBoardingItem";

import Paginator from "./components/Paginator";
import MyButton from "@/components/ui/Button/Button";
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/colors";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const data = [
  {
    id: 1,
    title: "Курьерская служба",
    subtitle: "Открой для себя удобный и доступный способ заработка ",
    iconUri: icons.moneyPurple,
  },
  {
    id: 2,
    title: "Быстро и без заморочек",
    subtitle: "Приступай к работе уже через 20 минут после регистрации",
    iconUri: icons.time,
  },
  {
    id: 3,
    title: "Лучшие предложения",
    subtitle: "Выбирай понравившееся среди доступных заказов",
    iconUri: icons.cup,
  },
];

const onBoarding = () => {
  const colorScheme = useColorScheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentPage(viewableItems[0].index);
  });
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const nextButtonClick = () => {
    if (currentPage == data.length - 1) {
      router.replace("/(auth)/main");
    }

    if (currentPage < data.length - 1) {
      setCurrentPage((currentPage) => currentPage + 1);
      slidesRef.current.scrollToIndex({ index: currentPage + 1 });
    }
  };

  const navigateToLogin = () => {
    router.push("/(auth)/main");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <TouchableHighlight
        style={styles.skipTextContainer}
        onPress={navigateToLogin}
        underlayColor="#fff"
      >
        <ThemedText>Пропустить</ThemedText>
      </TouchableHighlight>
      <View style={styles.slider}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <OnBoardingItem
              title={item.title}
              subtitle={item.subtitle}
              iconUri={item.iconUri}
            />
          )}
          horizontal
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged.current}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <View style={styles.paginator}>
        <Paginator data={data} scrollX={scrollX} />
        <View style={styles.buttonNextContainer}>
          <MyButton
            buttonText="Далее"
            onPress={() => {
              nextButtonClick();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default onBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  slider: {
    marginTop: 100,
    flex: 0.8,
    justifyContent: "center",
  },
  paginator: {
    marginTop: 100,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 50,
  },
  buttonNextContainer: {
    flex: 1,
  },
  skipTextContainer: {
    alignSelf: "flex-end",
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
});
