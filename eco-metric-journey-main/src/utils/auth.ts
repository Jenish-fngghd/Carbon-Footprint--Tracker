import { create } from "zustand";

export interface Device {
  id: string;
  name: string;
}

export interface Coupon {
  code: string;
  productName: string;
  discount: number;
  expirationDate: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedDate: string;
  avatar?: string;
  devices: Device[];
  ecoPoints: number;
  coupons: Coupon[];
}

interface AuthState {
  isSignedIn: boolean;
  user: User | null;
  signIn: (credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  updateEcoPoints: (points: number) => Promise<void>;
  addCoupon: (coupon: Coupon) => Promise<void>;
  updateDevices: (devices: Device[]) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isSignedIn: false,
  user: null,
  signIn: async (credentials) => {
    if (credentials) {
      const { email, password } = credentials;
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      set({ isSignedIn: true, user: data });
    }
  },
  signOut: () => set({ isSignedIn: false, user: null }),
  updateEcoPoints: async (points: number) => {
    const state = useAuth.getState();
    if (!state.user) return;

    const updatedUser = {
      ...state.user,
      ecoPoints: state.user.ecoPoints + points,
    };

    const response = await fetch(`http://localhost:5000/api/users/${state.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ecoPoints: updatedUser.ecoPoints }),
    });

    const data = await response.json();
    if (response.ok) {
      set({ user: data });
    }
  },
  addCoupon: async (coupon: Coupon) => {
    const state = useAuth.getState();
    if (!state.user) return;

    const updatedCoupons = [...state.user.coupons, coupon];
    const response = await fetch(`http://localhost:5000/api/users/${state.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupons: updatedCoupons }),
    });

    const data = await response.json();
    if (response.ok) {
      set({ user: data });
    }
  },
  updateDevices: async (devices: Device[]) => {
    const state = useAuth.getState();
    if (!state.user) return;

    const response = await fetch(`http://localhost:5000/api/users/${state.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devices }),
    });

    const data = await response.json();
    if (response.ok) {
      set({ user: data });
    }
  },
}));