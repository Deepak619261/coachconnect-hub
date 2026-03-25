import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgotPassword">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect already-authenticated users away from the auth page
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/admin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === "signup" && name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (authMode !== "forgotPassword" && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/admin");
      } else if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm, then sign in.");
        setAuthMode("login"); 
      } else if (authMode === "forgotPassword") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent! Please check your email inbox.");
        setAuthMode("login");
      }
    } catch (err: any) {
      // Provide friendlier messages for common Supabase auth errors
      const msg: string = err.message || "Something went wrong. Please try again.";
      if (msg.includes("Invalid login credentials")) {
        toast.error("Invalid email or password.");
      } else if (msg.includes("User already registered")) {
        toast.error("An account with this email already exists. Please sign in.");
        setAuthMode("login");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display text-foreground">CoachHub Lite</h1>
          <p className="text-muted-foreground mt-2 font-body">
            {authMode === "login" 
              ? "Sign in to manage your coaching" 
              : authMode === "signup"
                ? "Create your coaching account"
                : "Reset your coaching account password"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={authMode === "signup"}
                  autoComplete="name"
                  className="h-11"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            {authMode !== "forgotPassword" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password font-body text-sm font-medium text-foreground">
                    Password
                  </Label>
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgotPassword")}
                      className="text-xs text-primary hover:underline font-body"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={authMode !== "forgotPassword"}
                    minLength={6}
                    autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authMode === "signup" && (
                  <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full h-11 font-body" disabled={loading}>
              {loading 
                ? "Please wait..." 
                : authMode === "login" 
                  ? "Sign In" 
                  : authMode === "signup"
                    ? "Create Account"
                    : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground font-body">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
