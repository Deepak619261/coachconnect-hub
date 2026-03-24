import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCoachingBySlug, useCoachingNotes, useCoachingNotices, useTestimonials, useIncrementPageViews } from "@/hooks/useCoaching";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/public/HeroSection";
import { InfoSection } from "@/components/public/InfoSection";
import { NoticesSection } from "@/components/public/NoticesSection";
import { NotesSection } from "@/components/public/NotesSection";
import { PublicPageSkeleton } from "@/components/public/PublicPageSkeleton";
import { VideoSection } from "@/components/public/VideoSection";
import { InquirySection } from "@/components/public/InquirySection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";

export default function PublicCoachingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: coaching, isLoading, isError } = useCoachingBySlug(slug || "");
  const { data: notes = [] } = useCoachingNotes(coaching?.id);
  const { data: notices = [] } = useCoachingNotices(coaching?.id);
  const { data: testimonials = [] } = useTestimonials(coaching?.id);
  const { mutate: incrementViews } = useIncrementPageViews();

  useEffect(() => {
    if (coaching) {
      incrementViews(coaching.id);
      const seo = (coaching as any).seo_settings;
      if (seo) {
        if (seo.metaTitle) document.title = seo.metaTitle;
        if (seo.metaDescription) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', seo.metaDescription);
        }
      } else {
        document.title = `${coaching.name} | CoachHub`;
      }
    }
  }, [coaching, incrementViews]);

  if (isLoading) return <PublicPageSkeleton />;

  // coaching is null (not found) OR a fetch error occurred
  if (isError || !coaching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 mx-auto">
            <GraduationCap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display text-foreground mb-2">Coaching Page Not Found</h1>
          <p className="text-muted-foreground max-w-sm text-center mb-8">
            The coaching page <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">/c/{slug}</span> doesn't exist or may have been removed.
          </p>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background${coaching.theme ? ` theme-${coaching.theme}` : ''}`}>
      <HeroSection coaching={coaching} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 space-y-16 pb-20">
        <InfoSection coaching={coaching} />
        <VideoSection youtubeUrl={coaching.youtube_url} />
        <NoticesSection notices={notices} />
        <NotesSection notes={notes} />
        <TestimonialsSection testimonials={testimonials} />
        <InquirySection coachingId={coaching.id} inquiryConfig={(coaching as any).inquiry_config} />

        <footer className="text-center pt-10 border-t border-border">
          <p className="text-sm text-muted-foreground/60">
            Powered by <span className="font-semibold text-foreground/70">CoachHub Lite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}