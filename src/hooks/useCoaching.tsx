import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useMyCoaching() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-coaching", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("coaching")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCoachingBySlug(slug: string) {
  return useQuery({
    queryKey: ["coaching", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coaching")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data; // null if not found — handled gracefully in PublicCoachingPage
    },
    enabled: !!slug,
  });
}

export function useCoachingNotes(coachingId: string | undefined) {
  return useQuery({
    queryKey: ["notes", coachingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("coaching_id", coachingId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!coachingId,
  });
}

export function useCoachingNotices(coachingId: string | undefined) {
  return useQuery({
    queryKey: ["notices", coachingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("coaching_id", coachingId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!coachingId,
  });
}

export function useUpsertCoaching() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id?: string;
      owner_id: string;
      name: string;
      slug: string;
      description?: string;
      logo_url?: string;
      banner_url?: string;
      address?: string;
      google_map_link?: string;
      contact_number?: string;
    }) => {
      if (data.id) {
        const { id, owner_id, ...updateData } = data;
        const { data: result, error } = await supabase
          .from("coaching")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from("coaching")
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-coaching"] });
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { coaching_id: string; title: string; subject?: string; file_url?: string }) => {
      const { data: result, error } = await supabase.from("notes").insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notes", vars.coaching_id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, coachingId }: { id: string; coachingId: string }) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      return coachingId;
    },
    onSuccess: (coachingId) => {
      queryClient.invalidateQueries({ queryKey: ["notes", coachingId] });
    },
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { coaching_id: string; title: string; content?: string }) => {
      const { data: result, error } = await supabase.from("notices").insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notices", vars.coaching_id] });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, coachingId }: { id: string; coachingId: string }) => {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
      return coachingId;
    },
    onSuccess: (coachingId) => {
      queryClient.invalidateQueries({ queryKey: ["notices", coachingId] });
    },
  });
}
