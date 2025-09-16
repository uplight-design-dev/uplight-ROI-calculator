import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Info, Eye, DollarSign, Clock, Zap } from "lucide-react";
import type { RatePlan } from "@/pages/Index";

interface RatePlanSelectorProps {
  customerType: 'residential' | 'commercial' | 'both';
  value: RatePlan | null;
  onChange: (plan: RatePlan | null) => void;
}

export const RatePlanSelector = ({ customerType, value, onChange }: RatePlanSelectorProps) => {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatePlans = async () => {
      try {
        const response = await fetch('/data/rates_ca.json');
        const data = await response.json();
        
        const filteredPlans = data.plans.filter((plan: RatePlan) => 
          customerType === 'both' || plan.customer_type === customerType
        );
        
        setRatePlans(filteredPlans);
        
        // Auto-select first matching plan if none selected
        if (!value && filteredPlans.length > 0) {
          onChange(filteredPlans[0]);
        }
      } catch (error) {
        console.error('Error loading rate plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatePlans();
  }, [customerType, value, onChange]);

  const getRateTypeColor = (type: string) => {
    switch (type) {
      case 'flat': return 'bg-blue-100 text-blue-800';
      case 'tou': return 'bg-green-100 text-green-800';
      case 'commercial_demand': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRateTypeLabel = (type: string) => {
    switch (type) {
      case 'flat': return 'Flat Rate';
      case 'tou': return 'Time-of-Use';
      case 'commercial_demand': return 'Demand Charge';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Label className="text-base font-medium">Rate Plan</Label>
        <div className="h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Rate Plan</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select the applicable utility rate schedule
        </p>
      </div>

      <div className="space-y-3">
        <Select
          value={value?.id || ''}
          onValueChange={(planId) => {
            const plan = ratePlans.find(p => p.id === planId);
            onChange(plan || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a rate plan..." />
          </SelectTrigger>
          <SelectContent>
            {ratePlans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                <div className="flex items-center gap-2">
                  <span>{plan.name}</span>
                  <Badge className={`text-xs ${getRateTypeColor(plan.type)}`}>
                    {getRateTypeLabel(plan.type)}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value && (
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{value.name}</h4>
                  <Badge className={`text-xs ${getRateTypeColor(value.type)}`}>
                    {getRateTypeLabel(value.type)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Fixed: ${value.fixed_monthly}/month</span>
                  </div>
                  
                  {value.type === 'flat' && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span>Rate: ${value.energy_rate}/kWh</span>
                    </div>
                  )}
                  
                  {value.type === 'tou' && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Time-based pricing</span>
                    </div>
                  )}
                  
                  {value.type === 'commercial_demand' && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span>Includes demand charges</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {value.description}
                </p>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full max-w-md">
                  <SheetHeader>
                    <SheetTitle>{value.name}</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Utility:</span>
                          <span>{value.utility || 'PG&E'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge className={`text-xs ${getRateTypeColor(value.type)}`}>
                            {getRateTypeLabel(value.type)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fixed Charge:</span>
                          <span>${value.fixed_monthly}/month</span>
                        </div>
                      </div>
                    </div>

                    {value.type === 'tou' && value.periods && (
                      <div>
                        <h4 className="font-medium mb-2">Time-of-Use Periods</h4>
                        <div className="space-y-2">
                          {value.periods.map((period: any, index: number) => (
                            <div key={index} className="p-3 bg-muted rounded-md text-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium">{period.label}</span>
                                  <p className="text-muted-foreground text-xs mt-1">
                                    {period.start} - {period.end}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div>${period.rate_summer || period.rate}/kWh</div>
                                  {period.rate_summer && (
                                    <div className="text-xs text-muted-foreground">
                                      Summer rate
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {value.type === 'commercial_demand' && value.demand_charges && (
                      <div>
                        <h4 className="font-medium mb-2">Demand Charges</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Max Demand (Summer):</span>
                            <span>${value.demand_charges.max_kw_summer}/kW</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peak Demand (Summer):</span>
                            <span>${value.demand_charges.peak_kw_summer}/kW</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};