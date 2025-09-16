import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Zap } from "lucide-react";

export const Navigation = () => {
  return (
    <header className="uplight-nav">
      <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-7xl">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-uplight-primary-dark flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold uplight-gradient-text">
              Uplight ROI Calculator
            </h1>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" disabled>
            <Share2 className="w-4 h-4 mr-2" />
            Share
            <Badge variant="secondary" className="ml-2 text-xs">
              Coming Soon
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};