import { Redirect, useLocalSearchParams } from 'expo-router';

import Order from '@/components/screens/Order/Order';
import OrderSkeleton from '@/components/skeletons/OrderSkeleton/OrderSkeleton';
import { useGetOrderByIdQuery } from '@/services/orders/orders.service';

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isError, isLoading } = useGetOrderByIdQuery(+id);

  if (!data || isLoading) {
    return <OrderSkeleton />;
  }

  if (isError) {
    console.error('Error fetching order:', data);

    return <Redirect href={{ pathname: '/(tabs)/index' }} />;
  }

  return <Order order={data} />;
};

export default index;
