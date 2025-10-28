const defaultStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 172.33, change: 1.25, changePercent: 0.73 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 241.56, change: -2.15, changePercent: -0.88 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 325.44, change: 0.95, changePercent: 0.29 },
];

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, TrendingUp, TrendingDown, Activity, Loader2, StarOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StockChart } from "@/components/stock-chart";
import { PredictionPanel } from "@/components/prediction-panel";
import type { StockQuote, StockPrediction, WatchlistItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const { data: stockData, isLoading: stockLoading } = useQuery<StockQuote>({
    queryKey: ["/api/stocks/quote", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const { data: prediction, isLoading: predictionLoading } = useQuery<StockPrediction>({
    queryKey: ["/api/predict", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      return await apiRequest("POST", "/api/watchlist", { symbol });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to watchlist",
        description: "Stock added to your watchlist successfully.",
      });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      return await apiRequest("DELETE", `/api/watchlist/${symbol}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from watchlist",
        description: "Stock removed from your watchlist.",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedSymbol(searchQuery.toUpperCase().trim());
    }
  };

  const isInWatchlist = selectedSymbol && watchlist.some((item) => item.symbol === selectedSymbol);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="min-h-[400px] mb-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground text-lg">
              Track your investments and discover new opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-gain flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Gain/Loss</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+$573.25</div>
                <p className="text-xs text-gain flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +1.28% today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Watchlist Stocks</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchlist.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Stocks you're tracking</p>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-lg"
                data-testid="input-stock-search"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                data-testid="button-search"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {selectedSymbol && (
          <div className="space-y-8">
            {stockLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : stockData ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-3xl font-bold">{stockData.name}</CardTitle>
                        <Badge variant="secondary" className="font-mono tracking-wider">
                          {stockData.symbol}
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-bold">
                          ${stockData.price.toFixed(2)}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-lg font-semibold ${
                            stockData.change >= 0 ? "text-gain" : "text-loss"
                          }`}
                        >
                          {stockData.change >= 0 ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                          {stockData.change >= 0 ? "+" : ""}
                          {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        isInWatchlist
                          ? removeFromWatchlistMutation.mutate(selectedSymbol)
                          : addToWatchlistMutation.mutate(selectedSymbol)
                      }
                      variant={isInWatchlist ? "secondary" : "default"}
                      data-testid={isInWatchlist ? "button-remove-watchlist" : "button-add-watchlist"}
                    >
                      {isInWatchlist ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove from Watchlist
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Add to Watchlist
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Open</p>
                      <p className="text-lg font-semibold font-mono">${stockData.open.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">High</p>
                      <p className="text-lg font-semibold font-mono">${stockData.high.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Low</p>
                      <p className="text-lg font-semibold font-mono">${stockData.low.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="text-lg font-semibold font-mono">
                        {(stockData.volume / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Prev Close</p>
                      <p className="text-lg font-semibold font-mono">
                        ${stockData.previousClose.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {predictionLoading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ) : prediction ? (
              <PredictionPanel prediction={prediction} />
            ) : null}

            <StockChart symbol={selectedSymbol} />
          </div>
        )}

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Watchlist</h2>
            <Badge variant="secondary">{watchlist.length} stocks</Badge>
          </div>

          {watchlistLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(watchlist.length > 0 ? watchlist : defaultStocks).map((stock) => (
                <Card
                  key={stock.symbol}
                  className="cursor-pointer hover-elevate transition-all"
                  onClick={() => {
                    setSelectedSymbol(stock.symbol);
                    setSearchQuery(stock.symbol);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  data-testid={`card-watchlist-${stock.symbol}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-sm font-semibold tracking-wider">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlistMutation.mutate(stock.symbol);
                        }}
                        data-testid={`button-remove-${stock.symbol}`}
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-mono font-bold">${stock.price.toFixed(2)}</p>
                      <p
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          stock.change >= 0 ? "text-gain" : "text-loss"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
