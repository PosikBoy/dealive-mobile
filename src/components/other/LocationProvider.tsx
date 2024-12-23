import { useLocation } from "@/hooks/location.hook";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { pushLocation } from "@/store/location/location.slice";
import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface IProps {
  children: React.ReactNode;
}

const LocationProvider: FC<IProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (location?.location?.lat) {
      dispatch(pushLocation(location));
    }
  }, [location]);

  return <View style={styles.container}>{children}</View>;
};

export default LocationProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
