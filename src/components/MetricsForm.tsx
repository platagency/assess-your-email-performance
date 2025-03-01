
import React, { useState, useEffect } from 'react';
import { UserMetrics } from '../utils/calculatorUtils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface MetricsFormProps {
  onSubmit: (metrics: UserMetrics) => void;
  isSubmitEnabled: boolean;
}

const initialMetrics: UserMetrics = {
  openRate: 0,
  clickRate: 0,
  placedOrderRate: 0,
  revPerRecipient: 0
};

const MetricsForm: React.FC<MetricsFormProps> = ({ onSubmit, isSubmitEnabled }) => {
  const [metrics, setMetrics] = useState<UserMetrics>(initialMetrics);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate inputs as user types
  const validateInput = (name: keyof UserMetrics, value: number): string => {
    if (isNaN(value)) return 'Please enter a valid number';
    if (name !== 'revPerRecipient' && (value < 0 || value > 100)) {
      return 'Value must be between 0 and 100';
    }
    if (name === 'revPerRecipient' && value < 0) {
      return 'Value must be positive';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If input is percentage, convert to decimal
    let numValue: number;
    
    if (name === 'revPerRecipient') {
      // Allow dollar input as is
      numValue = parseFloat(value);
    } else {
      // Convert percentage to decimal (e.g., 18.5% → 0.185)
      numValue = parseFloat(value) / 100;
    }
    
    const error = validateInput(name as keyof UserMetrics, parseFloat(value));
    
    setMetrics(prev => ({ 
      ...prev, 
      [name]: isNaN(numValue) ? 0 : numValue 
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    
    onSubmit(metrics);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="openRate" className="text-sm font-medium">
              Open Rate (%)
            </Label>
            <div className="relative">
              <Input
                id="openRate"
                name="openRate"
                type="number"
                step="0.01"
                placeholder="18.9"
                value={metrics.openRate === 0 ? '' : (metrics.openRate * 100).toFixed(2)}
                onChange={handleInputChange}
                className={errors.openRate ? "border-destructive" : ""}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            {errors.openRate && (
              <p className="text-destructive text-xs mt-1">{errors.openRate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clickRate" className="text-sm font-medium">
              Click Rate (%)
            </Label>
            <div className="relative">
              <Input
                id="clickRate"
                name="clickRate"
                type="number"
                step="0.01"
                placeholder="1.32"
                value={metrics.clickRate === 0 ? '' : (metrics.clickRate * 100).toFixed(2)}
                onChange={handleInputChange}
                className={errors.clickRate ? "border-destructive" : ""}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            {errors.clickRate && (
              <p className="text-destructive text-xs mt-1">{errors.clickRate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="placedOrderRate" className="text-sm font-medium">
              Placed Order Rate (%)
            </Label>
            <div className="relative">
              <Input
                id="placedOrderRate"
                name="placedOrderRate"
                type="number"
                step="0.01"
                placeholder="0.32"
                value={metrics.placedOrderRate === 0 ? '' : (metrics.placedOrderRate * 100).toFixed(2)}
                onChange={handleInputChange}
                className={errors.placedOrderRate ? "border-destructive" : ""}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            {errors.placedOrderRate && (
              <p className="text-destructive text-xs mt-1">{errors.placedOrderRate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revPerRecipient" className="text-sm font-medium">
              Revenue Per Recipient ($)
            </Label>
            <div className="relative">
              <Input
                id="revPerRecipient"
                name="revPerRecipient"
                type="number"
                step="0.01"
                placeholder="0.11"
                value={metrics.revPerRecipient === 0 ? '' : metrics.revPerRecipient.toFixed(2)}
                onChange={handleInputChange}
                className={errors.revPerRecipient ? "border-destructive" : ""}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
            </div>
            {errors.revPerRecipient && (
              <p className="text-destructive text-xs mt-1">{errors.revPerRecipient}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full md:w-auto transition-all duration-300"
            disabled={!isSubmitEnabled || Object.values(errors).some(error => error !== '')}
          >
            <span>Compare to Benchmarks</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MetricsForm;
