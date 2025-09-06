import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, YAxis, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useData } from "../data-wrapper"

const chartConfig = {
  battery_temperature: {
    label: "Temperature",
    color: "#2563eb",
  }
} satisfies ChartConfig

/**
 * A Card component that includes a Chart, showing the last 30 seconds of temperature readings 
 * @returns {JSX.Element} The card with the chart component.
 */
export default function TempChartCard(): JSX.Element {
  const { tempData } = useData();
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-light flex items-center gap-2">
            <TrendingUp />
            Temperature Over Last 30 Seconds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer  config={chartConfig} className="min-h-[200px] w-full">
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(ts) => {
                const lastTimestamp = tempData[tempData.length - 1]?.timestamp ?? Date.now();
                const seconds = Math.round((ts - lastTimestamp) / 1000) + 30; //
                return `${seconds}s`;
              }} />
              <YAxis />
              <ChartTooltip content={
                <ChartTooltipContent hideLabel={true} hideIndicator={true}/>} 
              />
              <Line 
                type="monotone"
                dataKey="battery_temperature"
                stroke="var(--color-battery_temperature)"
                isAnimationActive={false}
                strokeWidth={3}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
}