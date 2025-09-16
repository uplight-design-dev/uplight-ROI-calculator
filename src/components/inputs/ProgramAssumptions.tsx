import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingDown, Zap, ArrowRightLeft, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ProgramSettings } from "@/pages/Index";

interface ProgramAssumptionsProps {
  value: ProgramSettings;
  onChange: (settings: ProgramSettings) => void;
}

export const ProgramAssumptions = ({ value, onChange }: ProgramAssumptionsProps) => {
  const handleChange = (field: keyof ProgramSettings, newValue: number) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  const assumptions = [
    {
      key: 'energyReduction' as keyof ProgramSettings,
      label: 'Energy Reduction',
      description: 'Overall kWh savings from efficiency measures',
      icon: TrendingDown,
      unit: '%',
      min: 0,
      max: 50,
      step: 1,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'peakReduction' as keyof ProgramSettings,
      label: 'Peak Demand Reduction',
      description: 'Peak kW reduction during on-peak hours',
      icon: Zap,
      unit: '%',
      min: 0,
      max: 60,
      step: 1,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      key: 'loadShift' as keyof ProgramSettings,
      label: 'Load Shift',
      description: 'Energy shifted from on-peak to off-peak periods',
      icon: ArrowRightLeft,
      unit: '%',
      min: 0,
      max: 30,
      step: 1,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Program Assumptions</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Configure expected program impacts and investment cost
        </p>
      </div>

      <div className="space-y-4">
        {assumptions.map((assumption) => {
          const Icon = assumption.icon;
          const currentValue = value[assumption.key];
          
          return (
            <Card key={assumption.key} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-md ${assumption.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${assumption.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">{assumption.label}</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{assumption.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assumption.description}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="ml-2">
                    {currentValue}{assumption.unit}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Slider
                    value={[currentValue]}
                    onValueChange={([newValue]) => handleChange(assumption.key, newValue)}
                    min={assumption.min}
                    max={assumption.max}
                    step={assumption.step}
                    className="flex-1"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{assumption.min}{assumption.unit}</span>
                    <span>{assumption.max}{assumption.unit}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* CAPEX Input */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="capex" className="font-medium">Program Investment (CAPEX)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Total upfront investment for energy efficiency measures and equipment
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Used to calculate payback period and ROI percentage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg">$</span>
              <Input
                id="capex"
                type="number"
                value={value.capex}
                onChange={(e) => handleChange('capex', Number(e.target.value) || 0)}
                placeholder="5,000"
                className="text-lg"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};