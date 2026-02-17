export const colors = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
  },
  background: {
    default: 'var(--color-background)',
    light: 'var(--color-background-light)',
  },
  border: 'var(--color-border)',
  white: 'var(--color-white)',
  danger: 'var(--color-danger)',
  // Scanner-specific status colors
  success: 'var(--color-success)',
  successLight: 'var(--color-success-light)',
  warning: 'var(--color-warning)',
  warningLight: 'var(--color-warning-light)',
  error: 'var(--color-error)',
  errorLight: 'var(--color-error-light)',
  info: 'var(--color-info)',
  infoLight: 'var(--color-info-light)',
  wrong: 'var(--color-wrong)',
  wrongLight: 'var(--color-wrong-light)',
} as const;
