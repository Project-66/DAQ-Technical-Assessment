"use client"

import useWebSocket, { ReadyState } from "react-use-websocket"

import { createContext, useContext, useState, useEffect } from "react"

const WS_URL = "ws://localhost:8080"

interface VehicleData {
  battery_temperature: number
  timestamp: number
}

interface DataContextType {
    temperature: number
    tempData: VehicleData[]
    connectionStatus: string
    warning: boolean
}

const DataContext = createContext<DataContextType | null>(null)

export default function DataWrapper({ children }: { children: React.ReactNode }): JSX.Element {
    const [temperature, setTemperature] = useState<any>(0)
    const [tempData, setTempData] = useState<VehicleData[]>([]);
    const [ warning, setWarning ] = useState(false);
     const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
    const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
        WS_URL,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

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

    return (
        <DataContext.Provider value={{ temperature, tempData, connectionStatus, warning }}>
            {children}
        </DataContext.Provider>
    );
}


export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataWrapper");
  return context;
}