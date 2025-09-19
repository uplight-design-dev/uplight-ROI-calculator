import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Link, Mail, FileText } from "lucide-react";
import { PDFExport } from "./PDFExport";

interface ShareSectionProps {
  calculations?: any;
}

export const ShareSection = ({ calculations }: ShareSectionProps) => {
  return (
    <section className="uplight-section">
      <Card className="uplight-card text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-muted to-muted-foreground/20 flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-3">Share & Export Results</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Save your ROI analysis and share insights with stakeholders. Export detailed reports 
            or create shareable links to your calculations.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <PDFExport 
              calculations={calculations}
              disabled={!calculations}
            />
            
            <Button variant="outline" disabled className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export CSV
              <Badge variant="secondary" className="ml-1 text-xs">Coming Soon</Badge>
            </Button>
            
            <Button variant="outline" disabled className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Share Link
              <Badge variant="secondary" className="ml-1 text-xs">Coming Soon</Badge>
            </Button>
            
            <Button variant="outline" disabled className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Report
              <Badge variant="secondary" className="ml-1 text-xs">Coming Soon</Badge>
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>New:</strong> PDF export is now available! Additional sharing capabilities including 
              CSV data exports, permalink URLs, and integrated email delivery coming in Phase 2. 
              Multi-site portfolio analysis and benchmarking features will also be available.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};