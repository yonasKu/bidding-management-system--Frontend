/**
 * Ethiopian Calendar Utilities
 * 
 * Ethiopian calendar is approximately 7-8 years behind the Gregorian calendar
 * and has 13 months (12 months of 30 days + 1 month of 5-6 days)
 */

interface EthiopianDate {
  year: number
  month: number
  day: number
}

/**
 * Convert Gregorian date to Ethiopian date
 * Simplified conversion - for production, use a library like 'ethiopic-calendar'
 */
export function gregorianToEthiopian(date: Date): EthiopianDate {
  // Simplified approximation
  // Ethiopian year = Gregorian year - 7 (or -8 depending on month)
  const gregYear = date.getFullYear()
  const gregMonth = date.getMonth() + 1
  const gregDay = date.getDate()
  
  // Ethiopian New Year is around September 11
  let ethYear = gregYear - 7
  if (gregMonth < 9 || (gregMonth === 9 && gregDay < 11)) {
    ethYear = gregYear - 8
  }
  
  // Simplified month/day calculation (approximate)
  let ethMonth = gregMonth - 8
  if (ethMonth <= 0) ethMonth += 12
  
  return {
    year: ethYear,
    month: ethMonth,
    day: gregDay,
  }
}

/**
 * Format Ethiopian date for display
 */
export function formatEthiopianDate(date: Date): string {
  const eth = gregorianToEthiopian(date)
  return `${eth.day}/${eth.month}/${eth.year} ዓ.ም` // ዓ.ም = Ethiopian year marker
}

/**
 * Get Ethiopian month name in Amharic
 */
export function getEthiopianMonthName(month: number): string {
  const months = [
    'መስከረም', // Meskerem
    'ጥቅምት',   // Tikimt
    'ኅዳር',    // Hidar
    'ታኅሣሥ',   // Tahsas
    'ጥር',     // Tir
    'የካቲት',   // Yekatit
    'መጋቢት',   // Megabit
    'ሚያዝያ',   // Miazia
    'ግንቦት',   // Ginbot
    'ሰኔ',     // Sene
    'ሐምሌ',    // Hamle
    'ነሐሴ',    // Nehase
    'ጳጉሜን',   // Pagumen (13th month)
  ]
  return months[month - 1] || ''
}

/**
 * Format Ethiopian date with month name
 */
export function formatEthiopianDateLong(date: Date): string {
  const eth = gregorianToEthiopian(date)
  const monthName = getEthiopianMonthName(eth.month)
  return `${monthName} ${eth.day}, ${eth.year} ዓ.ም`
}

/**
 * Display both Gregorian and Ethiopian dates
 */
export function formatDualDate(date: Date): string {
  const gregorian = date.toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const ethiopian = formatEthiopianDateLong(date)
  return `${gregorian} (${ethiopian})`
}
