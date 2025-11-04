/**
 * Ethiopian Birr (ETB) currency formatting utilities
 */

export function formatETB(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatETBCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `ETB ${(amount / 1_000_000).toFixed(2)}M`
  }
  if (amount >= 1_000) {
    return `ETB ${(amount / 1_000).toFixed(2)}K`
  }
  return formatETB(amount)
}

// Amharic version
export function formatETBAmharic(amount: number): string {
  const formatted = new Intl.NumberFormat('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `ብር ${formatted}` // ብር = Birr in Amharic
}
