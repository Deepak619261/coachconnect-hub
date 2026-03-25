import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * This component handles Supabase auth redirects (password recovery, signup confirmation).
 * It MUST be placed inside <BrowserRouter> so it has access to useNavigate.
 * 
 * Flow:
 * 1. User clicks email link → lands on site root with #access_token=...&type=recovery (or signup)
 * 2. Supabase client auto-processes the hash fragment and fires an event
 * 3. This component catches that event and navigates to the appropriate page
 */
export function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Check the URL hash for clues if the event isn't specific enough
      const hash = window.location.hash;
      const isRecovery = hash.includes("type=recovery") || event === "PASSWORD_RECOVERY";
      const isSignupConfirm = hash.includes("type=signup") || hash.includes("access_token");

      if (isRecovery) {
        // Password recovery flow
        if (location.pathname !== "/reset-password") {
          console.log("AuthRedirectHandler: Password recovery detected, redirecting to /reset-password");
          navigate("/reset-password", { replace: true });
        }
      } else if (event === "SIGNED_IN" && session) {
        // Email confirmation/Signup link flow (also fires on normal login)
        // Only redirect automatically if they are on the root path (likely coming from email)
        if (location.pathname === "/" || location.pathname === "/auth") {
          console.log("AuthRedirectHandler: User signed in, redirecting to /admin");
          toast.success("Email confirmed! Welcome to CoachHub.");
          navigate("/admin", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null; // This component renders nothing — it's purely a side-effect handler
}
