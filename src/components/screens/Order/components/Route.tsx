import React from 'react';

import { RouteList } from '@/components/shared/RouteList/RouteList';
import { IAddress } from '@/domain/orders/types';

interface IProps {
  route: IAddress[];
  orderId: number;
}

const Route = (props: IProps) => {
  const { route, orderId } = props;

  return (
    <RouteList
      route={route}
      orderId={orderId}
      showTypeLabel={false}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: 150,
        width: '100%',
      }}
      style={{
        paddingTop: 10,
        width: '100%',
      }}
    />
  );
};

export default Route;
