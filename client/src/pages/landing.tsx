import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Star, Shield, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold">StockPulse Predictor</h1>
          </div>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Make smarter investment decisions with AI-powered stock predictions and real-time market insights
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="button-landing-signup">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                data-testid="button-landing-login"
              >
                Login
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Join 10,000+ investors making data-driven decisions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Predictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get accurate BUY, SELL, or HOLD recommendations based on advanced machine learning algorithms analyzing market trends.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access live stock prices, historical charts, and key metrics to make informed investment decisions instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Personalized Watchlist</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your favorite stocks, monitor performance, and receive insights on the companies that matter to you.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Start Your Investment Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust StockPulse Predictor for data-driven insights. Our AI analyzes market patterns to help you make confident investment decisions.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
