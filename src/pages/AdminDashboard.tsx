import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyCoaching, useUpsertCoaching, useCoachingNotes, useCoachingNotices, useCreateNote, useDeleteNote, useCreateNotice, useDeleteNotice } from "@/hooks/useCoaching";
import { uploadFile, generateSlug } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GraduationCap, Settings, FileText, Bell, LogOut, ExternalLink, Trash2, Upload, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: coaching, isLoading } = useMyCoaching();
  const upsertCoaching = useUpsertCoaching();
  const { data: notes } = useCoachingNotes(coaching?.id);
  const { data: notices } = useCoachingNotices(coaching?.id);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const [activeTab, setActiveTab] = useState<"profile" | "notes" | "notices">("profile");

  // Profile form
  const [coachingName, setCoachingName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Note form
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteFile, setNoteFile] = useState<File | null>(null);

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (coaching) {
      setCoachingName(coaching.name || "");
      setDescription(coaching.description || "");
      setAddress(coaching.address || "");
      setMapLink(coaching.google_map_link || "");
      setContactNumber(coaching.contact_number || "");
    }
  }, [coaching]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let logoUrl = coaching?.logo_url || "";
      let bannerUrl = coaching?.banner_url || "";
      const slug = coaching?.slug || generateSlug(coachingName);
      const coachingId = coaching?.id || crypto.randomUUID();

      if (logoFile) {
        logoUrl = await uploadFile("coaching-assets", `${coachingId}/branding/logo`, logoFile);
      }
      if (bannerFile) {
        bannerUrl = await uploadFile("coaching-assets", `${coachingId}/branding/banner`, bannerFile);
      }

      await upsertCoaching.mutateAsync({
        ...(coaching?.id ? { id: coaching.id } : {}),
        owner_id: user.id,
        name: coachingName,
        slug,
        description,
        address,
        google_map_link: mapLink,
        contact_number: contactNumber,
        logo_url: logoUrl,
        banner_url: bannerUrl,
      });

      toast.success("Profile saved!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coaching) return;

    try {
      let fileUrl = "";
      if (noteFile) {
        fileUrl = await uploadFile("coaching-assets", `${coaching.id}/notes/${Date.now()}-${noteFile.name}`, noteFile);
      }
      await createNote.mutateAsync({
        coaching_id: coaching.id,
        title: noteTitle,
        subject: noteSubject,
        file_url: fileUrl,
      });
      setNoteTitle("");
      setNoteSubject("");
      setNoteFile(null);
      toast.success("Note added!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coaching) return;

    try {
      await createNotice.mutateAsync({
        coaching_id: coaching.id,
        title: noticeTitle,
        content: noticeContent,
      });
      setNoticeTitle("");
      setNoticeContent("");
      toast.success("Notice published!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-body">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: Settings },
    { key: "notes" as const, label: "Study Material", icon: FileText },
    { key: "notices" as const, label: "Notices", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground">CoachHub Lite</span>
          </div>
          <div className="flex items-center gap-3">
            {coaching?.slug && (
              <Button variant="outline" size="sm" className="font-body" asChild>
                <a href={`/c/${coaching.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1.5" /> View Page
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="font-body text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab Nav */}
        <div className="flex gap-1 mb-8 bg-muted rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-display text-foreground mb-1">Coaching Profile</h2>
            <p className="text-muted-foreground font-body mb-6">Set up your public coaching page.</p>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium text-foreground">Coaching Name *</Label>
                  <Input value={coachingName} onChange={(e) => setCoachingName(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium text-foreground">Contact Number</Label>
                  <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-body text-sm font-medium text-foreground">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>

              <div className="space-y-2">
                <Label className="font-body text-sm font-medium text-foreground">Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-2">
                <Label className="font-body text-sm font-medium text-foreground">Google Maps Link</Label>
                <Input value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." className="h-11" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium text-foreground">Logo</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="h-11 pt-2.5" />
                  {coaching?.logo_url && <img src={coaching.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover mt-2" />}
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium text-foreground">Banner Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="h-11 pt-2.5" />
                  {coaching?.banner_url && <img src={coaching.banner_url} alt="Banner" className="w-full h-20 rounded-xl object-cover mt-2" />}
                </div>
              </div>

              <Button type="submit" className="font-body" disabled={upsertCoaching.isPending}>
                {upsertCoaching.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-display text-foreground mb-1">Study Material</h2>
            <p className="text-muted-foreground font-body mb-6">Upload notes and resources for your students.</p>

            {coaching ? (
              <>
                <form onSubmit={handleAddNote} className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body text-sm font-medium text-foreground">Title *</Label>
                      <Input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-sm font-medium text-foreground">Subject</Label>
                      <Input value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)} className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium text-foreground">File (PDF/Image)</Label>
                    <Input type="file" accept=".pdf,image/*" onChange={(e) => setNoteFile(e.target.files?.[0] || null)} className="h-11 pt-2.5" />
                  </div>
                  <Button type="submit" size="sm" className="font-body" disabled={createNote.isPending}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Note
                  </Button>
                </form>

                <div className="space-y-3">
                  {notes?.map((note) => (
                    <div key={note.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">{note.title}</p>
                          {note.subject && <p className="text-sm text-muted-foreground font-body">{note.subject}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.file_url && (
                          <Button variant="outline" size="sm" className="font-body" asChild>
                            <a href={note.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote.mutate({ id: note.id, coachingId: coaching.id })}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {notes?.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground font-body">No notes yet. Add your first study material above.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground font-body">Please set up your coaching profile first.</p>
            )}
          </div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-display text-foreground mb-1">Notices</h2>
            <p className="text-muted-foreground font-body mb-6">Post announcements for your students.</p>

            {coaching ? (
              <>
                <form onSubmit={handleAddNotice} className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium text-foreground">Title *</Label>
                    <Input value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm font-medium text-foreground">Content</Label>
                    <Textarea value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} rows={3} />
                  </div>
                  <Button type="submit" size="sm" className="font-body" disabled={createNotice.isPending}>
                    <Plus className="w-4 h-4 mr-1.5" /> Publish Notice
                  </Button>
                </form>

                <div className="space-y-3">
                  {notices?.map((notice) => (
                    <div key={notice.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between">
                      <div>
                        <p className="font-body font-medium text-foreground">{notice.title}</p>
                        {notice.content && <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">{notice.content}</p>}
                        <p className="text-xs text-muted-foreground font-body mt-2">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotice.mutate({ id: notice.id, coachingId: coaching.id })}
                        className="text-destructive hover:text-destructive ml-4 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {notices?.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground font-body">No notices yet. Publish your first announcement above.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground font-body">Please set up your coaching profile first.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
