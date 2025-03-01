
import React from 'react';
import { ComparisonResult, getMetricDisplayName, formatMetricValue } from '../utils/calculatorUtils';
import { Industry } from '../utils/benchmarkData';
import { ArrowUpIcon, ArrowDownIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  results: ComparisonResult[];
  industry: Industry;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  industry,
  onReset
}) => {
  // Calculate overall score (percentage of metrics above benchmark)
  const aboveBenchmarkCount = results.filter(result => result.isAboveBenchmark).length;
  const overallScore = (aboveBenchmarkCount / results.length) * 100;
  
  // Determine performance level
  const getPerformanceLevel = () => {
    if (overallScore === 100) return { level: 'Exceptional', color: 'text-emerald-500' };
    if (overallScore >= 75) return { level: 'Strong', color: 'text-green-500' };
    if (overallScore >= 50) return { level: 'Moderate', color: 'text-yellow-500' };
    if (overallScore >= 25) return { level: 'Needs Improvement', color: 'text-orange-500' };
    return { level: 'Poor', color: 'text-red-500' };
  };
  
  const performance = getPerformanceLevel();
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="animate-fade-in space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span>{industry} Benchmark Comparison</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">Your Email Performance</h2>
          <p className="text-lg text-muted-foreground">
            Here's how your email metrics compare to Klaviyo's 2023 industry benchmarks
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium">Overall Performance</h3>
            <div className="mt-2 flex flex-col items-center justify-center">
              <div className="relative w-28 h-28 mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={overallScore >= 75 ? "#10B981" : overallScore >= 50 ? "#FBBF24" : "#EF4444"}
                    strokeWidth="3"
                    strokeDasharray={`${overallScore}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{Math.round(overallScore)}%</span>
                </div>
              </div>
              <div className={cn("font-medium text-lg", performance.color)}>
                {performance.level}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-stagger">
            {results.map((result) => (
              <div 
                key={result.metric}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  result.isAboveBenchmark 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50" 
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{getMetricDisplayName(result.metric)}</div>
                  <div 
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      result.isAboveBenchmark 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    )}
                  >
                    {result.isAboveBenchmark ? (
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(result.percentageDifference).toFixed(1)}% 
                    {result.isAboveBenchmark ? 'Above' : 'Below'}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground uppercase font-medium">Your Value</div>
                    <div className="text-lg font-semibold">{formatMetricValue(result.metric, result.userValue)}</div>
                  </div>
                  <div className="w-px h-10 bg-border mx-2" />
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground uppercase font-medium">Benchmark</div>
                    <div className="text-lg">{formatMetricValue(result.metric, result.benchmarkValue)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={onReset} variant="outline" className="animate-fade-in">
            Start a New Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
