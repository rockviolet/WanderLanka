"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [clientForm, setClientForm] = useState({
    email: "",
    password: "",
  });
  const [guideForm, setGuideForm] = useState({
    email: "",
    password: "",
  });

  // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!emailRegex.test(clientForm.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(clientForm.password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/client-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientForm),
      });

      const data = await response.json();
      console.log(data);
      localStorage.setItem("userId", data.id);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("userType", "client");
      router.push("/");

      toast.success("Welcome back");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGuideLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!emailRegex.test(guideForm.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(guideForm.password)) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/tour-guide-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guideForm),
      });

      const data = await response.json();
      localStorage.setItem("userId", data.id);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and redirect

      localStorage.setItem("userType", "tour_guide");
      toast.success("Welcome back");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/30">
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Welcome to WanderLanka
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/20">
              <TabsTrigger
                value="client"
                className="text-white data-[state=active]:text-black"
              >
                Client Login
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="text-white data-[state=active]:text-black"
              >
                Tour Guide Login
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <TabsContent value="client" className="mt-6">
              <form onSubmit={handleClientLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="client@example.com"
                      value={clientForm.email}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, email: e.target.value })
                      }
                      className="bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="••••••••"
                      value={clientForm.password}
                      onChange={(e) =>
                        setClientForm({
                          ...clientForm,
                          password: e.target.value,
                        })
                      }
                      className="bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-indigo-600 hover:bg-white/90"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Client Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="guide" className="mt-6">
              <form onSubmit={handleGuideLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guide-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="guide-email"
                      type="email"
                      placeholder="guide@example.com"
                      value={guideForm.email}
                      onChange={(e) =>
                        setGuideForm({ ...guideForm, email: e.target.value })
                      }
                      className="bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guide-password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="guide-password"
                      type="password"
                      placeholder="••••••••"
                      value={guideForm.password}
                      onChange={(e) =>
                        setGuideForm({ ...guideForm, password: e.target.value })
                      }
                      className="bg-white/20 text-white border-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-indigo-600 hover:bg-white/90"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Tour Guide Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              {`Don't have an account?`}
              <Link
                href="/register"
                className="text-white font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
