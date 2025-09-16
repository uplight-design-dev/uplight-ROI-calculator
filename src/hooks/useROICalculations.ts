import { useState, useEffect, useMemo } from "react";
import type { CustomerData, ProgramSettings, RatePlan } from "@/pages/Index";

interface CalculationInputs {
  customerData: CustomerData;
  ratePlan: RatePlan | null;
  programSettings: ProgramSettings;
  enabled: boolean;
}

interface CalculationResults {
  annualBillBefore: number;
  annualBillAfter: number;
  annualSavings: number;
  peakReductionKw: number;
  peakReductionPercent: number;
  simplePayback: number;
  roiPercent: number;
  monthlyBreakdown: MonthlyBreakdown[];
  hourlyData: HourlyData[];
}

interface MonthlyBreakdown {
  month: string;
  billBefore: number;
  billAfter: number;
  savings: number;
  savingsPercent: number;
  energyBefore: number;
  energyAfter: number;
  demandBefore?: number;
  demandAfter?: number;
  fixed: number;
}

interface HourlyData {
  hour: string;
  before: number;
  after: number;
  period: string;
}

export const useROICalculations = ({ 
  customerData, 
  ratePlan, 
  programSettings, 
  enabled 
}: CalculationInputs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalculationResults | null>(null);

  const calculations = useMemo(() => {
    if (!enabled || !ratePlan) return null;

    try {
      // Mock calculation logic - in real implementation, this would:
      // 1. Load customer usage data from CSV/upload/manual input
      // 2. Generate hourly profiles using the synthetic profiles 
      // 3. Apply rate calculations based on selected rate plan
      // 4. Apply program impacts (energy reduction, peak reduction, load shift)
      // 5. Calculate before/after costs and ROI metrics

      const baseMonthlyUsage = customerData.type === 'residential' ? 400 : 28000; // kWh
      const basePeakDemand = customerData.type === 'residential' ? 5.5 : 95; // kW
      
      // Generate monthly breakdown with seasonal variation
      const monthlyBreakdown: MonthlyBreakdown[] = [];
      let annualBillBefore = 0;
      let annualBillAfter = 0;

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const seasonalMultipliers = [1.1, 1.0, 0.9, 0.8, 0.7, 1.2, 1.6, 1.7, 1.4, 1.1, 1.2, 1.3];

      months.forEach((month, index) => {
        const multiplier = seasonalMultipliers[index];
        const monthlyKwh = baseMonthlyUsage * multiplier;
        const monthlyPeakKw = basePeakDemand * multiplier;

        // Before program costs
        let energyCostBefore = 0;
        let demandCostBefore = 0;
        const fixedCost = ratePlan.fixed_monthly || 0;

        if (ratePlan.type === 'flat') {
          energyCostBefore = monthlyKwh * (ratePlan.energy_rate || 0);
        } else if (ratePlan.type === 'tou') {
          // Simplified TOU calculation - 40% peak, 60% off-peak
          const peakKwh = monthlyKwh * 0.4;
          const offPeakKwh = monthlyKwh * 0.6;
          const summerRate = index >= 5 && index <= 8;
          
          if (ratePlan.periods) {
            const peakPeriod = ratePlan.periods.find((p: any) => p.id === 'peak');
            const offPeakPeriod = ratePlan.periods.find((p: any) => p.id === 'off_peak' || p.id === 'off_peak_evening');
            
            if (peakPeriod && offPeakPeriod) {
              const peakRate = summerRate ? peakPeriod.rate_summer || peakPeriod.rate : peakPeriod.rate_winter || peakPeriod.rate;
              const offPeakRate = summerRate ? offPeakPeriod.rate_summer || offPeakPeriod.rate : offPeakPeriod.rate_winter || offPeakPeriod.rate;
              
              energyCostBefore = (peakKwh * peakRate) + (offPeakKwh * offPeakRate);
            }
          }
        }

        if (ratePlan.type === 'commercial_demand' && ratePlan.demand_charges) {
          const summerSeason = index >= 5 && index <= 8;
          const maxDemandRate = summerSeason ? 
            ratePlan.demand_charges.max_kw_summer : 
            ratePlan.demand_charges.max_kw_winter;
          const peakDemandRate = summerSeason ? 
            ratePlan.demand_charges.peak_kw_summer : 
            ratePlan.demand_charges.peak_kw_winter;
          
          demandCostBefore = (monthlyPeakKw * maxDemandRate) + (monthlyPeakKw * 0.8 * peakDemandRate);
        }

        const billBefore = energyCostBefore + demandCostBefore + fixedCost;

        // After program costs (apply reductions)
        const energyReduction = programSettings.energyReduction / 100;
        const peakReduction = programSettings.peakReduction / 100;
        const loadShift = programSettings.loadShift / 100;

        const monthlyKwhAfter = monthlyKwh * (1 - energyReduction);
        const monthlyPeakKwAfter = monthlyPeakKw * (1 - peakReduction);

        let energyCostAfter = 0;
        let demandCostAfter = 0;

        if (ratePlan.type === 'flat') {
          energyCostAfter = monthlyKwhAfter * (ratePlan.energy_rate || 0);
        } else if (ratePlan.type === 'tou') {
          // Apply load shift - move some peak to off-peak
          const originalPeakKwh = monthlyKwhAfter * 0.4;
          const shiftAmount = originalPeakKwh * loadShift;
          const peakKwhAfter = originalPeakKwh - shiftAmount;
          const offPeakKwhAfter = (monthlyKwhAfter * 0.6) + shiftAmount;
          
          const summerRate = index >= 5 && index <= 8;
          
          if (ratePlan.periods) {
            const peakPeriod = ratePlan.periods.find((p: any) => p.id === 'peak');
            const offPeakPeriod = ratePlan.periods.find((p: any) => p.id === 'off_peak' || p.id === 'off_peak_evening');
            
            if (peakPeriod && offPeakPeriod) {
              const peakRate = summerRate ? peakPeriod.rate_summer || peakPeriod.rate : peakPeriod.rate_winter || peakPeriod.rate;
              const offPeakRate = summerRate ? offPeakPeriod.rate_summer || offPeakPeriod.rate : offPeakPeriod.rate_winter || offPeakPeriod.rate;
              
              energyCostAfter = (peakKwhAfter * peakRate) + (offPeakKwhAfter * offPeakRate);
            }
          }
        }

        if (ratePlan.type === 'commercial_demand' && ratePlan.demand_charges) {
          const summerSeason = index >= 5 && index <= 8;
          const maxDemandRate = summerSeason ? 
            ratePlan.demand_charges.max_kw_summer : 
            ratePlan.demand_charges.max_kw_winter;
          const peakDemandRate = summerSeason ? 
            ratePlan.demand_charges.peak_kw_summer : 
            ratePlan.demand_charges.peak_kw_winter;
          
          demandCostAfter = (monthlyPeakKwAfter * maxDemandRate) + (monthlyPeakKwAfter * 0.8 * peakDemandRate);
        }

        const billAfter = energyCostAfter + demandCostAfter + fixedCost;
        const savings = billBefore - billAfter;
        const savingsPercent = (savings / billBefore) * 100;

        monthlyBreakdown.push({
          month,
          billBefore: Math.round(billBefore),
          billAfter: Math.round(billAfter),
          savings: Math.round(savings),
          savingsPercent,
          energyBefore: Math.round(energyCostBefore),
          energyAfter: Math.round(energyCostAfter),
          demandBefore: Math.round(demandCostBefore),
          demandAfter: Math.round(demandCostAfter),
          fixed: Math.round(fixedCost)
        });

        annualBillBefore += billBefore;
        annualBillAfter += billAfter;
      });

      const annualSavings = annualBillBefore - annualBillAfter;
      const peakReductionKw = basePeakDemand * (programSettings.peakReduction / 100);
      const peakReductionPercent = programSettings.peakReduction;
      const simplePayback = programSettings.capex / annualSavings;
      const roiPercent = (annualSavings / programSettings.capex) * 100;

      // Generate sample hourly data
      const hourlyData: HourlyData[] = [];
      for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, '0') + ':00';
        const baseLoad = customerData.type === 'residential' ? 
          2.5 + Math.sin((hour - 6) / 24 * 2 * Math.PI) * 1.5 : 
          15 + Math.sin((hour - 8) / 24 * 2 * Math.PI) * 10;
        
        const beforeLoad = Math.max(0.5, baseLoad);
        const afterLoad = beforeLoad * (1 - (programSettings.energyReduction / 100));
        
        // Apply extra peak reduction during peak hours (4pm-9pm)
        const isPeakHour = hour >= 16 && hour <= 20;
        const peakReduction = isPeakHour ? programSettings.peakReduction / 100 : 0;
        const finalAfterLoad = beforeLoad * (1 - Math.max(programSettings.energyReduction / 100, peakReduction));
        
        hourlyData.push({
          hour: hourStr,
          before: Number(beforeLoad.toFixed(1)),
          after: Number(finalAfterLoad.toFixed(1)),
          period: isPeakHour ? 'Peak' : 'Off-Peak'
        });
      }

      return {
        annualBillBefore: Math.round(annualBillBefore),
        annualBillAfter: Math.round(annualBillAfter),
        annualSavings: Math.round(annualSavings),
        peakReductionKw: Number(peakReductionKw.toFixed(1)),
        peakReductionPercent,
        simplePayback: Number(simplePayback.toFixed(1)),
        roiPercent: Number(roiPercent.toFixed(1)),
        monthlyBreakdown,
        hourlyData
      };

    } catch (err) {
      console.error('Calculation error:', err);
      return null;
    }
  }, [customerData, ratePlan, programSettings, enabled]);

  useEffect(() => {
    if (!enabled || !calculations) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate calculation delay
    const timer = setTimeout(() => {
      setData(calculations);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [calculations, enabled]);

  return {
    data,
    isLoading,
    error
  };
};