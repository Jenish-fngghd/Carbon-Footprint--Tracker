import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThermometerSun, Droplets, Cloud, LineChart, ArrowUpRight, ArrowDownRight, Clock, AlertCircle, FileText, Gift } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EnvironmentalRecommendations } from "@/components/EnvironmentalRecommendations";
import { useToast } from "@/hooks/use-toast";
import { TemperatureTrendChart } from "@/components/TemperatureTrendChart";
import { CO2EmissionsChart } from "@/components/CO2EmissionsChart";
import { useAuth } from "@/utils/auth";

const activities = [
  {
    id: 1,
    type: "temperature",
    description: "Temperature sensor updated",
    details: "Recorded 23.5°C at Office Zone A",
    icon: <ThermometerSun className="h-4 w-4 text-temperature" />,
    timestamp: "2 hours ago",
    user: { name: "Alex Morgan", initials: "AM" }
  },
  // ... other activities
];

const Dashboard = () => {
  const { toast } = useToast();
  const { user, updateEcoPoints, isSignedIn } = useAuth(); // Use Zustand's useAuth

  const [readings, setReadings] = React.useState({ temperature: 0, humidity: 0, co2: 0 });
  const [prevReadings, setPrevReadings] = React.useState({ temperature: 0, humidity: 0, co2: 0 });
  const [trendData, setTrendData] = React.useState<{ temperature: number[]; co2: number[] }>({
    temperature: [],
    co2: [],
  });
  const [lastAwardTime, setLastAwardTime] = React.useState(Date.now());
  const [prevEcoPoints, setPrevEcoPoints] = React.useState(user?.ecoPoints || 500);

  const POINT_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds
  const POINT_INCREMENT = 1; // 1 point per interval

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("http://192.168.3.68:8000/readings");
        const data = await response.json();
        setPrevReadings(readings);
        setReadings({ temperature: data.temperature, humidity: data.humidity, co2: data.co2 });
        setTrendData((prev) => ({
          temperature: [...prev.temperature.slice(-9), data.temperature],
          co2: [...prev.co2.slice(-9), data.co2],
        }));

        // Eco-Points logic: Award 1 point every 2 minutes if conditions are ideal
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastAwardTime;

        if (elapsedTime >= POINT_INTERVAL && isSignedIn && user) {
          const isCo2Good = data.co2 <= 600;
          const isTempGood = data.temperature >= 22 && data.temperature <= 26;
          const isHumidityGood = data.humidity >= 40 && data.humidity <= 60;

          if (isCo2Good && isTempGood && isHumidityGood) {
            setPrevEcoPoints(user.ecoPoints); // Store previous value for percentage change
            updateEcoPoints(POINT_INCREMENT); // Update global ecoPoints
            setLastAwardTime(currentTime);
            toast({
              title: `Earned ${POINT_INCREMENT} Eco-Point!`,
              description: "For maintaining ideal environmental conditions for 2 minutes.",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
        toast({ title: "Error", description: "Failed to fetch sensor data.", variant: "destructive" });
      }
    };

    fetchReadings();
    const intervalId = setInterval(fetchReadings, 3000); // Fetch every 3 seconds
    return () => clearInterval(intervalId);
  }, [toast, readings, lastAwardTime, user, updateEcoPoints, isSignedIn, POINT_INTERVAL]);

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const tempChange = calculateChange(readings.temperature, prevReadings.temperature);
  const humidityChange = calculateChange(readings.humidity, prevReadings.humidity);
  const co2Change = calculateChange(readings.co2, prevReadings.co2);
  const ecoPointsChange = calculateChange(user?.ecoPoints || 500, prevEcoPoints);
  const carbonScore = Math.max(0, Math.round(100 - (readings.co2 / 10))); // Adjusted for real-time CO2, min 0

  if (!isSignedIn || !user) {
    return <div className="text-white text-center py-10">Please sign in to view the dashboard</div>;
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Monitor and analyze your environmental impact in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full">
                <div className="flex items-baseline mb-2">
                  <p className="text-2xl font-semibold text-temperature">{readings.temperature.toFixed(1)}°C</p>
                  <div className={`ml-2 flex items-center ${tempChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {tempChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span className="text-xs">{tempChange.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">vs. last reading</div>
                  <div className="p-2 bg-temperature/10 rounded-full">
                    <ThermometerSun className="h-5 w-5 text-temperature" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full">
                <div className="flex items-baseline mb-2">
                  <p className="text-2xl font-semibold text-humidity">{Math.round(readings.humidity)}%</p>
                  <div className={`ml-2 flex items-center ${humidityChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {humidityChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span className="text-xs">{humidityChange.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">vs. last reading</div>
                  <div className="p-2 bg-humidity/10 rounded-full">
                    <Droplets className="h-5 w-5 text-humidity" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                CO₂ Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full">
                <div className="flex items-baseline mb-2">
                  <p className="text-2xl font-semibold text-co2">{Math.round(readings.co2)} ppm</p>
                  <div className={`ml-2 flex items-center ${co2Change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {co2Change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span className="text-xs">{co2Change.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">vs. last reading</div>
                  <div className="p-2 bg-co2/10 rounded-full">
                    <Cloud className="h-5 w-5 text-co2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Carbon Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full">
                <div className="flex items-baseline mb-2">
                  <p className="text-2xl font-semibold text-eco">{carbonScore}/100</p>
                  <div className={`ml-2 flex items-center ${co2Change <= 0 ? "text-green-500" : "text-red-500"}`}>
                    {co2Change <= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span className="text-xs">{Math.abs(co2Change).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">vs. last reading</div>
                  <div className="p-2 bg-eco/10 rounded-full">
                    <LineChart className="h-5 w-5 text-eco" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Eco-Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full">
                <div className="flex items-baseline mb-2">
                  <p className="text-2xl font-semibold text-purple-500">{user.ecoPoints}</p>
                  <div className={`ml-2 flex items-center ${ecoPointsChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-xs">{ecoPointsChange.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">this session</div>
                  <div className="p-2 bg-purple-500/10 rounded-full">
                    <Gift className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 gap-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>CO₂ Emissions Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <CO2EmissionsChart data={trendData.co2} />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Temperature Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <TemperatureTrendChart data={trendData.temperature} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <EnvironmentalRecommendations 
              co2Level={readings.co2} 
              temperature={readings.temperature} 
              humidity={readings.humidity} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;