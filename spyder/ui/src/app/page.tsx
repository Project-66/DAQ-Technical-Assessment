"use client"

import { useState, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Sun, Moon, AlertTriangle, TrendingUp } from "lucide-react"
import Numeric from "../components/custom/numeric"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, YAxis, XAxis } from "recharts"

const WS_URL = "ws://localhost:8080"

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

const chartConfig = {
  battery_temperature: {
    label: "Temperature",
    color: "#2563eb",
  }
} satisfies ChartConfig

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 * Could this be split into more components?...
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [temperature, setTemperature] = useState<any>(0)
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  const [tempData, setTempData] = useState<VehicleData[]>([]);
  const [ warning, setWarning ] = useState(false);

  /**
   * Effect hook to handle WebSocket connection state changes.
   */
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [readyState, setConnectionStatus])

  /**
   * Effect hook to handle incoming WebSocket messages.
   */
  useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }
    setTemperature(lastJsonMessage.battery_temperature)

    const currTemp: VehicleData = {
      battery_temperature: lastJsonMessage.battery_temperature,
      timestamp: lastJsonMessage.timestamp
    }

    // only keeps the last 30 seconds of data on the graph
    setTempData(prev => {
      const updated = [...prev, currTemp];
      const cutoff = currTemp.timestamp - 30000;
      return updated.filter(item => item.timestamp >= cutoff);
    });

    const warningDataLen = tempData
      .filter(curr => curr.timestamp > (tempData[tempData.length - 1].timestamp - 5000))
      .filter(curr => curr.battery_temperature > 80 || curr.battery_temperature < 20)
      .length;

    setWarning(warningDataLen >= 3);


  }, [lastJsonMessage])


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 h-20 flex items-center gap-5 border-b">
        <Image
          src={theme === "dark" ? RedbackLogoDarkMode : RedbackLogoLightMode}
          className="h-12 w-auto"
          alt="Redback Racing Logo"
        />
        <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
          {connectionStatus}
        </Badge>
        <button
          className="ml-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center gap-6 p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Live Battery Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Numeric temp={temperature.toFixed(3)} />
          </CardContent>
        </Card>

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

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Temperature Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {warning ? "WARNING: the battery temperature has exceeded the accepted range more than 3 times in the last 5 seconds!"
            : "Nothing to display"}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

