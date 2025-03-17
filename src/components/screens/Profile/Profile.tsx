import { View, StyleSheet, useColorScheme } from "react-native";
import { useGetProfileQuery } from "@/services/profile/profile.service";
import { colors } from "@/constants/colors";
import { formatDateWithoutTime } from "@/helpers/formatDate";
import Header from "@/components/shared/Header/Header";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const Profile = () => {
  const colorScheme = useColorScheme() || "light";
  const { data, isLoading, error } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  if (isLoading)
    return (
      <View style={styles.container}>
        <Header title="Профиль" />
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Header title="Профиль" />
        <ThemedText color="red">Произошла ошибка</ThemedText>
      </View>
    );

  return (
    <View
      style={[styles.container, { backgroundColor: colors[colorScheme].white }]}
    >
      <Header title="Профиль" />
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <ThemedText align="left" type="mediumText">
            ФИО
          </ThemedText>
          <ThemedText align="left" type="mediumText">
            {`${data.secondName} ${data.name} ${data.lastName}`}
          </ThemedText>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <ThemedText align="left" type="mediumText">
            Номер телефона
          </ThemedText>
          <ThemedText align="left" type="mediumText">
            {data.phoneNumber}
          </ThemedText>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <ThemedText align="left" type="mediumText">
            Электронная почта
          </ThemedText>
          <ThemedText align="left" type="mediumText">
            {data.email}
          </ThemedText>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <ThemedText align="left" type="mediumText">
            Дата рождения
          </ThemedText>
          <ThemedText align="left" type="mediumText">
            {formatDateWithoutTime(data.birthDate)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 20,
  },
  infoContainer: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 5,
  },
});
