
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThermometerSun, Droplets, Cloud, BarChart3, AlertCircle } from "lucide-react";
import { useAuth } from "@/utils/auth";

// Mock activity data
const activities = [
  {
    id: 1,
    type: "temperature",
    value: "24°C",
    change: "+2.5°C",
    timestamp: "2 hours ago",
    status: "warning"
  },
  {
    id: 2,
    type: "humidity",
    value: "45%",
    change: "-3%",
    timestamp: "3 hours ago",
    status: "normal"
  },
  {
    id: 3,
    type: "co2",
    value: "420 ppm",
    change: "+15 ppm",
    timestamp: "5 hours ago",
    status: "normal"
  },
  {
    id: 4,
    type: "report",
    description: "Monthly carbon report generated",
    timestamp: "Yesterday",
    status: "info"
  },
  {
    id: 5,
    type: "alert",
    description: "CO₂ levels exceeded threshold in Room 3",
    timestamp: "2 days ago",
    status: "critical"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "temperature":
      return <ThermometerSun className="h-4 w-4 text-temperature" />;
    case "humidity":
      return <Droplets className="h-4 w-4 text-humidity" />;
    case "co2":
      return <Cloud className="h-4 w-4 text-co2" />;
    case "report":
      return <BarChart3 className="h-4 w-4 text-primary" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <ThermometerSun className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "bg-green-500/20 text-green-500";
    case "warning":
      return "bg-amber-500/20 text-amber-500";
    case "critical":
      return "bg-red-500/20 text-red-500";
    case "info":
      return "bg-blue-500/20 text-blue-500";
    default:
      return "bg-gray-500/20 text-gray-500";
  }
};

export const RecentActivity = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  // Format the joined date
  const joinDate = new Date(user.joinedDate);
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create initials from user name
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-[#334155] bg-[#1e293b] text-white shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Monitoring updates from your environment</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-[#334155]">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-[#3b82f6]/20 text-[#3b82f6]">{initials}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <span className="text-xs text-gray-400 mt-1">Member since {formattedJoinDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b border-[#334155] pb-3 last:border-0">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                {activity.type === "report" || activity.type === "alert" ? (
                  <p className="text-sm">{activity.description}</p>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm capitalize">{activity.type} Reading</p>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{activity.value}</span>
                      <span className={`text-xs ${
                        activity.change.startsWith("+") ? "text-red-400" : "text-green-400"
                      }`}>
                        {activity.change}
                      </span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
