import React from "react";
import { ArrowRight, BarChart3, Cloud, Leaf, LineChart, ThermometerSun, Droplets, Activity, Users, MessageSquare, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { ReadingsDisplay } from "@/components/ReadingsDisplay";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const Index = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  Chart.register(ChartDataLabels);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-eco-light dark:bg-eco-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-eco-light/90 to-eco-light/70 dark:from-eco-dark/90 dark:to-eco-dark/70" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-6 sm:py-32 md:flex md:items-center md:justify-between md:px-8">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-4xl font-bold tracking-tight text-eco-dark dark:text-white sm:text-5xl md:text-6xl animate-fade-in">
              <span className="block">Carbon Footprint</span>
              <span className="block text-primary">Tracker</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-md animate-slide-up">
              Monitor, analyze, and reduce your environmental impact with real-time tracking of temperature, humidity, and CO₂ levels.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {!isSignedIn && (
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={handleGetStarted}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2 lg:w-3/5 animate-scale-in">
            <div className="relative mx-auto w-full h-80 md:h-96 lg:h-[400px] rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-temperature/30 via-humidity/30 to-co2/30 backdrop-blur-sm rounded-xl" />
              <ReadingsDisplay />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl animate-fade-in">
              Powerful Environmental Monitoring
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Get comprehensive insights into your environmental impact with our cutting-edge tracking tools.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="h-12 w-12 bg-temperature/10 rounded-full flex items-center justify-center mb-4">
                <ThermometerSun className="h-6 w-6 text-temperature" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Temperature Tracking</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Monitor temperature fluctuations with precision and understand their impact on energy consumption.
              </p>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="h-12 w-12 bg-humidity/10 rounded-full flex items-center justify-center mb-4">
                <Droplets className="h-6 w-6 text-humidity" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Humidity Monitoring</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Track humidity levels to ensure optimal comfort and reduce energy usage in climate control systems.
              </p>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="h-12 w-12 bg-co2/10 rounded-full flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-co2" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">CO₂ Level Analysis</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Measure CO₂ concentration to assess air quality and reduce your carbon footprint.
              </p>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="h-12 w-12 bg-eco/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-eco" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Data Visualization</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Intuitive charts and graphs provide clear insights into your environmental metrics.
              </p>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="h-12 w-12 bg-eco/10 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-eco" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Trend Analysis</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Track changes over time to identify patterns and make informed decisions to reduce your impact.
              </p>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="h-12 w-12 bg-eco/10 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-eco" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Eco-friendly Recommendations</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Receive personalized suggestions to improve your carbon footprint based on your data.
              </p>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link to="/features">
                View All Features <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-900 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl animate-fade-in">
              Join Our Eco-Conscious Community
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Connect with others, share experiences, and collaborate to create a more sustainable future.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="p-6 dark:bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg transition-shadow animate-fade-in flex flex-col items-center text-center" style={{ animationDelay: "0.2s" }}>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-white">Join Discussions</h3>
              <p className="mt-2 text-gray-300 flex-1">
                Connect with like-minded individuals and share your sustainability journey.
              </p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/community">
                  View Discussions
                </Link>
              </Button>
            </Card>

            <Card className="p-6 dark:bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg transition-shadow animate-fade-in flex flex-col items-center text-center" style={{ animationDelay: "0.3s" }}>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-white">Participate in Challenges</h3>
              <p className="mt-2 text-gray-300 flex-1">
                Join community challenges designed to reduce carbon footprints and create sustainable habits.
              </p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/community">
                  View Challenges
                </Link>
              </Button>
            </Card>

            <Card className="p-6 dark:bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg transition-shadow animate-fade-in flex flex-col items-center text-center" style={{ animationDelay: "0.4s" }}>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-white">Track Your Progress</h3>
              <p className="mt-2 text-gray-300 flex-1">
                Earn points, badges, and recognition for your contributions to sustainability efforts.
              </p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/community">
                  View Leaderboard
                </Link>
              </Button>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white animate-scale-in" asChild>
              <Link to="/community">
                Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 lg:pr-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl animate-fade-in">
                Comprehensive Dashboard
              </h2>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Monitor all your environmental metrics in one place with our intuitive dashboard.
              </p>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="ml-3 text-base text-gray-600 dark:text-gray-300">
                    Real-time data updates
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="ml-3 text-base text-gray-600 dark:text-gray-300">
                    Historical data comparison
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="ml-3 text-base text-gray-600 dark:text-gray-300">
                    Customizable alerts and notifications
                  </p>
                </li>
              </ul>
              
              <div className="mt-8">
                <Button variant="default" size="lg" asChild>
                  <Link to="/dashboard">
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 lg:w-1/2 animate-scale-in">
              <div className="relative mx-auto lg:ml-auto w-full aspect-video bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-eco-light/30 to-eco/20 backdrop-blur-sm" />
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold">Environmental Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <ThermometerSun className="h-4 w-4 text-temperature mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Temperature</span>
                      </div>
                      <p className="text-lg font-semibold text-temperature">24°C</p>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <Droplets className="h-4 w-4 text-humidity mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Humidity</span>
                      </div>
                      <p className="text-lg font-semibold text-humidity">45%</p>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <Cloud className="h-4 w-4 text-co2 mr-2" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">CO₂</span>
                      </div>
                      <p className="text-lg font-semibold text-co2">420 ppm</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 shadow-sm">
                    <div className="h-full flex flex-col justify-center items-center">
                      <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      <p className="text-sm text-gray-500 mt-2">Weekly Carbon Emissions Overview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 dark:bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl animate-fade-in">
            Start Reducing Your Carbon Footprint Today
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Join thousands of environmentally conscious individuals and organizations making a difference.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white animate-scale-in" asChild>
              <Link to="/contact">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
