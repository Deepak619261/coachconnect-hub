import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
          <GraduationCap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-display text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! This page doesn't exist.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
