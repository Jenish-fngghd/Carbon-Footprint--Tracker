
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import MainLayout from "./components/layouts/MainLayout";
import MainLayoutEnhancer from "./components/layouts/MainLayoutEnhancer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="features" element={<Features />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="community" element={<Community />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <MainLayoutEnhancer />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
