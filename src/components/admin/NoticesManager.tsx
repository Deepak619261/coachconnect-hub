import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCoachingNotices, useCreateNotice, useDeleteNotice } from "@/hooks/useCoaching";
import { Trash2, Plus, Megaphone } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface NoticesManagerProps {
  coaching: Tables<"coaching">;
}

export function NoticesManager({ coaching }: NoticesManagerProps) {
  const { data: notices, isLoading } = useCoachingNotices(coaching.id);
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    try {
      await createNotice.mutateAsync({
        coaching_id: coaching.id,
        title: title.trim(),
        content: content.trim() || undefined,
      });
      setTitle("");
      setContent("");
      toast.success("Notice published!");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish notice.");
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-display text-foreground mb-1">Notices</h2>
      <p className="text-muted-foreground mb-6">Post announcements for your students.</p>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write your announcement..." />
        </div>
        <Button type="submit" size="sm" disabled={createNotice.isPending}>
          <Plus className="w-4 h-4 mr-1.5" /> {createNotice.isPending ? "Publishing..." : "Publish Notice"}
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notices && notices.length > 0 ? (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between hover:shadow-sm transition-shadow">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{notice.title}</p>
                {notice.content && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotice.mutate({ id: notice.id, coachingId: coaching.id })}
                className="text-destructive hover:text-destructive ml-4 shrink-0"
                disabled={deleteNotice.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No notices yet</p>
          <p className="text-sm text-muted-foreground mt-1">Publish your first announcement above.</p>
        </div>
      )}
    </div>
  );
}
