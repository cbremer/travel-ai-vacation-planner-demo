export interface DayTheme {
  accent: string
  soft: string
  ink: string
}

export const DAY_THEMES: DayTheme[] = [
  { accent: '#0ea5e9', soft: '#e0f2fe', ink: '#0c4a6e' },
  { accent: '#475569', soft: '#e2e8f0', ink: '#1e293b' },
  { accent: '#16a34a', soft: '#dcfce7', ink: '#14532d' },
  { accent: '#dc2626', soft: '#fee2e2', ink: '#991b1b' },
  { accent: '#db2777', soft: '#fce7f3', ink: '#9d174d' },
  { accent: '#0d9488', soft: '#ccfbf1', ink: '#115e59' },
  { accent: '#d97706', soft: '#fef3c7', ink: '#92400e' },
  { accent: '#7c3aed', soft: '#ede9fe', ink: '#5b21b6' },
  { accent: '#1d4ed8', soft: '#dbeafe', ink: '#1e3a8a' },
  { accent: '#15803d', soft: '#dcfce7', ink: '#14532d' },
  { accent: '#ea580c', soft: '#ffedd5', ink: '#9a3412' },
  { accent: '#4f46e5', soft: '#e0e7ff', ink: '#3730a3' },
]

export function getDayTheme(index: number): DayTheme {
  return DAY_THEMES[index] ?? DAY_THEMES[0]
}
