import type { SupabaseClient } from "@supabase/supabase-js";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Caps an image to maxDim on its longest side and re-encodes it as JPEG to keep
// uploads (and later page loads) small. Returns the original if it's already
// small enough or not an image.
export async function downscaleImage(
  file: File,
  maxDim = 1600,
  quality = 0.85,
): Promise<File> {
  if (typeof document === "undefined" || !file.type.startsWith("image/")) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    if (scale >= 1) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

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
