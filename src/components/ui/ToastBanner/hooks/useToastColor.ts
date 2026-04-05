import { useTheme } from '@/hooks/useTheme';
import { ToastType } from '@/store/toast/toast.slice';

export const useToastColor = (type: ToastType): string => {
  const { colors } = useTheme();

  switch (type) {
    case 'success':
      return colors.success;
    case 'error':
      return colors.error;
    case 'info':
    default:
      return colors.primary;
  }
};
