import { getStatusColor, getStatusText } from '@/src/utils/statusUtils';

const theme = {
  colors: {
    success: '#00aa00',
    primary: '#0066ff',
    danger: '#cc0000',
    textSecondary: '#666666',
  },
};

describe('statusUtils', () => {
  it('maps known statuses to theme colors', () => {
    expect(getStatusColor('completed', theme as any)).toBe('#00aa00');
    expect(getStatusColor('analyzing', theme as any)).toBe('#0066ff');
    expect(getStatusColor('cancelled', theme as any)).toBe('#cc0000');
  });

  it('falls back to secondary text color for unknown statuses', () => {
    expect(getStatusColor('queued', theme as any)).toBe('#666666');
  });

  it('capitalizes status text and preserves empty values', () => {
    expect(getStatusText('completed')).toBe('Completed');
    expect(getStatusText('')).toBe('');
  });
});
