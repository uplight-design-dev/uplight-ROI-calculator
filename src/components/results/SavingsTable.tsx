import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, Calendar } from "lucide-react";

interface CalculationResults {
  annualBillBefore: number;
  annualBillAfter: number;
  annualSavings: number;
  monthlyBreakdown: any[];
  [key: string]: any;
}

interface SavingsTableProps {
  calculations: CalculationResults;
}

export const SavingsTable = ({ calculations }: SavingsTableProps) => {
  // Sample monthly breakdown data
  const sampleBreakdown = [
    { month: 'January', billBefore: 255, billAfter: 212, savings: 43, savingsPercent: 16.9 },
    { month: 'February', billBefore: 235, billAfter: 196, savings: 39, savingsPercent: 16.6 },
    { month: 'March', billBefore: 214, billAfter: 178, savings: 36, savingsPercent: 16.8 },
    { month: 'April', billBefore: 191, billAfter: 159, savings: 32, savingsPercent: 16.8 },
    { month: 'May', billBefore: 172, billAfter: 144, savings: 28, savingsPercent: 16.3 },
    { month: 'June', billBefore: 273, billAfter: 226, savings: 47, savingsPercent: 17.2 },
    { month: 'July', billBefore: 341, billAfter: 282, savings: 59, savingsPercent: 17.3 },
    { month: 'August', billBefore: 378, billAfter: 312, savings: 66, savingsPercent: 17.5 },
    { month: 'September', billBefore: 324, billAfter: 268, savings: 56, savingsPercent: 17.3 },
    { month: 'October', billBefore: 254, billAfter: 211, savings: 43, savingsPercent: 16.9 },
    { month: 'November', billBefore: 290, billAfter: 241, savings: 49, savingsPercent: 16.9 },  
    { month: 'December', billBefore: 328, billAfter: 271, savings: 57, savingsPercent: 17.4 }
  ];

  const monthlyData = calculations.monthlyBreakdown?.length > 0 
    ? calculations.monthlyBreakdown 
    : sampleBreakdown;

  const totalBefore = monthlyData.reduce((sum, month) => sum + month.billBefore, 0);
  const totalAfter = monthlyData.reduce((sum, month) => sum + month.billAfter, 0);
  const totalSavings = totalBefore - totalAfter;
  const averageSavingsPercent = (totalSavings / totalBefore) * 100;

  return (
    <section className="uplight-section">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Monthly Savings Analysis</h2>
          <p className="text-muted-foreground">Detailed breakdown of costs and savings by month</p>
        </div>
      </div>

      <Card className="uplight-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Month</TableHead>
                <TableHead className="text-right font-semibold">Bill Before</TableHead>
                <TableHead className="text-right font-semibold">Bill After</TableHead>
                <TableHead className="text-right font-semibold">Monthly Savings</TableHead>
                <TableHead className="text-right font-semibold">Savings %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {month.month}
                  </TableCell>
                  <TableCell className="text-right">
                    ${month.billBefore.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${month.billAfter.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TrendingDown className="w-4 h-4 text-accent" />
                      <span className="font-medium text-accent">
                        ${month.savings.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="outline"
                      className="bg-accent/10 text-accent border-accent/20"
                    >
                      {month.savingsPercent.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Annual Total Row */}
              <TableRow className="border-t-2 font-semibold bg-muted/30">
                <TableCell className="font-bold">
                  Annual Total
                </TableCell>
                <TableCell className="text-right">
                  ${totalBefore.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${totalAfter.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TrendingDown className="w-4 h-4 text-accent" />
                    <span className="font-bold text-accent text-lg">
                      ${totalSavings.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline"
                    className="bg-accent/20 text-accent border-accent font-semibold"
                  >
                    {averageSavingsPercent.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Summary Narrative */}
        <div className="mt-6 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border-l-4 border-accent">
          <h4 className="font-semibold text-foreground mb-2">Program Impact Summary</h4>
          <p className="text-muted-foreground">
            This energy efficiency program delivers consistent savings throughout the year, with an average reduction of{' '}
            <span className="font-semibold text-accent">{averageSavingsPercent.toFixed(1)}%</span> in monthly energy bills. 
            The highest savings occur during summer months (June-September) when cooling loads and time-of-use rates create 
            maximum opportunity for demand reduction. With an annual savings of{' '}
            <span className="font-semibold text-accent">${totalSavings.toLocaleString()}</span>, 
            this program demonstrates strong financial performance and environmental benefits.
          </p>
        </div>
      </Card>
    </section>
  );
};