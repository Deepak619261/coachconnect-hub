import { useParams } from "react-router-dom";
import { useCoachingBySlug, useCoachingNotes, useCoachingNotices } from "@/hooks/useCoaching";
import { GraduationCap } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { InfoSection } from "@/components/public/InfoSection";
import { NoticesSection } from "@/components/public/NoticesSection";
import { NotesSection } from "@/components/public/NotesSection";
import { PublicPageSkeleton } from "@/components/public/PublicPageSkeleton";

export default function PublicCoachingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: coaching, isLoading, error } = useCoachingBySlug(slug || "");
  const { data: notes } = useCoachingNotes(coaching?.id);
  const { data: notices } = useCoachingNotices(coaching?.id);

  if (isLoading) return <PublicPageSkeleton />;

  if (error || !coaching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground max-w-sm text-center">
          This coaching page doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection coaching={coaching} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 space-y-12 pb-16">
        <InfoSection coaching={coaching} />
        {notices && <NoticesSection notices={notices} />}
        {notes && <NotesSection notes={notes} />}

        <footer className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-foreground">CoachHub Lite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
