import { Theme } from '@/src/styles/theme';

export const getStatusColor = (status: string, theme: Theme) => {
  switch (status) {
    case 'completed':
      return theme.colors.success;
    case 'analyzing':
      return theme.colors.primary;
    case 'cancelled':
      return theme.colors.danger;
    default:
      return theme.colors.textSecondary;
  }
};

export const getStatusText = (status: string) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
};
