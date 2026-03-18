import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink, LogOut } from "lucide-react";

interface AdminHeaderProps {
  slug?: string;
  onSignOut: () => void;
}

export function AdminHeader({ slug, onSignOut }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg text-foreground">CoachHub Lite</span>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/c/${slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" /> View Page
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
