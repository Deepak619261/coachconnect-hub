import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function TestimonialsSection({ testimonials }: { testimonials: Tables<"testimonials">[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Star className="w-5 h-5 text-accent fill-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-foreground">What Students Say</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${idx < (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm italic mb-4 leading-relaxed">
              "{t.content}"
            </p>
            <p className="font-semibold text-sm text-foreground">- {t.student_name}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
