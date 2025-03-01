
import React from 'react';
import { Industry } from '../utils/benchmarkData';
import { cn } from '../lib/utils';

interface IndustrySelectorProps {
  selectedIndustry: Industry | null;
  onSelectIndustry: (industry: Industry) => void;
}

const industries: Industry[] = [
  'All ecommerce',
  'Apparel and accessories',
  'Food and beverage',
  'Health and beauty',
  'Jewelry',
  'Other'
];

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustry,
  onSelectIndustry
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-2">
        <h2 className="text-sm uppercase tracking-wide text-muted-foreground font-medium">Select Your Industry</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => onSelectIndustry(industry)}
            className={cn(
              "relative px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md overflow-hidden group",
              selectedIndustry === industry
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
              selectedIndustry === industry ? "from-primary/10 to-primary/5 opacity-100" : ""
            )} />
            <div className="relative">
              <span className="block font-medium text-sm">
                {industry}
              </span>
            </div>
            {selectedIndustry === industry && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndustrySelector;
