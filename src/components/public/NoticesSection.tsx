import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface NoticesSectionProps {
  notices: Tables<"notices">[];
}

export function NoticesSection({ notices }: NoticesSectionProps) {
  // Don't render the section at all if no notices
  if (!notices.length) return null;

  return (
    <motion.section
      variants={fadeUp as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-foreground">Announcements</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {notices.map((notice, i) => (
          <motion.div
            key={notice.id}
            variants={fadeUp as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <h3 className="font-display text-lg text-foreground mb-4 group-hover:text-accent transition-colors duration-200">
              {notice.title}
            </h3>
            {notice.content && (
              <div className="prose prose-sm dark:prose-invert max-w-none mb-4 text-muted-foreground line-clamp-4 hover:line-clamp-none transition-all">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {notice.content}
                </ReactMarkdown>
              </div>
            )}
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide uppercase mt-auto pt-4 border-t border-border/50">
              {new Date(notice.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}