export const COLORS = {
  primary: '#7158E2',
  primaryDark: '#6B4CE6',
  secondary: '#EFEAFA',
  secondaryLight: '#F4F0FF',
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981'
};

export const theme = {
  colors: COLORS,
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      borderColor: COLORS.primaryDark,
      hoverBackground: COLORS.primaryDark
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.primary,
      borderColor: COLORS.secondary,
      hoverBackground: COLORS.secondaryLight
    }
  },
  sidebar: {
    backgroundColor: COLORS.white,
    activeBackground: COLORS.secondary,
    activeColor: COLORS.primary,
    inactiveColor: COLORS.textSecondary
  }
};