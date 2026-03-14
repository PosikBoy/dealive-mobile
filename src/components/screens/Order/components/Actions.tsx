import React from 'react';
import { FlatList } from 'react-native';

import { IOrder } from '@/domain/orders/types';

import { Action } from './Action';

type Props = {
  order: IOrder;
};

const Actions = (props: Props) => {
  const { order } = props;

  return (
    <FlatList
      data={order.actions}
      renderItem={({ item }) => (
        <Action
          address={order.addresses.find(address => address.id == item.addressId)}
          action={item}
          disabled={order.statusId != 4}
        />
      )}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{
        gap: 10,
        paddingTop: 10,
        paddingBottom: 150,
      }}
    />
  );
};

export default Actions;
