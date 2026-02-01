import { useLocalSearchParams } from 'expo-router';

import Order from '@/components/screens/Order/Order';
import { useOrderById } from '@/domain/orders/api';

const index = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useOrderById(+id);

  return <Order order={data} />;
}; 

export default index;
