import { View, Text, StyleSheet } from "react-native";
import { useGetProfileQuery } from "@/services/profile/profile.service";
import { colors } from "@/constants/colors";
import { formatDateWithoutTime } from "@/helpers/formatDate";
import Header from "@/components/shared/Header/Header";
import { fonts, fontSizes } from "@/constants/styles";
import ThemedText from "@/components/ui/ThemedText/ThemedText";

const Profile = () => {
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
    <View style={styles.container}>
      <Header title="Профиль" />
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>ФИО</Text>
          <Text style={styles.value}>
            {`${data.secondName} ${data.name} ${data.lastName}`}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Номер телефона</Text>
          <Text style={styles.value}>{data.phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Электронная почта</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Дата рождения</Text>
          <Text style={styles.value}>
            {formatDateWithoutTime(data.birthDate)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  label: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.semiBold,
  },
  value: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
});
