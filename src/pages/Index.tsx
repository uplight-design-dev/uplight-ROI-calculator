import { useState, useCallback, useMemo } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CustomerTypeSelector } from "@/components/inputs/CustomerTypeSelector";
import { DataSourceTabs } from "@/components/inputs/DataSourceTabs";
import { RatePlanSelector } from "@/components/inputs/RatePlanSelector";
import { ProgramAssumptions } from "@/components/inputs/ProgramAssumptions";
import { ResultsSummary } from "@/components/results/ResultsSummary";
import { LoadCurveChart } from "@/components/results/LoadCurveChart";
import { CostBreakdownChart } from "@/components/results/CostBreakdownChart";
import { SavingsTable } from "@/components/results/SavingsTable";
import { ShareSection } from "@/components/results/ShareSection";
import { CustomerMap } from "@/components/results/CustomerMap";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, RotateCcw, Info } from "lucide-react";
import { useROICalculations } from "@/hooks/useROICalculations";
import { useToast } from "@/hooks/use-toast";

export interface CustomerData {
  type: 'residential' | 'commercial' | 'both';
  source: 'sample' | 'upload' | 'manual';
  zipCode?: string;
  segment?: string;
  uploadedData?: any;
  manualData?: any;
}

export interface ProgramSettings {
  energyReduction: number;
  peakReduction: number;
  loadShift: number;
  capex: number;
}

export interface RatePlan {
  id: string;
  name: string;
  type: string;
  customer_type: string;
  [key: string]: any;
}

interface OnboardingData {
  utilityName: string;
  utilityType: string;
  customerBase: string;
  primaryGoals: string[];
  programBudget: string;
  timeframe: string;
  additionalInfo: string;
}

const Index = () => {
  const { toast } = useToast();
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has completed onboarding before
    return !localStorage.getItem('uplight-onboarding-completed');
  });
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  
  // Input States
  const [customerData, setCustomerData] = useState<CustomerData>({
    type: 'residential',
    source: 'sample',
    zipCode: '94103',
    segment: 'office'
  });
  
  const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);
  
  const [programSettings, setProgramSettings] = useState<ProgramSettings>({
    energyReduction: 15,
    peakReduction: 25,
    loadShift: 10,
    capex: 5000
  });
  
  const [hasCalculated, setHasCalculated] = useState(false);
  
  // Calculations hook
  const calculations = useROICalculations({
    customerData,
    ratePlan: selectedRatePlan,
    programSettings,
    enabled: hasCalculated
  });

  const handleOnboardingComplete = useCallback((data: OnboardingData) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    localStorage.setItem('uplight-onboarding-completed', 'true');
    localStorage.setItem('uplight-onboarding-data', JSON.stringify(data));
    
    toast({
      title: "Welcome to Uplight ROI Calculator!",
      description: `Thanks for the info, ${data.utilityName}. Let's calculate your ROI.`
    });
  }, [toast]);

  const handleOnboardingSkip = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem('uplight-onboarding-completed', 'true');
  }, []);
  
  const handleCalculate = useCallback(() => {
    if (!selectedRatePlan) {
      toast({
        title: "Rate Plan Required",
        description: "Please select a rate plan before calculating.",
        variant: "destructive"
      });
      return;
    }
    
    setHasCalculated(true);
    toast({
      title: "Calculation Complete",
      description: "ROI analysis has been updated with your current inputs."
    });
  }, [selectedRatePlan, toast]);
  
  const handleReset = useCallback(() => {
    setCustomerData({
      type: 'residential',
      source: 'sample',
      zipCode: '94103',
      segment: 'office'
    });
    setSelectedRatePlan(null);
    setProgramSettings({
      energyReduction: 15,
      peakReduction: 25,
      loadShift: 10,
      capex: 5000
    });
    setHasCalculated(false);
    
    toast({
      title: "Calculator Reset",
      description: "All inputs have been reset to defaults."
    });
  }, [toast]);
  
  const isValid = useMemo(() => {
    return selectedRatePlan && 
           (customerData.source === 'sample' || 
            customerData.uploadedData || 
            customerData.manualData);
  }, [selectedRatePlan, customerData]);

  // Show onboarding flow if not completed
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumbs />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold uplight-gradient-text mb-4">
            Uplight ROI Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Model energy and demand savings for residential and commercial customers. 
            Calculate ROI, payback periods, and visualize load impacts with California rate plans.
          </p>
          {onboardingData && (
            <div className="mt-4 text-sm text-muted-foreground">
              Configured for: <span className="font-medium">{onboardingData.utilityName}</span> • 
              {onboardingData.customerBase} customers
            </div>
          )}
        </div>

        {/* ... keep existing code (Inputs Section) */}
        
        <section className="uplight-section">
          <div className="uplight-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Input Parameters</h2>
                <p className="text-muted-foreground">Configure customer type, data source, and program assumptions</p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <CustomerTypeSelector 
                  value={customerData}
                  onChange={setCustomerData}
                />
                
                <DataSourceTabs
                  value={customerData}
                  onChange={setCustomerData}
                />
              </div>
              
              <div className="space-y-6">
                <RatePlanSelector
                  customerType={customerData.type}
                  value={selectedRatePlan}
                  onChange={setSelectedRatePlan}
                />
                
                <ProgramAssumptions
                  value={programSettings}
                  onChange={setProgramSettings}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button 
                onClick={handleCalculate}
                disabled={!isValid}
                className="flex-1 max-w-xs"
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate ROI
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {!isValid && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Please select a rate plan and ensure you have valid customer data to calculate ROI.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </section>

        {/* Results Section */}
        {hasCalculated && calculations.data && (
          <>
            <div data-pdf-capture="results">
              <ResultsSummary calculations={calculations.data} />
            </div>
            
            <section className="uplight-section" data-pdf-capture="map">
              <CustomerMap 
                zipCode={customerData.zipCode || '94103'}
                customerType={customerData.type}
              />
            </section>
            
            <section className="uplight-section" data-pdf-capture="charts">
              <div className="grid lg:grid-cols-2 gap-8">
                <LoadCurveChart 
                  data={calculations.data.hourlyData}
                  title="Load Profile Comparison" 
                />
                <CostBreakdownChart 
                  data={calculations.data.monthlyBreakdown}
                  title="Monthly Cost Analysis"
                />
              </div>
            </section>
            
            <SavingsTable calculations={calculations.data} />
          </>
        )}
        
        <ShareSection calculations={hasCalculated ? calculations.data : null} />
      </main>
    </div>
  );
};

export default Index;