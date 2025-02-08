import { useLocation } from "@/hooks/location.hook";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { pushError, pushLocation } from "@/store/location/location.slice";
import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface IProps {
  children: React.ReactNode;
}

const LocationProvider: FC<IProps> = ({ children }) => {
  const { location, error, isLoading } = useLocation();
  const dispatch = useTypedDispatch();
  useEffect(() => {
    if (error) {
      dispatch(pushError(error));
    } else if (location?.lon) {
      dispatch(pushLocation(location));
    }
  }, [location, error, isLoading]);

  return <View style={styles.container}>{children}</View>;
};

export default LocationProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
