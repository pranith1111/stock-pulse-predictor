import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { ReviewWithUser, InsertReview } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertReview>({
    stockSymbol: "",
    rating: 0,
    comment: "",
  });

  const { data: reviews = [], isLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: InsertReview) => {
      return await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setFormData({ stockSymbol: "", rating: 0, comment: "" });
      toast({
        title: "Review submitted",
        description: "Your review has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must select at least one star.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate(formData);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Prediction Reviews</h1>
          <p className="text-muted-foreground text-lg">
            Share your experience with our predictions and help the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockSymbol">Stock Symbol</Label>
                    <Input
                      id="stockSymbol"
                      placeholder="e.g., AAPL"
                      value={formData.stockSymbol}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockSymbol: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      data-testid="input-review-symbol"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-all hover:scale-110"
                          data-testid={`button-rating-${star}`}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= formData.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with the prediction..."
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      required
                      minLength={10}
                      className="min-h-32 resize-none"
                      data-testid="input-review-comment"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.comment.length} characters (minimum 10)
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createReviewMutation.isPending}
                    data-testid="button-submit-review"
                  >
                    {createReviewMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">All Reviews</h2>
              <Badge variant="secondary">{reviews.length} reviews</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="shadow-sm" data-testid={`card-review-${review.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(review.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{review.userName}</p>
                              <Badge variant="secondary" className="font-mono">
                                {review.stockSymbol}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
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
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(review.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.userId === user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReviewMutation.mutate(review.id)}
                            disabled={deleteReviewMutation.isPending}
                            data-testid={`button-delete-review-${review.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your experience with our predictions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
