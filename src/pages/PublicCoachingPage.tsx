import { useParams } from "react-router-dom";
import { useCoachingBySlug, useCoachingNotes, useCoachingNotices } from "@/hooks/useCoaching";
import { motion } from "framer-motion";
import { MapPin, Phone, ExternalLink, Download, Bell, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function PublicCoachingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: coaching, isLoading, error } = useCoachingBySlug(slug || "");
  const { data: notes } = useCoachingNotes(coaching?.id);
  const { data: notices } = useCoachingNotices(coaching?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-body">Loading...</div>
      </div>
    );
  }

  if (error || !coaching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-display text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground font-body">This coaching page doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {coaching.banner_url ? (
            <img src={coaching.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-background" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {coaching.logo_url ? (
              <img
                src={coaching.logo_url}
                alt={coaching.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover mx-auto mb-6 border-4 border-card shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-card mx-auto mb-6 flex items-center justify-center border-4 border-card shadow-lg">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl font-display text-primary-foreground mb-4"
          >
            {coaching.name}
          </motion.h1>

          {coaching.description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg sm:text-xl text-primary-foreground/80 font-body max-w-2xl mx-auto"
            >
              {coaching.description}
            </motion.p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 space-y-12 pb-16">
        {/* Info Section */}
        {(coaching.address || coaching.contact_number || coaching.google_map_link) && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              {coaching.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="font-body text-foreground">{coaching.address}</span>
                </div>
              )}
              {coaching.contact_number && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-body text-foreground">{coaching.contact_number}</span>
                </div>
              )}
              {coaching.google_map_link && (
                <Button variant="outline" size="sm" className="font-body w-fit" asChild>
                  <a href={coaching.google_map_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1.5" /> View on Map
                  </a>
                </Button>
              )}
            </div>
          </motion.section>
        )}

        {/* Notices Section */}
        {notices && notices.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-display text-foreground">Announcements</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notices.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 group"
                >
                  <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                    {notice.title}
                  </h3>
                  {notice.content && (
                    <p className="text-muted-foreground font-body text-sm line-clamp-3 mb-3">
                      {notice.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground font-body">
                    {new Date(notice.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Notes Section */}
        {notes && notes.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-display text-foreground">Study Material</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note, i) => (
                <motion.div
                  key={note.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-foreground mb-1">{note.title}</h3>
                    {note.subject && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-xs text-muted-foreground font-body mb-3">
                        {note.subject}
                      </span>
                    )}
                  </div>
                  {note.file_url && (
                    <Button variant="outline" size="sm" className="font-body w-full mt-3" asChild>
                      <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-1.5" /> Download
                      </a>
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground font-body">
            Powered by <span className="font-semibold text-foreground">CoachHub Lite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
