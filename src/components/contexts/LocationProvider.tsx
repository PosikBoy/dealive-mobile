import { useEffect } from 'react';

import { useLocation } from '@/hooks/location.hook';
import { useTypedDispatch } from '@/hooks/redux.hooks';
import { pushError, pushLocation } from '@/store/location/location.slice';

const LocationProvider = () => {
  const { location, error } = useLocation();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (location?.lon) {
      dispatch(pushLocation(location));
    }
  }, [location]);

  useEffect(() => {
    if (error) {
      dispatch(pushError(error));
    }
  }, [error]);

  return null;
};

export default LocationProvider;
