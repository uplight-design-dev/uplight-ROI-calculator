import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, DollarSign } from "lucide-react";

interface CostBreakdownChartProps {
  data: any[];
  title: string;
}

export const CostBreakdownChart = ({ data, title }: CostBreakdownChartProps) => {
  // Sample data structure for demonstration
  const sampleData = [
    { 
      month: 'Jan', 
      energyBefore: 145, 
      energyAfter: 123, 
      demandBefore: 85, 
      demandAfter: 64, 
      fixed: 25 
    },
    { 
      month: 'Feb', 
      energyBefore: 132, 
      energyAfter: 112, 
      demandBefore: 78, 
      demandAfter: 59, 
      fixed: 25 
    },
    { 
      month: 'Mar', 
      energyBefore: 118, 
      energyAfter: 100, 
      demandBefore: 71, 
      demandAfter: 53, 
      fixed: 25 
    },
    { 
      month: 'Apr', 
      energyBefore: 102, 
      energyAfter: 87, 
      demandBefore: 64, 
      demandAfter: 48, 
      fixed: 25 
    },
    { 
      month: 'May', 
      energyBefore: 89, 
      energyAfter: 76, 
      demandBefore: 58, 
      demandAfter: 43, 
      fixed: 25 
    },
    { 
      month: 'Jun', 
      energyBefore: 156, 
      energyAfter: 132, 
      demandBefore: 92, 
      demandAfter: 69, 
      fixed: 25 
    },
    { 
      month: 'Jul', 
      energyBefore: 198, 
      energyAfter: 168, 
      demandBefore: 118, 
      demandAfter: 89, 
      fixed: 25 
    },
    { 
      month: 'Aug', 
      energyBefore: 221, 
      energyAfter: 188, 
      demandBefore: 132, 
      demandAfter: 99, 
      fixed: 25 
    },
    { 
      month: 'Sep', 
      energyBefore: 187, 
      energyAfter: 159, 
      demandBefore: 112, 
      demandAfter: 84, 
      fixed: 25 
    },
    { 
      month: 'Oct', 
      energyBefore: 143, 
      energyAfter: 122, 
      demandBefore: 86, 
      demandAfter: 64, 
      fixed: 25 
    },
    { 
      month: 'Nov', 
      energyBefore: 167, 
      energyAfter: 142, 
      demandBefore: 98, 
      demandAfter: 74, 
      fixed: 25 
    },
    { 
      month: 'Dec', 
      energyBefore: 189, 
      energyAfter: 161, 
      demandBefore: 114, 
      demandAfter: 85, 
      fixed: 25 
    }
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const beforeTotal = payload.reduce((sum: number, item: any) => 
        sum + (item.dataKey.includes('Before') ? item.value : 0), 0
      );
      const afterTotal = payload.reduce((sum: number, item: any) => 
        sum + (item.dataKey.includes('After') ? item.value : 0), 0
      );
      const savings = beforeTotal - afterTotal;
      
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg min-w-48">
          <p className="font-medium mb-2">{label} 2024</p>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Before Program</p>
              {payload.filter((item: any) => item.dataKey.includes('Before')).map((item: any) => (
                <p key={item.dataKey} className="text-sm">
                  <span className="inline-block w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></span>
                  {item.dataKey.replace('Before', '')}: ${item.value}
                </p>
              ))}
              <p className="text-sm font-medium">Total: ${beforeTotal}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">After Program</p>
              {payload.filter((item: any) => item.dataKey.includes('After')).map((item: any) => (
                <p key={item.dataKey} className="text-sm">
                  <span className="inline-block w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></span>
                  {item.dataKey.replace('After', '')}: ${item.value}
                </p>
              ))}
              <p className="text-sm font-medium">Total: ${afterTotal}</p>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-accent">
                Monthly Savings: ${savings}
              </p>
            </div>
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
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Energy vs demand charge breakdown</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Before
          </Badge>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            After
          </Badge>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={customTooltip} />
            <Legend />
            
            {/* Before Program Bars */}
            <Bar
              dataKey="energyBefore"
              stackId="before"
              fill="hsl(var(--primary))"
              name="Energy (Before)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="demandBefore"
              stackId="before"
              fill="hsl(var(--primary) / 0.7)"
              name="Demand (Before)"
            />
            <Bar
              dataKey="fixed"
              stackId="before"
              fill="hsl(var(--muted))"
              name="Fixed Charges"
              radius={[4, 4, 0, 0]}
            />
            
            {/* After Program Bars */}
            <Bar
              dataKey="energyAfter"
              stackId="after"
              fill="hsl(var(--accent))"
              name="Energy (After)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="demandAfter"
              stackId="after"
              fill="hsl(var(--accent) / 0.7)"
              name="Demand (After)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 bg-primary rounded mr-2"></span>
          Stacked bars show energy charges, demand charges, and fixed fees. 
          Savings primarily from reduced energy and peak demand charges.
        </p>
      </div>
    </Card>
  );
};