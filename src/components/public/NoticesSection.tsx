import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

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
  if (!notices.length) return null;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
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
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-accent/30 transition-all duration-300 group"
          >
            <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
              {notice.title}
            </h3>
            {notice.content && (
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{notice.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
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
  );
}
