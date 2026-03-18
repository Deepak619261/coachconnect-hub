import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink, LogOut } from "lucide-react";

interface AdminHeaderProps {
  slug?: string;
  onSignOut: () => void;
}

export function AdminHeader({ slug, onSignOut }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg text-foreground tracking-tight">CoachHub Lite</span>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-medium" asChild>
              <a href={`/c/${slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Page
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onSignOut} className="rounded-xl text-muted-foreground hover:text-foreground text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}