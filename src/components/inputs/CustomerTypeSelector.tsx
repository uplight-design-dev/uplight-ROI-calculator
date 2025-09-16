import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Building2, Home, Users } from "lucide-react";
import type { CustomerData } from "@/pages/Index";

interface CustomerTypeSelectorProps {
  value: CustomerData;
  onChange: (value: CustomerData) => void;
}

export const CustomerTypeSelector = ({ value, onChange }: CustomerTypeSelectorProps) => {
  const handleTypeChange = (type: 'residential' | 'commercial' | 'both') => {
    onChange({
      ...value,
      type,
      // Reset related fields when type changes
      segment: type === 'commercial' ? 'office' : undefined
    });
  };

  const customerTypes = [
    {
      id: 'residential',
      label: 'Residential',
      description: 'Single-family homes and apartments',
      icon: Home
    },
    {
      id: 'commercial',
      label: 'Commercial',
      description: 'Office, retail, and light industrial',
      icon: Building2
    },
    {
      id: 'both',
      label: 'Compare Both',
      description: 'Side-by-side comparison view',
      icon: Users,
      disabled: true // Phase 2 feature
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Customer Type</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select the customer segment for analysis
        </p>
      </div>

      <RadioGroup
        value={value.type}
        onValueChange={handleTypeChange}
        className="grid gap-3"
      >
        {customerTypes.map((type) => {
          const Icon = type.icon;
          
          return (
            <div key={type.id} className="relative">
              <RadioGroupItem
                value={type.id}
                id={type.id}
                className="peer sr-only"
                disabled={type.disabled}
              />
              <Label
                htmlFor={type.id}
                className={`
                  block cursor-pointer border-2 rounded-lg p-4 transition-all
                  peer-checked:border-primary peer-checked:bg-primary/5
                  hover:border-border hover:bg-muted/50
                  ${type.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-md flex items-center justify-center mt-0.5
                    ${value.type === type.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{type.label}</span>
                      {type.disabled && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};