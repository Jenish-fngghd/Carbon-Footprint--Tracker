import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, User, Github, Chrome } from "lucide-react";

export const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [devices, setDevices] = useState([{ id: "", name: "" }]);
  const [showDevices, setShowDevices] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      toast({
        title: "Success",
        description: "OTP sent to your email",
      });
      setShowOTP(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate OTP";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      toast({
        title: "Success",
        description: "OTP verified successfully",
      });
      setShowOTP(false);
      setShowDevices(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddDevice = () => {
    setDevices([...devices, { id: "", name: "" }]);
  };

  const handleDeviceChange = (index: number, field: string, value: string) => {
    const newDevices = [...devices];
    newDevices[index][field] = value;
    setDevices(newDevices);
  };

  const handleFinalSubmit = async () => {
    if (devices.some(device => !device.id || !device.name)) {
      toast({
        title: "Error",
        description: "Please fill all device details",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          devices,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      await signIn({ email, password });
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign up";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (showOTP) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-[#1e293b] p-8 shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-white">Verify OTP</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter the 6-digit OTP sent to your email
            </p>
          </div>
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="relative">
              <Input
                placeholder="Enter 6-digit OTP"
                className="bg-[#0f172a] border-[#334155] text-white text-center text-lg tracking-widest h-14" // Increased height
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <div className="absolute inset-x-0 top-full mt-2 flex justify-center space-x-3"> {/* Adjusted positioning */}
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      otp.length > i ? "bg-[#3b82f6]" : "bg-gray-600"
                    }`}
                  ></span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                className="bg-[#0f172a] border-[#334155] text-white"
                onClick={() => setShowOTP(false)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              >
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showDevices) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-[#1e293b] p-8 shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-white">Add Devices</h2>
            <p className="mt-2 text-sm text-gray-400">
              Add your devices to track carbon footprint
            </p>
          </div>

          <div className="space-y-6">
            {devices.map((device, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-lg font-medium text-white">
                  Device {index + 1}
                </label>
                <Input
                  placeholder="Device ID"
                  className="bg-[#0f172a] border-[#334155] text-white"
                  value={device.id}
                  onChange={(e) => handleDeviceChange(index, "id", e.target.value)}
                />
                <Input
                  placeholder="Device Name"
                  className="bg-[#0f172a] border-[#334155] text-white"
                  value={device.name}
                  onChange={(e) => handleDeviceChange(index, "name", e.target.value)}
                />
              </div>
            ))}
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setShowDevices(false)}
                variant="outline"
                className="bg-[#0f172a] border-[#334155] text-white"
              >
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddDevice}
                  variant="outline"
                  className="bg-[#0f172a] border-[#334155] text-white"
                >
                  + Add
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  className="bg-[#3b82f6] hover:bg-[#2563eb]"
                >
                  Finish Setup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[#1e293b] p-8 shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your account to start tracking
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="First Name"
                className="pl-10 bg-[#0f172a] border-[#334155] text-white"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Last Name"
                className="pl-10 bg-[#0f172a] border-[#334155] text-white"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 bg-[#0f172a] border-[#334155] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 bg-[#0f172a] border-[#334155] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          >
            Sign Up
          </Button>
          
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-[#3b82f6] hover:text-[#60a5fa]">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};