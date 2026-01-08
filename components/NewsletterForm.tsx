"use client";

import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, CheckCircle } from "lucide-react";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

interface NewsletterFormProps {
  variant?: "inline" | "stacked";
  className?: string;
}

export default function NewsletterForm({
  variant = "inline",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message || "Invalid email";
      setError(errorMessage);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail("");

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });

      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`flex items-center gap-2 text-green-400 ${className}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">
          Thank you for subscribing!
        </span>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Enter your email"
            disabled={isLoading}
            className={`w-full pl-10 pr-4 py-2.5 text-sm bg-primary-foreground/10 border rounded focus:outline-none focus:border-primary-foreground/40 placeholder:text-primary-foreground/50 text-primary-foreground ${
              error ? "border-red-400" : "border-primary-foreground/20"
            }`}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
    );
  }

  // Inline variant
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Your email"
            disabled={isLoading}
            className={`w-full px-3 py-2 text-sm bg-primary-foreground/10 border rounded focus:outline-none focus:border-primary-foreground/40 placeholder:text-primary-foreground/50 text-primary-foreground ${
              error ? "border-red-400" : "border-primary-foreground/20"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </form>
  );
}
