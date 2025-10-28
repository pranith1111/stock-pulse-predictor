import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, TrendingDown, MessageSquare, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";
import type { WatchlistItem, ReviewWithUser } from "@shared/schema";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: watchlist = [] } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const { data: reviews = [] } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews"],
  });

  const userReviews = reviews.filter((r) => r.userId === user?.id);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Account Statistics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Watchlist Items</span>
                      </div>
                      <Badge variant="secondary">{watchlist.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Reviews</span>
                      </div>
                      <Badge variant="secondary">{userReviews.length}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => {
                      logout();
                      setLocation("/login");
                    }}
                    data-testid="button-logout-profile"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="watchlist" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="watchlist" data-testid="tab-watchlist">
                  Watchlist
                </TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">
                  Review History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="watchlist" className="space-y-4">
                {watchlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {watchlist.map((stock) => (
                      <Card
                        key={stock.symbol}
                        className="cursor-pointer hover-elevate transition-all"
                        onClick={() => {
                          setLocation("/dashboard");
                          setTimeout(() => {
                            const searchInput = document.querySelector(
                              '[data-testid="input-stock-search"]'
                            ) as HTMLInputElement;
                            if (searchInput) {
                              searchInput.value = stock.symbol;
                              searchInput.form?.requestSubmit();
                            }
                          }, 100);
                        }}
                        data-testid={`profile-watchlist-${stock.symbol}`}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div>
                              <p className="font-mono text-sm font-semibold tracking-wider">
                                {stock.symbol}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {stock.name}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-2xl font-mono font-bold">
                                ${stock.price.toFixed(2)}
                              </p>
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No stocks in your watchlist
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add stocks to your watchlist from the dashboard
                      </p>
                      <Button onClick={() => setLocation("/dashboard")}>
                        Go to Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.map((review) => (
                      <Card key={review.id} data-testid={`profile-review-${review.id}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono">
                                {review.stockSymbol}
                              </Badge>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Share your experience with our predictions
                      </p>
                      <Button onClick={() => setLocation("/reviews")}>
                        Write a Review
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
