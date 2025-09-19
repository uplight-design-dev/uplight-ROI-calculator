import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle, Building, Home, Zap, Target } from "lucide-react";

interface OnboardingData {
  utilityName: string;
  utilityType: 'municipal' | 'cooperative' | 'investor-owned' | 'other';
  customerBase: string;
  primaryGoals: string[];
  programBudget: string;
  timeframe: string;
  additionalInfo: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 'utility-info',
    title: 'Tell us about your utility',
    description: 'Help us customize the experience for your organization'
  },
  {
    id: 'customer-base',
    title: 'Customer Profile',
    description: 'What type of customers do you primarily serve?'
  },
  {
    id: 'program-goals',
    title: 'Program Objectives',
    description: 'What are your key goals for demand response programs?'
  },
  {
    id: 'program-details',
    title: 'Program Details',
    description: 'Budget and timeline for your initiatives'
  }
];

const PROGRAM_GOALS = [
  { id: 'peak-reduction', label: 'Peak Demand Reduction', icon: Zap },
  { id: 'cost-savings', label: 'Customer Cost Savings', icon: Target },
  { id: 'grid-stability', label: 'Grid Stability', icon: Building },
  { id: 'environmental', label: 'Environmental Impact', icon: Home },
  { id: 'customer-engagement', label: 'Customer Engagement', icon: CheckCircle },
  { id: 'revenue-optimization', label: 'Revenue Optimization', icon: Target }
];

export const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    utilityName: '',
    utilityType: 'investor-owned',
    customerBase: '',
    primaryGoals: [],
    programBudget: '',
    timeframe: '',
    additionalInfo: ''
  });

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const toggleGoal = (goal: string) => {
    setData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const renderStep = () => {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.id) {
      case 'utility-info':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="utility-name">Utility Name</Label>
              <Input
                id="utility-name"
                value={data.utilityName}
                onChange={(e) => setData(prev => ({ ...prev, utilityName: e.target.value }))}
                placeholder="e.g., Pacific Gas & Electric"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Utility Type</Label>
              <RadioGroup 
                value={data.utilityType} 
                onValueChange={(value) => setData(prev => ({ ...prev, utilityType: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="investor-owned" id="investor-owned" />
                  <Label htmlFor="investor-owned">Investor-Owned Utility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="municipal" id="municipal" />
                  <Label htmlFor="municipal">Municipal Utility</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cooperative" id="cooperative" />
                  <Label htmlFor="cooperative">Cooperative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'customer-base':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-base">Approximate Number of Customers</Label>
              <Input
                id="customer-base"
                value={data.customerBase}
                onChange={(e) => setData(prev => ({ ...prev, customerBase: e.target.value }))}
                placeholder="e.g., 100,000"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This helps us scale our ROI calculations and provide more relevant insights.
            </p>
          </div>
        );

      case 'program-goals':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select all that apply to your program objectives:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PROGRAM_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.primaryGoals.includes(goal.id);
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{goal.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'program-details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="program-budget">Estimated Program Budget</Label>
              <Input
                id="program-budget"
                value={data.programBudget}
                onChange={(e) => setData(prev => ({ ...prev, programBudget: e.target.value }))}
                placeholder="e.g., $500,000 - $1,000,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Implementation Timeframe</Label>
              <Input
                id="timeframe"
                value={data.timeframe}
                onChange={(e) => setData(prev => ({ ...prev, timeframe: e.target.value }))}
                placeholder="e.g., 12-18 months"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information (Optional)</Label>
              <Textarea
                id="additional-info"
                value={data.additionalInfo}
                onChange={(e) => setData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any specific requirements, challenges, or goals you'd like us to consider..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl uplight-card">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold uplight-gradient-text">
              Welcome to Uplight ROI Calculator
            </h1>
            <p className="text-muted-foreground">
              Let's customize your experience in just a few steps
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">{ONBOARDING_STEPS[currentStep].title}</h2>
              <p className="text-muted-foreground">{ONBOARDING_STEPS[currentStep].description}</p>
            </div>

            <div className="min-h-[200px]">
              {renderStep()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                Skip Setup
              </Button>
            </div>

            <Button onClick={handleNext}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};