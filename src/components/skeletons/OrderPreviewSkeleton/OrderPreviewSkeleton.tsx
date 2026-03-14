import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Shimmer from '@/components/ui/Shimmer/Shimmer';
import { useTheme } from '@/hooks/useTheme';

const OrderPreviewSkeleton: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Shimmer />
      </View>
      <View style={styles.addresses}>
        <View style={styles.address}>
          <Shimmer />
        </View>
        <View style={styles.address}>
          <Shimmer />
        </View>
      </View>
      <View style={styles.footer}>
        <Shimmer />
      </View>
    </View>
  );
};

export default OrderPreviewSkeleton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  addresses: {
    gap: 15,
    width: '100%',
  },
  header: {
    height: 40,
    width: 150,
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
  },
  footer: {
    height: 50,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
  },
  address: {
    width: '100%',
    height: 30,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
});
