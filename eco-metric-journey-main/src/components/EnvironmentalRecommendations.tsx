import React, { useState, useEffect } from "react";
import { Lightbulb, ThumbsUp, TrendingDown, TrendingUp, ThermometerSun, Droplets, Cloud, Award, Gift, Share2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "eco-tip";
  icon: React.ReactNode;
  actionLabel?: string;
  points?: number;
  metric?: {
    name: string;
    value: string;
    trend: "up" | "down" | "neutral";
    isGood: boolean;
  };
}

interface EnvironmentalRecommendationsProps {
  co2Level: number;
  temperature: number;
  humidity: number;
}

export const EnvironmentalRecommendations: React.FC<EnvironmentalRecommendationsProps> = ({ co2Level, temperature, humidity }) => {
  const { toast } = useToast();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [totalPoints, setTotalPoints] = useState(75);

  useEffect(() => {
    const dynamicRecommendations: Recommendation[] = [
      // CO2 Recommendation
      {
        id: "rec-1",
        title: co2Level > 800 ? "CO₂ levels too high!" : co2Level > 600 ? "CO₂ levels rising!" : "CO₂ levels optimal",
        description: co2Level > 800 
          ? "Open windows or use air purification to lower CO₂ levels." 
          : co2Level > 600 
          ? "Try opening a window for better ventilation." 
          : "CO₂ levels are in a healthy range, keep it up!",
        type: co2Level > 800 ? "warning" : co2Level > 600 ? "warning" : "success",
        icon: <Cloud className="h-6 w-6" />,
        actionLabel: co2Level > 600 ? "Learn more" : undefined,
        metric: {
          name: "CO₂",
          value: `${Math.round(co2Level)} ppm`,
          trend: "neutral",
          isGood: co2Level <= 600
        }
      },
      // Temperature Recommendation
      {
        id: "rec-2",
        title: temperature > 26 ? "Temperature too high!" : temperature < 22 ? "Temperature too low!" : "Optimal temperature",
        description: temperature > 26 
          ? "Consider lowering the AC or increasing ventilation." 
          : temperature < 22 
          ? "Raise the temperature for energy efficiency and comfort." 
          : "Temperature is in an ideal range for efficiency and comfort.",
        type: temperature > 26 || temperature < 22 ? "warning" : "success",
        icon: <ThermometerSun className="h-6 w-6" />,
        actionLabel: temperature > 26 || temperature < 22 ? "Adjust settings" : undefined,
        metric: {
          name: "Temperature",
          value: `${temperature.toFixed(1)}°C`,
          trend: "neutral",
          isGood: temperature >= 22 && temperature <= 26
        }
      },
      // Humidity Recommendation
      {
        id: "rec-3",
        title: humidity > 60 ? "Humidity too high!" : humidity < 40 ? "Humidity too low!" : "Optimal humidity",
        description: humidity > 60 
          ? "Use a dehumidifier to reduce moisture levels." 
          : humidity < 40 
          ? "Consider a humidifier to prevent dry air issues." 
          : "Humidity is in a comfortable range.",
        type: humidity > 60 || humidity < 40 ? "warning" : "success",
        icon: <Droplets className="h-6 w-6" />,
        actionLabel: humidity > 60 || humidity < 40 ? "Get tips" : undefined,
        metric: {
          name: "Humidity",
          value: `${Math.round(humidity)}%`,
          trend: "neutral",
          isGood: humidity >= 40 && humidity <= 60
        }
      },
      // Static Eco-Tip
      {
        id: "rec-4",
        title: "Weekly Challenge: Reduce CO₂ by 20%",
        description: "Join our community challenge to reduce your carbon footprint. 3 days remaining!",
        type: "eco-tip",
        icon: <Award className="h-6 w-6" />,
        points: 100,
        actionLabel: "Join Challenge"
      },
      {
        id: "rec-5",
        title: "Eco-Tip: Smart Ventilation",
        description: "Using timed ventilation can improve air quality while maintaining energy efficiency.",
        type: "eco-tip",
        icon: <Lightbulb className="h-6 w-6" />,
        points: 15,
        actionLabel: "Try it now"
      }
    ];

    setRecommendations(dynamicRecommendations);
  }, [co2Level, temperature, humidity]);

  const handleRecommendationClick = (recommendation: Recommendation) => {
    toast({
      title: recommendation.title,
      description: recommendation.description,
    });
  };

  const handleActionClick = (rec: Recommendation, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (rec.points) {
      setTotalPoints((prev) => prev + rec.points!);
      toast({
        title: `Earned ${rec.points} Eco-Points!`,
        description: `You now have ${totalPoints + rec.points} total Eco-Points.`,
      });
      setRecommendations((prev) => prev.filter((item) => item.id !== rec.id));
    } else {
      toast({
        title: "Action taken!",
        description: `You've chosen to ${rec.actionLabel?.toLowerCase() || "take action"} on this recommendation.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-5 w-5" />
          Smart Recommendations
        </CardTitle>
        {totalPoints > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleRecommendationClick(rec)}
              className={`flex items-start p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                rec.type === "warning" 
                  ? "bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500" 
                  : rec.type === "success"
                  ? "bg-green-50/50 dark:bg-green-950/20 border-l-4 border-green-500"
                  : rec.type === "eco-tip"
                  ? "bg-purple-50/50 dark:bg-purple-950/20 border-l-4 border-purple-500"
                  : "bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-500"
              }`}
            >
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center mr-4
                ${rec.type === "warning" 
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                  : rec.type === "success" 
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : rec.type === "eco-tip"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }
              `}>
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className={`text-sm font-medium ${
                    rec.type === "warning" 
                      ? "text-amber-800 dark:text-amber-300" 
                      : rec.type === "success"
                      ? "text-green-800 dark:text-green-300"
                      : rec.type === "eco-tip"
                      ? "text-purple-800 dark:text-purple-300"
                      : "text-blue-800 dark:text-blue-300"
                  }`}>
                    {rec.title}
                  </h4>
                  {rec.points && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      +{rec.points} points
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {rec.description}
                </p>
                {rec.metric && (
                  <div className="flex items-center mt-2 text-xs font-medium">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">{rec.metric.name}:</span>
                    <span className="mr-1">{rec.metric.value}</span>
                    {rec.metric.trend === "up" && (
                      <TrendingUp className={`h-3 w-3 ${rec.metric.isGood ? "text-green-500" : "text-red-500"}`} />
                    )}
                    {rec.metric.trend === "down" && (
                      <TrendingDown className={`h-3 w-3 ${rec.metric.isGood ? "text-green-500" : "text-red-500"}`} />
                    )}
                  </div>
                )}
                {rec.actionLabel && (
                  <div className="mt-3 flex justify-between items-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`text-xs ${
                        rec.type === "warning" 
                          ? "border-amber-500 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20" 
                          : rec.type === "success"
                          ? "border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                          : rec.type === "eco-tip"
                          ? "border-purple-500 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                          : "border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      }`}
                      onClick={(e) => handleActionClick(rec, e)}
                    >
                      {rec.actionLabel}
                    </Button>
                    {rec.type === "eco-tip" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share this tip</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
          Get More Tips
        </Button>
        <Button size="sm" className="text-xs">
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};