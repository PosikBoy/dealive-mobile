import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useGetProfileQuery } from "@/services/profile/profile.service";
import { colors } from "@/constants/colors";
import formatDate, { formatDateWithoutTime } from "@/helpers/formatDate";
import Header from "@/components/shared/Header/Header";
import { fonts, fontSizes } from "@/constants/styles";

type Props = {};

const Profile = (props: Props) => {
  const { data, isLoading, error } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

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
