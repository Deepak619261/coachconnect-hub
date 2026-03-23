import { useState } from "react";
import { useTestimonials, useCreateTestimonial, useDeleteTestimonial } from "@/hooks/useCoaching";
import { Trash2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function TestimonialsManager({ coaching }: { coaching: Tables<"coaching"> }) {
  const { data: testimonials, isLoading } = useTestimonials(coaching.id);
  const createTestimonial = useCreateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [studentName, setStudentName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !content.trim()) return toast.error("Name and review are required.");

    try {
      await createTestimonial.mutateAsync({
        coaching_id: coaching.id,
        student_name: studentName.trim(),
        content: content.trim(),
        rating,
      });
      setStudentName("");
      setContent("");
      setRating(5);
      toast.success("Review added to your public page!");
    } catch {
      toast.error("Failed to add review.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review from ${name}?`)) return;
    try {
      await deleteTestimonial.mutateAsync({ id, coachingId: coaching.id });
      toast.success("Review deleted successfully.");
    } catch {
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-1">Student Reviews</h2>
        <p className="text-muted-foreground text-sm">Add testimonials to build trust.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-5 shadow-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Student Name *</Label>
            <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} required placeholder="e.g., John Doe" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Rating (1-5) *</Label>
            <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} required className="h-11 rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Review *</Label>
          <Textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write the testimonial..." className="rounded-xl" />
        </div>
        <Button type="submit" size="sm" disabled={createTestimonial.isPending} className="rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> {createTestimonial.isPending ? "Adding..." : "Add Review"}
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">{t.student_name}</span>
                  <div className="flex items-center">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground ml-1">{t.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{t.content}"</p>
                <p className="text-xs text-muted-foreground/60 mt-2 font-medium">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(t.id, t.student_name)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-xl"
                disabled={deleteTestimonial.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-card">
          <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium text-sm">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first student testimonial above.</p>
        </div>
      )}
    </div>
  );
}
