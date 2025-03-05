import { useLocation } from "@/hooks/location.hook";
import { useTypedDispatch } from "@/hooks/redux.hooks";
import { pushError, pushLocation } from "@/store/location/location.slice";
import React, { FC, useEffect } from "react";

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

  return <>{children}</>;
};

export default LocationProvider;
