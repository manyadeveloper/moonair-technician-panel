"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceRequest } from "@/types/service";
import { Star } from "lucide-react";

interface CustomerFeedbackProps {
  request: ServiceRequest;
}

export function CustomerFeedback({ request }: CustomerFeedbackProps) {
  if (!request.customer_rating && !request.customer_comment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Customer feedback will appear here after service completion.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Feedback</CardTitle>
      </CardHeader>
      {request.customer_rating && (
        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < request.customer_rating!
                  ? "fill-amber-400 text-amber-400"
                  : "text-border"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted">
            {request.customer_rating}/5
          </span>
        </div>
      )}
      {request.customer_comment && (
        <blockquote className="border-l-2 border-border pl-4 text-sm text-foreground">
          {request.customer_comment}
        </blockquote>
      )}
    </Card>
  );
}
