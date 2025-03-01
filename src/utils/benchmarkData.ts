
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
    openRate: 0.189,        // 18.9%
    clickRate: 0.0132,      // 1.32%
    placedOrderRate: 0.0032, // 0.32%
    revPerRecipient: 0.11   // $0.11
  },
  'Apparel and accessories': {
    openRate: 0.176,        // 17.6%
    clickRate: 0.0115,      // 1.15%
    placedOrderRate: 0.0034, // 0.34%
    revPerRecipient: 0.11   // $0.11
  },
  'Food and beverage': {
    openRate: 0.188,        // 18.8%
    clickRate: 0.0111,      // 1.11%
    placedOrderRate: 0.0030, // 0.30%
    revPerRecipient: 0.10   // $0.10
  },
  'Health and beauty': {
    openRate: 0.192,        // 19.2%
    clickRate: 0.0136,      // 1.36%
    placedOrderRate: 0.0033, // 0.33%
    revPerRecipient: 0.10   // $0.10
  },
  'Jewelry': {
    openRate: 0.168,        // 16.8%
    clickRate: 0.0110,      // 1.10%
    placedOrderRate: 0.0030, // 0.30%
    revPerRecipient: 0.13   // $0.13
  },
  'Other': {
    openRate: 0.194,        // 19.4%
    clickRate: 0.0143,      // 1.43%
    placedOrderRate: 0.0031, // 0.31%
    revPerRecipient: 0.11   // $0.11
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
