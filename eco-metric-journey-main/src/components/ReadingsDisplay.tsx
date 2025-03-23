import React, { useEffect, useState } from "react";
import { ThermometerSun, Droplets, Cloud, Award, Trophy, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/utils/auth";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAlerts, loadAlertSettings } from "@/utils/alertService";
import { AlertSettings } from "./AlertSettings";

const CO2_THRESHOLDS = {
  GOOD: 800,
  MODERATE: 1200,
};

const getAirQuality = (co2Level: number) => {
  if (co2Level < CO2_THRESHOLDS.GOOD) {
    return {
      status: "Good",
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      icon: <Info className="h-4 w-4" />,
      message: "Healthy air quality",
    };
  } else if (co2Level < CO2_THRESHOLDS.MODERATE) {
    return {
      status: "Moderate",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      icon: <AlertCircle className="h-4 w-4" />,
      message: "Consider increasing ventilation",
    };
  } else {
    return {
      status: "Poor",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      icon: <AlertCircle className="h-4 w-4" />,
      message: "Open windows or use air purification",
    };
  }
};

export const ReadingsDisplay = () => {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notifyUser } = useAlerts();
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);

  const [readings, setReadings] = useState({
    temperature: 0,
    humidity: 0,
    co2: 0,
  });

  const achievements = {
    streakDays: 5,
    totalBadges: 3,
    recentBadge: "CO₂ Reducer",
    badges: [
      { name: "CO₂ Reducer", description: "Reduced CO₂ levels by 20% in a week", icon: <Cloud className="h-5 w-5" /> },
      { name: "Ventilation Expert", description: "Maintained good air quality for 7 days", icon: <Award className="h-5 w-5" /> },
      { name: "Air Quality Champion", description: "Kept CO₂ below 600ppm for 3 days", icon: <Trophy className="h-5 w-5" /> },
    ],
  };

  const airQuality = getAirQuality(readings.co2);

  useEffect(() => {
    let timerId: number;

    const fetchReadings = async () => {
      try {
        const response = await fetch("http://192.168.3.68:8000/readings");
        const data = await response.json();
        setReadings({
          temperature: data.temperature,
          humidity: data.humidity,
          co2: data.co2,
        });

        const now = Date.now();
        if (data.co2 > CO2_THRESHOLDS.MODERATE && now - lastAlertTime > 120000) {
          notifyUser(data);
          setLastAlertTime(now);
        }
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };

    if (isSignedIn) {
      fetchReadings();
      timerId = window.setInterval(fetchReadings, 3000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isSignedIn, lastAlertTime, notifyUser]);

  const handleRedirectToLogin = () => {
    navigate("/login");
    toast({
      title: "Authentication Required",
      description: "Please sign in to view real-time readings.",
    });
  };

  if (!isSignedIn) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-medium text-white mb-4">Sign in to view readings</h3>
        <p className="text-gray-400 mb-6">You need to sign in to see real-time environmental readings.</p>
        <Button
          onClick={handleRedirectToLogin}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col items-center p-4 gap-3">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-trees-in-the-wind-1164-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-eco-dark/80 to-eco/90 backdrop-blur-sm"></div>
      </div>

      <div className="w-full flex justify-end items-center gap-2 mb-2">
        {/* Compact Air Quality Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/40 backdrop-blur-md border border-${airQuality.color.replace('text-', '')}/40 shadow-md hover:shadow-lg transition-shadow duration-300`}
                aria-label={`Air quality status: ${airQuality.status}`}
              >
                <span className="text-sm font-medium text-gray-300">Air:</span>
                <span className={`${airQuality.color} text-sm font-semibold`}>{airQuality.status}</span>
                {airQuality.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-700">
              <p>{airQuality.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Alert Settings Button */}
        <AlertSettings />
      </div>

      <div className="w-full grid grid-cols-3 gap-3 mb-3">
        {/* Temperature Card */}
        <div
          className="relative flex flex-col items-center justify-between h-28 p-4 rounded-xl bg-gray-900/40 backdrop-blur-md border border-temperature/40 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 group"
          role="region"
          aria-label="Temperature reading"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-temperature/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <p className="text-xs font-medium text-gray-300 tracking-wide">Temperature</p>
          <p className="text-3xl font-bold text-white drop-shadow-md">{readings.temperature.toFixed(1)}°C</p>
          <div className="p-2 bg-temperature/30 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <ThermometerSun className="h-5 w-5 text-temperature" />
          </div>
        </div>

        {/* Humidity Card */}
        <div
          className="relative flex flex-col items-center justify-between h-28 p-4 rounded-xl bg-gray-900/40 backdrop-blur-md border border-humidity/40 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 group"
          role="region"
          aria-label="Humidity reading"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-humidity/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <p className="text-xs font-medium text-gray-300 tracking-wide">Humidity</p>
          <p className="text-3xl font-bold text-white drop-shadow-md">{Math.round(readings.humidity)}%</p>
          <div className="p-2 bg-humidity/30 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Droplets className="h-5 w-5 text-humidity" />
          </div>
        </div>

        {/* CO₂ Level Card */}
        <div
          className="relative flex flex-col items-center justify-between h-28 p-4 rounded-xl bg-gray-900/40 backdrop-blur-md border border-co2/40 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 group"
          role="region"
          aria-label="CO2 level reading"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-co2/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <p className="text-xs font-medium text-gray-300 tracking-wide">CO₂ Level</p>
          <p className="text-3xl font-bold text-white drop-shadow-md">{Math.round(readings.co2)} ppm</p>
          <div className="p-2 bg-co2/30 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Cloud className="h-5 w-5 text-co2" />
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-white flex items-center">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
              Your Achievements
            </span>
          </h3>
          <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30 shadow-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              {achievements.streakDays} day streak
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {achievements.badges.map((badge, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center justify-center bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/70 transition-all duration-300 cursor-help border border-gray-600/40 shadow-sm hover:shadow-md"
                    role="button"
                    aria-label={badge.name}
                  >
                    <div className="bg-primary/30 p-2 rounded-full mb-1.5">
                      {React.cloneElement(badge.icon, { className: 'h-4 w-4 text-primary' })}
                    </div>
                    <span className="text-center text-white text-xs font-medium truncate w-full">
                      {badge.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[180px] bg-gray-800 text-white border-gray-700">
                  <p className="text-xs">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};