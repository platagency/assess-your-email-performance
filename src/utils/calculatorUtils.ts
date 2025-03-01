
import { BenchmarkMetrics, Industry, benchmarkData, Currency, exchangeRates } from './benchmarkData';

export interface UserMetrics {
  openRate: number;
  clickRate: number;
  placedOrderRate: number;
  revPerRecipient: number;
}

export interface ComparisonResult {
  metric: keyof BenchmarkMetrics;
  userValue: number;
  benchmarkValue: number;
  percentageDifference: number;
  isAboveBenchmark: boolean;
}

export function calculateComparison(
  industry: Industry,
  userMetrics: UserMetrics,
  currency: Currency = 'USD'
): ComparisonResult[] {
  const industryBenchmarks = benchmarkData[industry];
  
  // If not USD, convert the benchmark value to the selected currency
  const benchmarkRevValue = currency === 'USD' 
    ? industryBenchmarks.revPerRecipient 
    : industryBenchmarks.revPerRecipient * exchangeRates[currency];
  
  return [
    {
      metric: 'openRate',
      userValue: userMetrics.openRate,
      benchmarkValue: industryBenchmarks.openRate,
      percentageDifference: calculatePercentageDifference(
        userMetrics.openRate,
        industryBenchmarks.openRate
      ),
      isAboveBenchmark: userMetrics.openRate > industryBenchmarks.openRate
    },
    {
      metric: 'clickRate',
      userValue: userMetrics.clickRate,
      benchmarkValue: industryBenchmarks.clickRate,
      percentageDifference: calculatePercentageDifference(
        userMetrics.clickRate,
        industryBenchmarks.clickRate
      ),
      isAboveBenchmark: userMetrics.clickRate > industryBenchmarks.clickRate
    },
    {
      metric: 'placedOrderRate',
      userValue: userMetrics.placedOrderRate,
      benchmarkValue: industryBenchmarks.placedOrderRate,
      percentageDifference: calculatePercentageDifference(
        userMetrics.placedOrderRate,
        industryBenchmarks.placedOrderRate
      ),
      isAboveBenchmark: userMetrics.placedOrderRate > industryBenchmarks.placedOrderRate
    },
    {
      metric: 'revPerRecipient',
      userValue: userMetrics.revPerRecipient,
      benchmarkValue: benchmarkRevValue,
      percentageDifference: calculatePercentageDifference(
        userMetrics.revPerRecipient,
        benchmarkRevValue
      ),
      isAboveBenchmark: userMetrics.revPerRecipient > benchmarkRevValue
    }
  ];
}

function calculatePercentageDifference(userValue: number, benchmarkValue: number): number {
  if (benchmarkValue === 0) return 0;
  return ((userValue - benchmarkValue) / benchmarkValue) * 100;
}

export function getMetricDisplayName(metric: keyof BenchmarkMetrics): string {
  switch (metric) {
    case 'openRate':
      return 'Open Rate';
    case 'clickRate':
      return 'Click Rate';
    case 'placedOrderRate':
      return 'Placed Order Rate';
    case 'revPerRecipient':
      return 'Revenue Per Recipient';
    default:
      return metric;
  }
}

export function formatMetricValue(
  metric: keyof BenchmarkMetrics,
  value: number,
  currency: Currency = 'USD'
): string {
  if (metric === 'revPerRecipient') {
    const currencySymbol = currency === 'USD' ? '$' : 
                          currency === 'EUR' ? '€' : 
                          currency === 'GBP' ? '£' : 
                          currency === 'AUD' ? 'A$' : 'C$';
    return `${currencySymbol}${value.toFixed(2)}`;
  }
  
  // Convert decimal to percentage with 2 decimal places
  return `${(value * 100).toFixed(2)}%`;
}
