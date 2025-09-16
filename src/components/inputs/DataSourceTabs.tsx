import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Edit3, Download, Info } from "lucide-react";
import type { CustomerData } from "@/pages/Index";

interface DataSourceTabsProps {
  value: CustomerData;
  onChange: (value: CustomerData) => void;
}

export const DataSourceTabs = ({ value, onChange }: DataSourceTabsProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const zipCodes = ['94103', '94105', '94110', '94118'];
  const segments = [
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' },
    { value: 'light_industrial', label: 'Light Industrial' }
  ];

  const handleTabChange = (source: 'sample' | 'upload' | 'manual') => {
    onChange({
      ...value,
      source,
      uploadedData: source === 'upload' ? value.uploadedData : undefined,
      manualData: source === 'manual' ? value.manualData : undefined
    });
  };

  const handleZipCodeChange = (zipCode: string) => {
    onChange({ ...value, zipCode });
  };

  const handleSegmentChange = (segment: string) => {
    onChange({ ...value, segment });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files[0]);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    setUploadError(null);
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    // Simulate file processing
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        // Basic validation - check for expected headers
        const firstLine = csvText.split('\n')[0].toLowerCase();
        
        const hasExpectedHeaders = 
          firstLine.includes('kwh') || 
          firstLine.includes('kw') || 
          firstLine.includes('datetime');
        
        if (!hasExpectedHeaders) {
          setUploadError('CSV must contain energy data columns (kWh, kW, or datetime)');
          return;
        }
        
        onChange({
          ...value,
          source: 'upload',
          uploadedData: {
            filename: file.name,
            size: file.size,
            data: csvText
          }
        });
      } catch (error) {
        setUploadError('Error reading CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleManualDataChange = (field: string, value: any) => {
    onChange({
      ...value,
      source: 'manual',
      manualData: {
        ...value.manualData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Data Source</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how to provide energy usage data
        </p>
      </div>

      <Tabs value={value.source} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sample" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Sample Data
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sample" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="zipcode">ZIP Code</Label>
                <Select value={value.zipCode} onValueChange={handleZipCodeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ZIP code" />
                  </SelectTrigger>
                  <SelectContent>
                    {zipCodes.map((zip) => (
                      <SelectItem key={zip} value={zip}>
                        {zip} (San Francisco)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {value.type === 'commercial' && (
                <div>
                  <Label htmlFor="segment">Business Segment</Label>
                  <Select value={value.segment} onValueChange={handleSegmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.value} value={segment.value}>
                          {segment.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Using PG&E sample data for {value.zipCode} • 
                {value.type === 'commercial' ? ` ${segments.find(s => s.value === value.segment)?.label} segment` : ' Residential'} • 
                12 months of usage data
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragOver ? 'drag-over' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Drop CSV file here</h3>
            <p className="text-muted-foreground mb-4">
              Or click to select a file from your computer
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e.target.files?.[0]!)}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" asChild>
              <Label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </Label>
            </Button>
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {value.uploadedData && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{value.uploadedData.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {(value.uploadedData.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ ...value, uploadedData: undefined })}
                >
                  Remove
                </Button>
              </div>
            </Card>
          )}

          <div className="flex gap-2 text-sm">
            <Button variant="link" size="sm" className="p-0 h-auto">
              <Download className="w-4 h-4 mr-1" />
              Download monthly template
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button variant="link" size="sm" className="p-0 h-auto">
              <Download className="w-4 h-4 mr-1" />
              Download hourly template
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4 mt-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter average monthly usage and peak demand
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="monthly-kwh">Average Monthly kWh</Label>
                <Input
                  id="monthly-kwh"
                  type="number"
                  placeholder="1,200"
                  value={value.manualData?.monthlyKwh || ''}
                  onChange={(e) => handleManualDataChange('monthlyKwh', e.target.value)}
                />
              </div>
              
              {value.type === 'commercial' && (
                <div>
                  <Label htmlFor="peak-kw">Peak Demand (kW)</Label>
                  <Input
                    id="peak-kw"
                    type="number"
                    placeholder="15.5"
                    value={value.manualData?.peakKw || ''}
                    onChange={(e) => handleManualDataChange('peakKw', e.target.value)}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};