import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportProps {
  calculations: any;
  disabled?: boolean;
}

export const PDFExport = ({ calculations, disabled = false }: PDFExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!calculations) return;
    
    setIsExporting(true);
    
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(7, 78, 255); // Uplight blue
      pdf.text('Uplight ROI Calculator Report', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40);
      
      let yPosition = 60;
      
      // Add summary data
      pdf.setFontSize(16);
      pdf.text('Executive Summary', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(11);
      const summaryData = [
        `Annual Bill Before: $${calculations.annualBillBefore?.toLocaleString() || 'N/A'}`,
        `Annual Bill After: $${calculations.annualBillAfter?.toLocaleString() || 'N/A'}`,
        `Annual Savings: $${calculations.annualSavings?.toLocaleString() || 'N/A'}`,
        `Peak Demand Reduction: ${calculations.peakReduction || 'N/A'} kW`,
        `Simple Payback: ${calculations.simplePayback || 'N/A'} years`,
        `ROI: ${calculations.roi || 'N/A'}%`
      ];
      
      summaryData.forEach(item => {
        pdf.text(item, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Try to capture charts if available
      const resultsSection = document.querySelector('[data-pdf-capture="results"]');
      const chartsSection = document.querySelector('[data-pdf-capture="charts"]');
      const mapSection = document.querySelector('[data-pdf-capture="map"]');
      
      if (resultsSection) {
        try {
          const canvas = await html2canvas(resultsSection as HTMLElement, {
            scale: 1,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.warn('Could not capture results section:', error);
        }
      }
      
      if (chartsSection && yPosition < pageHeight - 50) {
        try {
          if (yPosition > pageHeight / 2) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const canvas = await html2canvas(chartsSection as HTMLElement, {
            scale: 0.8,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, Math.min(imgHeight, 100));
          yPosition += Math.min(imgHeight, 100) + 10;
        } catch (error) {
          console.warn('Could not capture charts section:', error);
        }
      }
      
      if (mapSection && yPosition < pageHeight - 50) {
        try {
          if (yPosition > pageHeight / 2) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const canvas = await html2canvas(mapSection as HTMLElement, {
            scale: 0.8,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, Math.min(imgHeight, 80));
        } catch (error) {
          console.warn('Could not capture map section:', error);
        }
      }
      
      // Add footer
      const pageCount = pdf.internal.pages.length - 1; // Subtract 1 because pages array includes a blank first element
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
        pdf.text('Uplight ROI Calculator', 20, pageHeight - 10);
      }
      
      // Save the PDF
      pdf.save(`uplight-roi-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF Export Complete",
        description: "Your ROI report has been downloaded successfully."
      });
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (disabled) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export PDF
        <Badge variant="secondary" className="ml-1 text-xs">Calculate First</Badge>
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExportPDF}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Generating...' : 'Export PDF'}
      {!isExporting && <FileText className="w-3 h-3 ml-1 opacity-60" />}
    </Button>
  );
};