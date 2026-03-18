import { motion } from "framer-motion";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface InfoSectionProps {
  coaching: Tables<"coaching">;
}

export function InfoSection({ coaching }: InfoSectionProps) {
  if (!coaching.address && !coaching.contact_number && !coaching.google_map_link) return null;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
        {coaching.address && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5 text-accent" />
            </div>
            <span className="text-foreground text-sm sm:text-base leading-relaxed">{coaching.address}</span>
          </div>
        )}
        {coaching.contact_number && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Phone className="w-4.5 h-4.5 text-accent" />
            </div>
            <a href={`tel:${coaching.contact_number}`} className="text-foreground hover:text-accent transition-colors text-sm sm:text-base font-medium">
              {coaching.contact_number}
            </a>
          </div>
        )}
        {coaching.google_map_link && (
          <Button variant="outline" size="sm" className="w-fit rounded-xl border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200" asChild>
            <a href={coaching.google_map_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1.5" /> View on Map
            </a>
          </Button>
        )}
      </div>
    </motion.section>
  );
}