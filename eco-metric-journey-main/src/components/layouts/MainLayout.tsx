// src/components/layouts/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ThermometerSun, Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/components/UserProfile";

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Community", path: "/community" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Eco Products", path: "/products" }, // Add Eco Products here
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGetStarted = () => {
    if (!isSignedIn) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-gray-100">
      <nav className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="p-1 bg-[#3b82f6]/20 rounded-full transition-transform hover:scale-110">
                    <ThermometerSun className="h-6 w-6 text-[#3b82f6]" />
                  </div>
                  <span className="text-lg font-semibold text-white">Carbon Tracker</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-2 py-1 text-sm font-medium transition-all ${
                      location.pathname === item.path
                        ? "border-b-2 border-[#3b82f6] text-[#3b82f6]"
                        : "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-400"
                    } ${item.name === "Eco Products" ? "flex items-center gap-1" : ""}`}
                  >
                    {item.name === "Eco Products" && <Leaf className="h-4 w-4 text-eco-light" />}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <UserProfile />
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#334155] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3b82f6]"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#334155] border-[#3b82f6] text-[#3b82f6]"
                    : "border-transparent text-gray-300 hover:bg-[#334155] hover:border-gray-400 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name === "Eco Products" ? (
                  <span className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-eco-light" /> {item.name}
                  </span>
                ) : (
                  item.name
                )}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-[#334155]">
              <Button 
                variant="default" 
                className="ml-3 w-[calc(100%-1.5rem)] bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                onClick={() => {
                  handleGetStarted();
                  setIsMenuOpen(false);
                }}
              >
                {isSignedIn ? "Dashboard" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-[#0f172a]">
        <Outlet />
      </main>

      <footer className="bg-[#1e293b] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:flex md:items-center md:justify-between md:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-400">
              &copy; 2023 Carbon Footprint Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;