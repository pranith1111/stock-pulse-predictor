import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LoginUser } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginUser>({
    email: "",
    password: "",
  });
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (shouldNavigate && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [shouldNavigate, isAuthenticated, setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      return await apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setShouldNavigate(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary to-primary/60">
        <div className="max-w-md space-y-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-12 w-12" />
            <h1 className="text-4xl font-bold">StockPulse Predictor</h1>
          </div>
          <h2 className="text-3xl font-bold">
            Make smarter investment decisions with AI
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Get real-time stock predictions, track your watchlist, and join thousands of investors making data-driven decisions.
          </p>
          <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-lg backdrop-blur-sm w-fit">
            <span className="text-sm font-medium">Join 10,000+ investors</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">StockPulse</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-primary hover:underline font-medium"
                data-testid="link-signup-from-login"
              >
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
