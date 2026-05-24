import type { SupabaseClient } from "@supabase/supabase-js";

// Uploads a file to the public "media" bucket inside the user's own folder
// and returns its public URL (or null on failure).
export async function uploadMedia(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
