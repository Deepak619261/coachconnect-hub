import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface HeroSectionProps {
  coaching: Tables<"coaching">;
}

export function HeroSection({ coaching }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[420px] sm:min-h-[480px] flex items-end">
      {/* Background */}
      <div className="absolute inset-0">
        {coaching.banner_url ? (
          <img src={coaching.banner_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/50 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-transparent" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-32 sm:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {coaching.logo_url ? (
            <img
              src={coaching.logo_url}
              alt={coaching.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover mx-auto mb-8 border-4 border-card/80 shadow-elevated ring-1 ring-border/10"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-card/90 backdrop-blur-sm mx-auto mb-8 flex items-center justify-center border-4 border-card/80 shadow-elevated">
              <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-primary" />
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-4 tracking-tight leading-tight drop-shadow-sm"
        >
          {coaching.name}
        </motion.h1>

        {coaching.description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            {coaching.description}
          </motion.p>
        )}
      </div>
    </section>
  );
}