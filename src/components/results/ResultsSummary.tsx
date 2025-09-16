import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Zap, Clock, Calculator } from "lucide-react";

interface CalculationResults {
  annualBillBefore: number;
  annualBillAfter: number;
  annualSavings: number;
  peakReductionKw: number;
  peakReductionPercent: number;
  simplePayback: number;
  roiPercent: number;
  monthlyBreakdown: any[];
  hourlyData: any[];
}

interface ResultsSummaryProps {
  calculations: CalculationResults;
}

export const ResultsSummary = ({ calculations }: ResultsSummaryProps) => {
  const kpiCards = [
    {
      title: "Annual Bill (Before)",
      value: `$${calculations.annualBillBefore.toLocaleString()}`,
      change: null,
      icon: DollarSign,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Annual Bill (After)",
      value: `$${calculations.annualBillAfter.toLocaleString()}`,
      change: null,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Annual Savings",
      value: `$${calculations.annualSavings.toLocaleString()}`,
      change: `${((calculations.annualSavings / calculations.annualBillBefore) * 100).toFixed(1)}% reduction`,
      icon: TrendingDown,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Peak Demand Reduction",
      value: `${calculations.peakReductionKw.toFixed(1)} kW`,
      change: `${calculations.peakReductionPercent.toFixed(1)}% reduction`,
      icon: Zap,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Simple Payback",
      value: `${calculations.simplePayback.toFixed(1)} years`,
      change: calculations.simplePayback < 5 ? "Excellent" : calculations.simplePayback < 10 ? "Good" : "Long-term",
      icon: Clock,
      color: calculations.simplePayback < 5 ? "text-green-600" : calculations.simplePayback < 10 ? "text-amber-600" : "text-red-600",
      bgColor: calculations.simplePayback < 5 ? "bg-green-50" : calculations.simplePayback < 10 ? "bg-amber-50" : "bg-red-50"
    },
    {
      title: "Return on Investment",
      value: `${calculations.roiPercent.toFixed(1)}%`,
      change: calculations.roiPercent > 15 ? "High ROI" : calculations.roiPercent > 8 ? "Good ROI" : "Moderate ROI",
      icon: TrendingUp,
      color: calculations.roiPercent > 15 ? "text-green-600" : calculations.roiPercent > 8 ? "text-blue-600" : "text-gray-600",
      bgColor: calculations.roiPercent > 15 ? "bg-green-50" : calculations.roiPercent > 8 ? "bg-blue-50" : "bg-gray-50"
    }
  ];

  return (
    <section className="uplight-section">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Results Summary</h2>
          <p className="text-muted-foreground">Key performance indicators for your energy program</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Card key={card.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-md ${card.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      {card.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">
                      {card.value}
                    </p>
                    
                    {card.change && (
                      <Badge 
                        variant="outline" 
                        className={`${card.color} border-current text-xs`}
                      >
                        {card.change}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};