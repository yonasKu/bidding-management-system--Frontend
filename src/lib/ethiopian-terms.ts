/**
 * Ethiopian terminology and translations
 */

export const tenderCategories = {
  GOODS: { en: 'Goods', am: 'ዕቃዎች' },
  SERVICES: { en: 'Services', am: 'አገልግሎቶች' },
  WORKS: { en: 'Works', am: 'ስራዎች' },
  CONSULTANCY: { en: 'Consultancy', am: 'አማካሪነት' },
  INFRASTRUCTURE: { en: 'Infrastructure', am: 'መሠረተ ልማት' },
}

export const ethiopianRegions = {
  ADDIS_ABABA: { en: 'Addis Ababa', am: 'አዲስ አበባ' },
  AFAR: { en: 'Afar', am: 'ዓፋር' },
  AMHARA: { en: 'Amhara', am: 'አማራ' },
  BENISHANGUL_GUMUZ: { en: 'Benishangul-Gumuz', am: 'ቤንሻንጉል ጉሙዝ' },
  DIRE_DAWA: { en: 'Dire Dawa', am: 'ድሬዳዋ' },
  GAMBELA: { en: 'Gambela', am: 'ጋምቤላ' },
  HARARI: { en: 'Harari', am: 'ሐረሪ' },
  OROMIA: { en: 'Oromia', am: 'ኦሮሚያ' },
  SIDAMA: { en: 'Sidama', am: 'ሲዳማ' },
  SOMALI: { en: 'Somali', am: 'ሶማሊ' },
  SOUTHERN: { en: 'Southern Nations', am: 'ደቡብ' },
  TIGRAY: { en: 'Tigray', am: 'ትግራይ' },
  SOUTHWEST: { en: 'Southwest', am: 'ደቡብ ምዕራብ' },
}

export const commonTerms = {
  tender: { en: 'Tender', am: 'ጨረታ' },
  bid: { en: 'Bid', am: 'ቀረጻ' },
  vendor: { en: 'Vendor', am: 'አቅራቢ' },
  procurement: { en: 'Procurement', am: 'ግዥ' },
  evaluation: { en: 'Evaluation', am: 'ግምገማ' },
  contract: { en: 'Contract', am: 'ውል' },
  deadline: { en: 'Deadline', am: 'የመጨረሻ ቀን' },
  bidSecurity: { en: 'Bid Security', am: 'የጨረታ ዋስትና' },
  businessLicense: { en: 'Business License', am: 'የንግድ ፈቃድ' },
  tinNumber: { en: 'TIN Number', am: 'የግብር ከፋይ መለያ ቁጥር' },
  estimatedValue: { en: 'Estimated Value', am: 'የተገመተ ዋጋ' },
  openingDate: { en: 'Opening Date', am: 'የመክፈቻ ቀን' },
  region: { en: 'Region', am: 'ክልል' },
  category: { en: 'Category', am: 'ምድብ' },
}

export function getCategoryName(category: string, locale: 'en' | 'am' = 'en'): string {
  return tenderCategories[category as keyof typeof tenderCategories]?.[locale] || category
}

export function getRegionName(region: string, locale: 'en' | 'am' = 'en'): string {
  return ethiopianRegions[region as keyof typeof ethiopianRegions]?.[locale] || region
}

export function getTerm(term: keyof typeof commonTerms, locale: 'en' | 'am' = 'en'): string {
  return commonTerms[term]?.[locale] || term
}
