import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from "lucide-react";

interface LoadCurveChartProps {
  data: any[];
  title: string;
}

export const LoadCurveChart = ({ data, title }: LoadCurveChartProps) => {
  // Sample data structure for demonstration
  const sampleData = [
    { hour: '00:00', before: 2.1, after: 2.0, period: 'Off-Peak' },
    { hour: '01:00', before: 2.0, after: 1.9, period: 'Off-Peak' },
    { hour: '02:00', before: 1.9, after: 1.8, period: 'Off-Peak' },
    { hour: '03:00', before: 1.8, after: 1.7, period: 'Off-Peak' },
    { hour: '04:00', before: 1.8, after: 1.7, period: 'Off-Peak' },
    { hour: '05:00', before: 1.9, after: 1.8, period: 'Off-Peak' },
    { hour: '06:00', before: 2.2, after: 2.1, period: 'Off-Peak' },
    { hour: '07:00', before: 2.7, after: 2.5, period: 'Off-Peak' },
    { hour: '08:00', before: 3.2, after: 3.0, period: 'Off-Peak' },
    { hour: '09:00', before: 3.4, after: 3.2, period: 'Off-Peak' },
    { hour: '10:00', before: 3.6, after: 3.4, period: 'Off-Peak' },
    { hour: '11:00', before: 3.8, after: 3.6, period: 'Off-Peak' },
    { hour: '12:00', before: 3.9, after: 3.7, period: 'Off-Peak' },
    { hour: '13:00', before: 4.0, after: 3.8, period: 'Off-Peak' },
    { hour: '14:00', before: 4.1, after: 3.9, period: 'Off-Peak' },
    { hour: '15:00', before: 4.2, after: 4.0, period: 'Off-Peak' },
    { hour: '16:00', before: 4.6, after: 3.5, period: 'Peak' },
    { hour: '17:00', before: 4.8, after: 3.6, period: 'Peak' },
    { hour: '18:00', before: 5.1, after: 3.8, period: 'Peak' },
    { hour: '19:00', before: 5.3, after: 4.0, period: 'Peak' },
    { hour: '20:00', before: 5.5, after: 4.1, period: 'Peak' },
    { hour: '21:00', before: 5.2, after: 4.4, period: 'Off-Peak' },
    { hour: '22:00', before: 4.6, after: 4.1, period: 'Off-Peak' },
    { hour: '23:00', before: 3.9, after: 3.7, period: 'Off-Peak' },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground mb-2">{data.period}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>
              Before: {payload[0].value.toFixed(1)} kW
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-accent rounded mr-2"></span>
              After: {payload[1].value.toFixed(1)} kW
            </p>
            <p className="text-sm font-medium text-accent">
              Reduction: {(payload[0].value - payload[1].value).toFixed(1)} kW
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="uplight-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Typical weekday load profile</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Before Program
          </Badge>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            After Program
          </Badge>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            
            {/* Peak period highlight */}
            <ReferenceLine 
              x="16:00" 
              stroke="hsl(var(--accent))" 
              strokeDasharray="2 2" 
              strokeOpacity={0.5}
            />
            <ReferenceLine 
              x="21:00" 
              stroke="hsl(var(--accent))" 
              strokeDasharray="2 2" 
              strokeOpacity={0.5}
            />
            
            <Line
              type="monotone"
              dataKey="before"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              name="Before Program"
            />
            <Line
              type="monotone"
              dataKey="after"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
              name="After Program"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-3 bg-accent/5 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 bg-accent rounded mr-2"></span>
          Peak period (4pm-9pm) highlighted with vertical lines. 
          Greatest savings occur during peak demand hours.
        </p>
      </div>
    </Card>
  );
};