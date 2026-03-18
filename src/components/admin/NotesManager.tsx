import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadFile } from "@/lib/supabase-helpers";
import { useCoachingNotes, useCreateNote, useDeleteNote } from "@/hooks/useCoaching";
import { FileText, ExternalLink, Trash2, Plus, FileQuestion } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const ACCEPTED_NOTE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface NotesManagerProps {
  coaching: Tables<"coaching">;
}

export function NotesManager({ coaching }: NotesManagerProps) {
  const { data: notes, isLoading } = useCoachingNotes(coaching.id);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      if (!ACCEPTED_NOTE_TYPES.includes(f.type)) {
        toast.error("Only PDF and image files are allowed.");
        e.target.value = "";
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error("File size must be under 10MB.");
        e.target.value = "";
        return;
      }
    }
    setFile(f);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    try {
      let fileUrl = "";
      if (file) {
        fileUrl = await uploadFile("coaching-assets", `${coaching.id}/notes/${Date.now()}-${file.name}`, file);
      }
      await createNote.mutateAsync({
        coaching_id: coaching.id,
        title: title.trim(),
        subject: subject.trim() || undefined,
        file_url: fileUrl || undefined,
      });
      setTitle("");
      setSubject("");
      setFile(null);
      toast.success("Note added!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add note.");
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-1">Study Material</h2>
        <p className="text-muted-foreground text-sm">Upload notes and resources for your students.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-5 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-11 rounded-xl" placeholder="e.g. Mathematics" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">File (PDF / Image, max 10MB)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="h-11 pt-2.5 rounded-xl" />
        </div>
        <Button type="submit" size="sm" disabled={createNote.isPending} className="rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> {createNote.isPending ? "Adding..." : "Add Note"}
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{note.title}</p>
                  {note.subject && <p className="text-xs text-muted-foreground mt-0.5">{note.subject}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {note.file_url && (
                  <Button variant="outline" size="sm" className="rounded-xl" asChild>
                    <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote.mutate({ id: note.id, coachingId: coaching.id })}
                  className="text-destructive hover:text-destructive rounded-xl"
                  disabled={deleteNote.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-card">
          <FileQuestion className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium text-sm">No notes yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first study material above.</p>
        </div>
      )}
    </div>
  );
}