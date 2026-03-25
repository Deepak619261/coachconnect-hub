import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * This component handles Supabase auth redirects (password recovery, signup confirmation).
 * It MUST be placed inside <BrowserRouter> so it has access to useNavigate.
 * 
 * Flow:
 * 1. User clicks email link → lands on site root with #access_token=...&type=recovery
 * 2. Supabase client auto-processes the hash fragment and fires PASSWORD_RECOVERY event
 * 3. This component catches that event and navigates to /reset-password
 */
export function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Supabase detected a password recovery token — redirect to reset page
        if (location.pathname !== "/reset-password") {
          navigate("/reset-password", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null; // This component renders nothing — it's purely a side-effect handler
}
