import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface HeroSectionProps {
  coaching: Tables<"coaching">;
}

export function HeroSection({ coaching }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {coaching.banner_url ? (
          <img src={coaching.banner_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 sm:pt-28 sm:pb-36 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {coaching.logo_url ? (
            <img
              src={coaching.logo_url}
              alt={coaching.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover mx-auto mb-6 border-4 border-card shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-card mx-auto mb-6 flex items-center justify-center border-4 border-card shadow-xl">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-display text-primary-foreground mb-4 tracking-tight"
        >
          {coaching.name}
        </motion.h1>

        {coaching.description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            {coaching.description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
