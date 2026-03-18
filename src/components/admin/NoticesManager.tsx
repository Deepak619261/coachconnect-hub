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
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-1">Notices</h2>
        <p className="text-muted-foreground text-sm">Post announcements for your students.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-5 shadow-card">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Content</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write your announcement..." className="rounded-xl" />
        </div>
        <Button type="submit" size="sm" disabled={createNotice.isPending} className="rounded-xl">
          <Plus className="w-4 h-4 mr-1.5" /> {createNotice.isPending ? "Publishing..." : "Publish Notice"}
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notices && notices.length > 0 ? (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{notice.title}</p>
                {notice.content && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{notice.content}</p>}
                <p className="text-xs text-muted-foreground/60 mt-2.5 font-medium">
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
                className="text-destructive hover:text-destructive ml-4 shrink-0 rounded-xl"
                disabled={deleteNotice.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-card">
          <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium text-sm">No notices yet</p>
          <p className="text-xs text-muted-foreground mt-1">Publish your first announcement above.</p>
        </div>
      )}
    </div>
  );
}