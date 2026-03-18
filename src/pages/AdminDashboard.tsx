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
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: coaching, isLoading } = useMyCoaching();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader slug={coaching?.slug} onSignOut={signOut} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
