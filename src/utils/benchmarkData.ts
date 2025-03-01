
export type Industry = 
  | 'All ecommerce' 
  | 'Apparel and accessories' 
  | 'Food and beverage' 
  | 'Health and beauty' 
  | 'Jewelry' 
  | 'Other';

export interface BenchmarkMetrics {
  openRate: number;
  clickRate: number;
  placedOrderRate: number;
  revPerRecipient: number;
}

export const benchmarkData: Record<Industry, BenchmarkMetrics> = {
  'All ecommerce': {
    openRate: 0.3793,        // 37.93%
    clickRate: 0.0129,      // 1.29%
    placedOrderRate: 0.0008, // 0.08%
    revPerRecipient: 0.10   // $0.10
  },
  'Apparel and accessories': {
    openRate: 0.3804,        // 38.04%
    clickRate: 0.0145,      // 1.45%
    placedOrderRate: 0.0007, // 0.07%
    revPerRecipient: 0.09   // $0.09
  },
  'Food and beverage': {
    openRate: 0.3915,        // 39.15%
    clickRate: 0.0135,      // 1.35%
    placedOrderRate: 0.0017, // 0.17%
    revPerRecipient: 0.16   // $0.16
  },
  'Health and beauty': {
    openRate: 0.3590,        // 35.9%
    clickRate: 0.0091,      // 0.91%
    placedOrderRate: 0.0011, // 0.11%
    revPerRecipient: 0.10   // $0.10
  },
  'Jewelry': {
    openRate: 0.3726,        // 37.26%
    clickRate: 0.0135,      // 1.35%
    placedOrderRate: 0.0005, // 0.05%
    revPerRecipient: 0.08   // $0.08
  },
  'Other': {
    openRate: 0.3793,        // Using All ecommerce as default for Other category
    clickRate: 0.0129,
    placedOrderRate: 0.0008,
    revPerRecipient: 0.10
  }
};

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$'
};

export const exchangeRates: Record<Currency, number> = {
  USD: 1.0,      // Base currency
  EUR: 0.91,     // 1 USD = 0.91 EUR
  GBP: 0.78,     // 1 USD = 0.78 GBP
  AUD: 1.48,     // 1 USD = 1.48 AUD
  CAD: 1.35      // 1 USD = 1.35 CAD
};

export const convertCurrency = (valueInUSD: number, targetCurrency: Currency): number => {
  return valueInUSD * exchangeRates[targetCurrency];
};
