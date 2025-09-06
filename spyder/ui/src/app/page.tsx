"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon } from "lucide-react"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { useData } from "./data-wrapper"
import LiveTempCard from "./dataUI/liveTempCard"
import TempChartCard from "./dataUI/tempChartCard"
import TempWarningCard from "./dataUI/tempWarningCard"


/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 * Could this be split into more components?... (yes it can)
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { connectionStatus } = useData();

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
        <LiveTempCard />
        <TempChartCard />
        <TempWarningCard />
      </main>
    </div>
  )
}

