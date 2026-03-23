import { useInquiries, useDeleteInquiry } from "@/hooks/useCoaching";
import { Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function InquiriesManager({ coaching }: { coaching: Tables<"coaching"> }) {
  const { data: inquiries, isLoading } = useInquiries(coaching.id);
  const deleteInquiry = useDeleteInquiry();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;
    try {
      await deleteInquiry.mutateAsync({ id, coachingId: coaching.id });
      toast.success("Inquiry deleted successfully.");
    } catch {
      toast.error("Failed to delete inquiry.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-1">Student Inquiries</h2>
        <p className="text-muted-foreground text-sm">Manage messages from your students.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{inquiry.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-foreground/80 space-y-1 mb-4">
                  <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${inquiry.email}`} className="hover:underline">{inquiry.email}</a></p>
                  {inquiry.phone && <p><span className="text-muted-foreground">Phone:</span> {inquiry.phone}</p>}
                </div>
                <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {inquiry.message}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(inquiry.id, inquiry.name)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 mt-2 sm:mt-0"
                disabled={deleteInquiry.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-card">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium text-sm">No inquiries yet</p>
          <p className="text-xs text-muted-foreground mt-1">When students contact you, their messages will appear here.</p>
        </div>
      )}
    </div>
  );
}
