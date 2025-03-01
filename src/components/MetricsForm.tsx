
import React, { useState, useEffect } from 'react';
import { UserMetrics } from '../utils/calculatorUtils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currency, currencySymbols, exchangeRates } from '../utils/benchmarkData';

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
  const [currency, setCurrency] = useState<Currency>('USD');
  const [inputValues, setInputValues] = useState({
    openRate: '0.00',
    clickRate: '0.00',
    placedOrderRate: '0.00',
    revPerRecipient: '0.00'
  });

  // Validate inputs as user types
  const validateInput = (name: keyof UserMetrics, value: number): string => {
    if (isNaN(value)) return 'Please enter a valid number';
    if (name !== 'revPerRecipient' && (value < 0 || value > 100)) {
      return 'Value must be between 0 and 100';
    }
    if (name === 'revPerRecipient' && (value < 0 || value > 100)) {
      return 'Value must be between 0 and 100';
    }
    return '';
  };

  // Handle slider changes
  const handleSliderChange = (name: keyof UserMetrics, value: number[]) => {
    const numValue = name === 'revPerRecipient' 
      ? value[0] 
      : value[0] / 100; // Convert percentage to decimal
      
    setMetrics(prev => ({ ...prev, [name]: numValue }));
    
    // Update the input display value
    setInputValues(prev => ({
      ...prev,
      [name]: name === 'revPerRecipient' ? value[0].toFixed(2) : value[0].toFixed(2)
    }));
    
    const error = validateInput(name, value[0]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the input display value directly
    setInputValues(prev => ({ ...prev, [name]: value }));
    
    const numValue = parseFloat(value);
    
    // Only update the metrics state if it's a valid number
    if (!isNaN(numValue)) {
      let metricValue: number;
      
      if (name === 'revPerRecipient') {
        metricValue = numValue; // Direct value for revenue
      } else {
        metricValue = numValue / 100; // Convert percentage to decimal
      }
      
      setMetrics(prev => ({ ...prev, [name]: metricValue }));
      
      const error = validateInput(name as keyof UserMetrics, numValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle input blur to format the value correctly
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setInputValues(prev => ({
        ...prev,
        [name]: numValue.toFixed(2)
      }));
    } else {
      // Reset to 0 if invalid input
      setInputValues(prev => ({
        ...prev,
        [name]: '0.00'
      }));
      
      setMetrics(prev => ({ 
        ...prev, 
        [name]: name === 'revPerRecipient' ? 0 : 0 
      }));
    }
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    // Convert the current revenue value to the new currency
    const valueInUSD = metrics.revPerRecipient / exchangeRates[currency];
    const valueInNewCurrency = valueInUSD * exchangeRates[newCurrency];
    
    setMetrics(prev => ({ 
      ...prev, 
      revPerRecipient: valueInNewCurrency 
    }));
    
    setInputValues(prev => ({
      ...prev,
      revPerRecipient: valueInNewCurrency.toFixed(2)
    }));
    
    setCurrency(newCurrency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    
    // If we're not using USD, convert revenue back to USD for comparison
    let metricsToSubmit = { ...metrics };
    if (currency !== 'USD') {
      const valueInUSD = metrics.revPerRecipient / exchangeRates[currency];
      metricsToSubmit.revPerRecipient = valueInUSD;
    }
    
    onSubmit(metricsToSubmit);
  };

  // Get display values for sliders
  const getSliderValue = (metric: keyof UserMetrics): number[] => {
    if (metric === 'revPerRecipient') {
      return [metrics[metric]];
    }
    return [metrics[metric] * 100]; // Convert decimal to percentage
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
        <div className="space-y-6">
          {/* Open Rate */}
          <div className="space-y-4">
            <Label htmlFor="openRate" className="text-sm font-medium">
              Open Rate: {(metrics.openRate * 100).toFixed(2)}%
            </Label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Slider
                  id="openRate-slider"
                  name="openRate"
                  min={0}
                  max={100}
                  step={0.01}
                  value={getSliderValue('openRate')}
                  onValueChange={(value) => handleSliderChange('openRate', value)}
                />
              </div>
              <div className="w-24 relative">
                <Input
                  id="openRate"
                  name="openRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={inputValues.openRate}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={errors.openRate ? "border-destructive pr-8" : "pr-8"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            {errors.openRate && (
              <p className="text-destructive text-xs mt-1">{errors.openRate}</p>
            )}
          </div>

          {/* Click Rate */}
          <div className="space-y-4">
            <Label htmlFor="clickRate" className="text-sm font-medium">
              Click Rate: {(metrics.clickRate * 100).toFixed(2)}%
            </Label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Slider
                  id="clickRate-slider"
                  name="clickRate"
                  min={0}
                  max={100}
                  step={0.01}
                  value={getSliderValue('clickRate')}
                  onValueChange={(value) => handleSliderChange('clickRate', value)}
                />
              </div>
              <div className="w-24 relative">
                <Input
                  id="clickRate"
                  name="clickRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={inputValues.clickRate}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={errors.clickRate ? "border-destructive pr-8" : "pr-8"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            {errors.clickRate && (
              <p className="text-destructive text-xs mt-1">{errors.clickRate}</p>
            )}
          </div>

          {/* Placed Order Rate */}
          <div className="space-y-4">
            <Label htmlFor="placedOrderRate" className="text-sm font-medium">
              Placed Order Rate: {(metrics.placedOrderRate * 100).toFixed(2)}%
            </Label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Slider
                  id="placedOrderRate-slider"
                  name="placedOrderRate"
                  min={0}
                  max={100}
                  step={0.01}
                  value={getSliderValue('placedOrderRate')}
                  onValueChange={(value) => handleSliderChange('placedOrderRate', value)}
                />
              </div>
              <div className="w-24 relative">
                <Input
                  id="placedOrderRate"
                  name="placedOrderRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={inputValues.placedOrderRate}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={errors.placedOrderRate ? "border-destructive pr-8" : "pr-8"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            {errors.placedOrderRate && (
              <p className="text-destructive text-xs mt-1">{errors.placedOrderRate}</p>
            )}
          </div>

          {/* Revenue Per Recipient */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="revPerRecipient" className="text-sm font-medium">
                Revenue Per Recipient: {currencySymbols[currency]}{metrics.revPerRecipient.toFixed(2)}
              </Label>
              <div className="w-24">
                <Select value={currency} onValueChange={(value) => handleCurrencyChange(value as Currency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Slider
                  id="revPerRecipient-slider"
                  name="revPerRecipient"
                  min={0}
                  max={100}
                  step={0.01}
                  value={getSliderValue('revPerRecipient')}
                  onValueChange={(value) => handleSliderChange('revPerRecipient', value)}
                />
              </div>
              <div className="w-24 relative">
                <Input
                  id="revPerRecipient"
                  name="revPerRecipient"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={inputValues.revPerRecipient}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={errors.revPerRecipient ? "border-destructive pl-8" : "pl-8"}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">{currencySymbols[currency]}</span>
                </div>
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
