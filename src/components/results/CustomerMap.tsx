import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Car, Zap } from "lucide-react";

// Mock data for demonstration
const getAreaData = (zipCode: string) => ({
  zipCode,
  center: { lat: 37.7749, lng: -122.4194 }, // Default SF coordinates
  totalCustomers: Math.floor(Math.random() * 50000) + 10000,
  evOwners: Math.floor(Math.random() * 5000) + 1000,
  potentialSavings: Math.floor(Math.random() * 2000000) + 500000,
  neighborhoods: [
    { name: "Downtown", customers: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Residential Area", customers: Math.floor(Math.random() * 8000) + 2000 },
    { name: "Commercial District", customers: Math.floor(Math.random() * 3000) + 500 }
  ]
});

interface CustomerMapProps {
  zipCode: string;
  customerType: 'residential' | 'commercial' | 'both';
}

export const CustomerMap = ({ zipCode, customerType }: CustomerMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [areaData] = useState(() => getAreaData(zipCode));
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Simple mock map visualization
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.className = "w-full h-full rounded-lg";
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Get computed colors from CSS variables
      const computedStyle = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      
      // Draw map background
      ctx.fillStyle = isDark ? '#1a1a1a' : '#f1f5f9';
      ctx.fillRect(0, 0, 400, 300);
      
      // Draw zip code area
      ctx.fillStyle = isDark ? 'rgba(0, 71, 255, 0.3)' : 'rgba(7, 78, 255, 0.2)';
      ctx.fillRect(50, 50, 300, 200);
      
      // Draw customer density points
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = customerType === 'residential' 
          ? (isDark ? '#00E297' : '#00E4A0')
          : (isDark ? '#0047FF' : '#074EFF');
        ctx.beginPath();
        ctx.arc(
          80 + Math.random() * 240,
          80 + Math.random() * 140,
          3 + Math.random() * 4,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
      
      // Add labels
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.fillText(`ZIP ${zipCode}`, 60, 40);
    }
    
    mapRef.current.appendChild(canvas);
    setMapLoaded(true);

    return () => {
      if (mapRef.current && canvas.parentNode) {
        mapRef.current.removeChild(canvas);
      }
    };
  }, [zipCode, customerType]);

  return (
    <Card className="uplight-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Service Area Analysis</h3>
          <p className="text-sm text-muted-foreground">ZIP Code {zipCode}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Visualization */}
        <div className="space-y-4">
          <div ref={mapRef} className="h-64 bg-muted rounded-lg relative overflow-hidden">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground">Loading map...</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {customerType === 'residential' ? 'Residential' : 
               customerType === 'commercial' ? 'Commercial' : 'Mixed'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Car className="w-3 h-3" />
              EV Potential
            </Badge>
          </div>
        </div>

        {/* Area Statistics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Total Customers</span>
              </div>
              <div className="text-2xl font-bold">{areaData.totalCustomers.toLocaleString()}</div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">EV Owners</span>
              </div>
              <div className="text-2xl font-bold text-accent">{areaData.evOwners.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Market Opportunity</span>
            </div>
            <div className="text-lg font-bold">${areaData.potentialSavings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Annual potential savings across area</div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Neighborhood Breakdown</h4>
            {areaData.neighborhoods.map((neighborhood, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-sm">{neighborhood.name}</span>
                <Badge variant="outline" className="text-xs">
                  {neighborhood.customers.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};