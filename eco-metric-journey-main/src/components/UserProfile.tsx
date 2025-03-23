// src/components/UserProfile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const UserProfile = () => {
  const { isSignedIn, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
      variant: "destructive",
    });
    navigate("/");
  };

  if (!isSignedIn || !user) {
    return (
      <Button 
        variant="default" 
        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        onClick={() => navigate("/login")}
      >
        Sign In
      </Button>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-transform hover:scale-110">
          <Avatar className="h-10 w-10 border border-[#334155] shadow-sm">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <AvatarFallback className="bg-[#3b82f6]/20 text-[#3b82f6] font-medium">{initials}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e293b] border-[#334155] text-white shadow-lg rounded-lg p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <p className="text-xs text-eco-light font-medium">Eco Points: {user.ecoPoints}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#334155]" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#334155] rounded-md transition-colors flex items-center"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#334155]" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-[#334155] rounded-md transition-colors flex items-center text-red-500 hover:text-red-500"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;