import { Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Numeric from "../../components/custom/numeric"
import { useData } from "../data-wrapper"

/**
 * A Card component that shows the latest temperature reading from the battery 
 * @returns {JSX.Element} The temperature card.
 */
export default function LiveTempCard() : JSX.Element {
  const { temperature } = useData();
  return (
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
  );
}