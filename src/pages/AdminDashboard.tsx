import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyCoaching } from "@/hooks/useCoaching";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabs, type TabKey } from "@/components/admin/AdminTabs";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { NotesManager } from "@/components/admin/NotesManager";
import { NoticesManager } from "@/components/admin/NoticesManager";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: coaching, isLoading } = useMyCoaching();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // Handle post-signout redirect
  useEffect(() => {
    if (!user) navigate("/auth", { replace: true });
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card h-16" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="h-12 w-80 rounded-xl" />
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const coachingSlug = coaching?.slug;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader slug={coachingSlug} onSignOut={signOut} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Public page link banner */}
        {coachingSlug && (
          <div className="mb-8 flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl px-5 py-3">
            <span className="text-sm text-muted-foreground">Your public page:</span>
            <a
              href={`/c/${coachingSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              /c/{coachingSlug} ↗
            </a>
          </div>
        )}

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileForm coaching={coaching ?? null} userId={user.id} />
        )}

        {activeTab === "notes" && (
          coaching ? (
            <NotesManager coaching={coaching} />
          ) : (
            <div className="max-w-3xl">
              <p className="text-muted-foreground bg-card border border-border rounded-2xl p-8 text-center">
                Please set up your coaching profile first.
              </p>
            </div>
          )
        )}

        {activeTab === "notices" && (
          coaching ? (
            <NoticesManager coaching={coaching} />
          ) : (
            <div className="max-w-3xl">
              <p className="text-muted-foreground bg-card border border-border rounded-2xl p-8 text-center">
                Please set up your coaching profile first.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
