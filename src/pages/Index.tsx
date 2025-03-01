
import React, { useState } from 'react';
import { Industry } from '../utils/benchmarkData';
import { UserMetrics, calculateComparison, ComparisonResult } from '../utils/calculatorUtils';
import IndustrySelector from '../components/IndustrySelector';
import MetricsForm from '../components/MetricsForm';
import ResultsDisplay from '../components/ResultsDisplay';
import BenchmarkChart from '../components/BenchmarkChart';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [step, setStep] = useState<'select-industry' | 'enter-metrics' | 'view-results'>('select-industry');
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    setStep('enter-metrics');
    
    toast({
      title: "Industry Selected",
      description: `Comparing against ${industry} benchmarks.`,
    });
  };

  const handleMetricsSubmit = (metrics: UserMetrics) => {
    if (!selectedIndustry) return;
    
    const results = calculateComparison(selectedIndustry, metrics);
    setComparisonResults(results);
    setStep('view-results');
    
    const aboveCount = results.filter(r => r.isAboveBenchmark).length;
    
    if (aboveCount === results.length) {
      toast({
        title: "Excellent Performance!",
        description: "All your metrics are above industry benchmarks.",
        variant: "default",
      });
    } else if (aboveCount > 0) {
      toast({
        title: "Mixed Results",
        description: `${aboveCount} of ${results.length} metrics are above industry benchmarks.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Room for Improvement",
        description: "All your metrics are below industry benchmarks.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setStep('select-industry');
    setComparisonResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-6 bg-background sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
              Klaviyo 2023 Benchmarks
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Email Marketing Assessment Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Compare your email performance metrics to Klaviyo's industry standard benchmarks
              and discover opportunities for optimization
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {step === 'select-industry' && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-4 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                  <span className="font-semibold">1</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Select Your Industry</h2>
                <p className="text-muted-foreground">
                  Choose your business category to compare against relevant industry benchmarks
                </p>
              </div>
              
              <IndustrySelector
                selectedIndustry={selectedIndustry}
                onSelectIndustry={handleIndustrySelect}
              />
            </div>
          )}

          {step === 'enter-metrics' && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-4 text-center max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                  <span className="font-semibold">2</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Enter Your Metrics</h2>
                <p className="text-muted-foreground">
                  Provide your email campaign metrics to compare against {selectedIndustry} benchmarks
                </p>
              </div>
              
              <MetricsForm onSubmit={handleMetricsSubmit} isSubmitEnabled={!!selectedIndustry} />
              
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  Go back to industry selection
                </button>
              </div>
            </div>
          )}

          {step === 'view-results' && selectedIndustry && (
            <div className="space-y-12 animate-fade-in">
              <ResultsDisplay 
                results={comparisonResults} 
                industry={selectedIndustry}
                onReset={handleReset}
              />
              
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-2xl font-semibold tracking-tight mb-6 text-center">Performance Visualization</h3>
                <BenchmarkChart results={comparisonResults} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/40">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Based on Klaviyo's 2023 industry standard benchmarks. 
            This calculator helps email marketers assess their campaign performance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
