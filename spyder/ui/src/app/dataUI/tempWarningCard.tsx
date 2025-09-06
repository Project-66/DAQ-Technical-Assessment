import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useData } from "../data-wrapper"

/**
 * A Card component that shows any temperature warnings that may appear (as per Task 2)
 * @returns {JSX.Element} The warning card.
 */
export default function TempWarningCard(): JSX.Element {
  const { warning } = useData();
    return (
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
    );
}