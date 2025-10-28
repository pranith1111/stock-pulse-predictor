import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { ChartDataPoint } from "@shared/schema";

interface StockChartProps {
  symbol: string;
}

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export function StockChart({ symbol }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");

  const { data: chartData, isLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ["/api/stocks/chart", symbol, timeRange],
    enabled: !!symbol,
  });

  const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

  const isPositive = chartData && chartData.length > 1 
    ? chartData[chartData.length - 1].price >= chartData[0].price 
    : true;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-xl">Price Chart</CardTitle>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                data-testid={`button-timerange-${range}`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "hsl(142, 71%, 35%)" : "hsl(0, 84%, 50%)"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "hsl(142, 71%, 35%)" : "hsl(0, 84%, 50%)"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(142, 71%, 35%)" : "hsl(0, 84%, 50%)"}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No chart data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
