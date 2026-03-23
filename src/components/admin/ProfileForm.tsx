import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadFile, generateSlug } from "@/lib/supabase-helpers";
import { useUpsertCoaching } from "@/hooks/useCoaching";
import { Save, Image, ImagePlus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface ProfileFormProps {
  coaching: Tables<"coaching"> | null;
  userId: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [theme, setTheme] = useState("");
  const [socialInsta, setSocialInsta] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (coaching) {
      setCoachingName(coaching.name || "");
      setDescription(coaching.description || "");
      setAddress(coaching.address || "");
      setMapLink(coaching.google_map_link || "");
      setContactNumber(coaching.contact_number || "");
      
      setCalendlyUrl(coaching.calendly_url || "");
      setYoutubeUrl(coaching.youtube_url || "");
      setTheme(coaching.theme || "");
      
      const socials = typeof coaching.social_links === 'object' && coaching.social_links !== null ? coaching.social_links as Record<string, string> : {};
      setSocialInsta(socials.instagram || "");
      setSocialLinkedin(socials.linkedin || "");
      setSocialYoutube(socials.youtube || "");
      setSocialTwitter(socials.twitter || "");
    }
  }, [coaching]);

  const handleFileChange =
    (
      setter: (f: File | null) => void,
      previewSetter: (url: string | null) => void
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const err = validateImageFile(file);
        if (err) {
          toast.error(err);
          e.target.value = "";
          return;
        }
        setter(file);
        // Generate local preview URL
        const url = URL.createObjectURL(file);
        previewSetter(url);
      } else {
        setter(null);
        previewSetter(null);
      }
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachingName.trim()) {
      toast.error("Coaching name is required.");
      return;
    }

    try {
      // Use the existing ID if updating; only generate slug on first creation
      const existingId = coaching?.id;
      const slug = coaching?.slug || generateSlug(coachingName);

      let logoUrl = coaching?.logo_url || "";
      let bannerUrl = coaching?.banner_url || "";

      // We need the ID before uploading so the storage path is always consistent.
      // Strategy: upsert first (get/confirm ID), then upload files if needed, then update URLs.
      const upserted = await upsertCoaching.mutateAsync({
        ...(existingId ? { id: existingId } : {}),
        owner_id: userId,
        name: coachingName.trim(),
        slug,
        description: description.trim(),
        address: address.trim(),
        google_map_link: mapLink.trim(),
        contact_number: contactNumber.trim(),
        logo_url: logoUrl,
        banner_url: bannerUrl,
        calendly_url: calendlyUrl.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
        theme: theme || null,
        social_links: {
          instagram: socialInsta.trim(),
          linkedin: socialLinkedin.trim(),
          youtube: socialYoutube.trim(),
          twitter: socialTwitter.trim(),
        },
      });

      const coachingId = upserted.id;
      let needsSecondUpdate = false;

      if (logoFile) {
        logoUrl = await uploadFile(
          "coaching-assets",
          `${coachingId}/branding/logo`,
          logoFile
        );
        needsSecondUpdate = true;
      }
      if (bannerFile) {
        bannerUrl = await uploadFile(
          "coaching-assets",
          `${coachingId}/branding/banner`,
          bannerFile
        );
        needsSecondUpdate = true;
      }

      // Second pass: update image URLs now that we have the storage URLs
      if (needsSecondUpdate) {
        await upsertCoaching.mutateAsync({
          id: coachingId,
          owner_id: userId,
          name: coachingName.trim(),
          slug,
          description: description.trim(),
          address: address.trim(),
          google_map_link: mapLink.trim(),
          contact_number: contactNumber.trim(),
          logo_url: logoUrl,
          banner_url: bannerUrl,
          calendly_url: calendlyUrl.trim() || null,
          youtube_url: youtubeUrl.trim() || null,
          theme: theme || null,
          social_links: {
            instagram: socialInsta.trim(),
            linkedin: socialLinkedin.trim(),
            youtube: socialYoutube.trim(),
            twitter: socialTwitter.trim(),
          },
        });
      }

      // Reset file inputs
      setLogoFile(null);
      setBannerFile(null);
      setLogoPreview(null);
      setBannerPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (bannerInputRef.current) bannerInputRef.current.value = "";

      toast.success("Profile saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    }
  };

  const currentLogo = logoPreview || coaching?.logo_url || null;
  const currentBanner = bannerPreview || coaching?.banner_url || null;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-1">Coaching Profile</h2>
        <p className="text-muted-foreground text-sm">Set up your public coaching page details and branding.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Coaching Name *</Label>
              <Input
                value={coachingName}
                onChange={(e) => setCoachingName(e.target.value)}
                required
                placeholder="e.g. Raj Maths Classes"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Contact Number</Label>
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                type="tel"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Description / Tagline</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A short tagline about your coaching..."
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop 4, Main Market, City"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Google Maps Link</Label>
            <Input
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="https://maps.google.com/..."
              type="url"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Read-only slug preview */}
          {(coaching?.slug || coachingName) && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Your Public URL</Label>
              <div className="h-11 rounded-xl border border-dashed border-border bg-muted/40 flex items-center px-3 text-sm text-muted-foreground font-mono">
                /c/{coaching?.slug || generateSlug(coachingName) || "your-coaching"}
              </div>
              {!coaching?.slug && (
                <p className="text-xs text-muted-foreground/70">
                  Slug is set on first save and cannot be changed afterwards.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Branding */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Branding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Logo</Label>
              {currentLogo ? (
                <div className="relative w-fit group">
                  <img
                    src={currentLogo}
                    alt="Logo preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Image className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Upload</span>
                </button>
              )}
              <Input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange(setLogoFile, setLogoPreview)}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground/60">JPG, PNG, WebP · max 5MB</p>
            </div>

            {/* Banner */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Banner Image</Label>
              {currentBanner ? (
                <div className="relative w-full group">
                  <img
                    src={currentBanner}
                    alt="Banner preview"
                    className="w-full h-24 rounded-xl object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Image className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs font-medium">Upload Banner</span>
                </button>
              )}
              <Input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange(setBannerFile, setBannerPreview)}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground/60">Recommended: 1200×400px · max 5MB</p>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Engagement & Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Calendly Booking Link</Label>
              <Input
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
                placeholder="https://calendly.com/your-name"
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Intro Video (YouTube Link)</Label>
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-border pt-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Instagram URL</Label>
              <Input
                value={socialInsta}
                onChange={(e) => setSocialInsta(e.target.value)}
                placeholder="https://instagram.com/..."
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">LinkedIn URL</Label>
              <Input
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="https://linkedin.com/..."
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Twitter / X URL</Label>
              <Input
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">YouTube Channel URL</Label>
              <Input
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                placeholder="https://youtube.com/c/..."
                type="url"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={upsertCoaching.isPending} className="rounded-xl px-6 h-11">
          <Save className="w-4 h-4 mr-2" />
          {upsertCoaching.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}