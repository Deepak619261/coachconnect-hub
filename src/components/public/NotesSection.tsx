import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface NotesSectionProps {
  notes: Tables<"notes">[];
}

export function NotesSection({ notes }: NotesSectionProps) {
  if (!notes.length) return null;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
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
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{note.title}</h3>
              {note.subject && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-xs text-muted-foreground mb-3">
                  {note.subject}
                </span>
              )}
            </div>
            {note.file_url && (
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-1.5" /> Download
                </a>
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
