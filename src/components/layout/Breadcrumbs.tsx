import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => {
  return (
    <div className="uplight-breadcrumb">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span>ROI Calculator</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Energy Savings Analysis</span>
        </div>
      </div>
    </div>
  );
};