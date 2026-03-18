import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadFile, generateSlug } from "@/lib/supabase-helpers";
import { useUpsertCoaching } from "@/hooks/useCoaching";
import type { Tables } from "@/integrations/supabase/types";

interface ProfileFormProps {
  coaching: Tables<"coaching"> | null;
  userId: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WebP, and GIF images are allowed.";
  if (file.size > MAX_FILE_SIZE) return "File size must be under 5MB.";
  return null;
}

export function ProfileForm({ coaching, userId }: ProfileFormProps) {
  const upsertCoaching = useUpsertCoaching();

  const [coachingName, setCoachingName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (coaching) {
      setCoachingName(coaching.name || "");
      setDescription(coaching.description || "");
      setAddress(coaching.address || "");
      setMapLink(coaching.google_map_link || "");
      setContactNumber(coaching.contact_number || "");
    }
  }, [coaching]);

  const handleFileChange = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const err = validateImageFile(file);
      if (err) {
        toast.error(err);
        e.target.value = "";
        return;
      }
    }
    setter(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachingName.trim()) {
      toast.error("Coaching name is required.");
      return;
    }

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
        owner_id: userId,
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
      toast.error(err.message || "Failed to save profile.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-display text-foreground mb-1">Coaching Profile</h2>
      <p className="text-muted-foreground mb-6">Set up your public coaching page.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Coaching Name *</Label>
            <Input value={coachingName} onChange={(e) => setCoachingName(e.target.value)} required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="h-11" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A short tagline about your coaching..." />
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11" />
        </div>

        <div className="space-y-2">
          <Label>Google Maps Link</Label>
          <Input value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." className="h-11" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange(setLogoFile)} className="h-11 pt-2.5" />
            {coaching?.logo_url && <img src={coaching.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover mt-2 border border-border" />}
          </div>
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange(setBannerFile)} className="h-11 pt-2.5" />
            {coaching?.banner_url && <img src={coaching.banner_url} alt="Banner" className="w-full h-20 rounded-xl object-cover mt-2 border border-border" />}
          </div>
        </div>

        <Button type="submit" disabled={upsertCoaching.isPending}>
          {upsertCoaching.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
