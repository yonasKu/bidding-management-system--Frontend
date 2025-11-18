export type Locale = 'en' | 'am'

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'am':
      return (await import('@/locales/am/common.json')).default
    case 'en':
    default:
      return (await import('@/locales/en/common.json')).default
  }
}
