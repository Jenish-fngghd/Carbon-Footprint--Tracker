
import React from "react";
import { Card } from "@/components/ui/card";
import { ThermometerSun, Droplets, Cloud, BarChart3, LineChart, Leaf, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      icon: ThermometerSun,
      iconColor: "text-temperature",
      bgColor: "bg-temperature/10",
      title: "Temperature Tracking",
      description: "Monitor temperature fluctuations with precision and understand their impact on energy consumption. Get alerts when temperatures rise above or fall below custom thresholds."
    },
    {
      icon: Droplets,
      iconColor: "text-humidity",
      bgColor: "bg-humidity/10",
      title: "Humidity Monitoring",
      description: "Track humidity levels to ensure optimal comfort and reduce energy usage in climate control systems. Maintain the perfect balance for health and comfort."
    },
    {
      icon: Cloud,
      iconColor: "text-co2",
      bgColor: "bg-co2/10",
      title: "CO₂ Level Analysis",
      description: "Measure CO₂ concentration to assess air quality and reduce your carbon footprint. Identify peak emission periods and implement targeted reduction strategies."
    },
    {
      icon: BarChart3,
      iconColor: "text-eco",
      bgColor: "bg-eco/10",
      title: "Data Visualization",
      description: "Intuitive charts and graphs provide clear insights into your environmental metrics. Visualize trends, patterns, and correlations to make better decisions."
    },
    {
      icon: LineChart,
      iconColor: "text-eco",
      bgColor: "bg-eco/10",
      title: "Trend Analysis",
      description: "Track changes over time to identify patterns and make informed decisions to reduce your impact. Understand seasonal variations and long-term environmental changes."
    },
    {
      icon: Leaf,
      iconColor: "text-eco",
      bgColor: "bg-eco/10",
      title: "Eco-friendly Recommendations",
      description: "Receive personalized suggestions to improve your carbon footprint based on your data. Get actionable insights that make a real difference to your environmental impact."
    },
    {
      icon: Activity,
      iconColor: "text-eco",
      bgColor: "bg-eco/10",
      title: "Real-time Monitoring",
      description: "Live updates on all your key environmental metrics. Never miss an important change with instant notifications and alerts."
    },
    {
      icon: Activity,
      iconColor: "text-eco",
      bgColor: "bg-eco/10",
      title: "Custom Reporting",
      description: "Generate detailed reports on your environmental impact over custom time periods. Share your progress with stakeholders or use them for compliance purposes."
    }
  ];

  return (
    <div className="bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="block">Powerful Features for</span>
              <span className="block text-eco">Environmental Impact Tracking</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
              Our comprehensive suite of tools empowers you to monitor, analyze, and reduce your carbon footprint effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 sm:py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="p-5 sm:p-6 border border-gray-800 bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white mb-2">{feature.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:py-12 lg:py-16 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            <span className="block">Ready to start tracking?</span>
            <span className="block text-eco">Get started today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button size="lg" className="w-full sm:w-auto bg-eco hover:bg-eco/80 text-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
