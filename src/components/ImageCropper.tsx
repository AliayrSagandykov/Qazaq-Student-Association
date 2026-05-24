"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

// A lightweight drag-to-pan + zoom cropper. Renders the picked image inside a
// fixed-aspect viewport; the user repositions and scales it, and we export the
// visible region as a downscaled JPEG blob (keeps uploads small and fast).
export default function ImageCropper({
  file,
  aspect,
  outputWidth,
  title,
  labels,
  onCancel,
  onComplete,
}: {
  file: File;
  aspect: number; // width / height
  outputWidth: number;
  title: string;
  labels: { cancel: string; save: string; zoom: string; saving: string };
  onCancel: () => void;
  onComplete: (blob: Blob) => void | Promise<void>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Base "cover" scale so the image always fills the viewport at zoom = 1.
  const viewport = () => {
    const el = viewportRef.current;
    const vw = el?.clientWidth ?? 1;
    return { vw, vh: vw / aspect };
  };

  const coverScale = useCallback(() => {
    if (!nat) return 1;
    const { vw, vh } = viewport();
    return Math.max(vw / nat.w, vh / nat.h);
  }, [nat, aspect]);

  const clamp = useCallback(
    (next: Point, z = zoom): Point => {
      if (!nat) return next;
      const { vw, vh } = viewport();
      const dispW = nat.w * coverScale() * z;
      const dispH = nat.h * coverScale() * z;
      const minX = vw - dispW;
      const minY = vh - dispH;
      return {
        x: Math.min(0, Math.max(minX, next.x)),
        y: Math.min(0, Math.max(minY, next.y)),
      };
    },
    [nat, zoom, coverScale, aspect],
  );

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    setOffset(clamp({ x: drag.current.ox + dx, y: drag.current.oy + dy }));
  }
  function onPointerUp() {
    drag.current = null;
  }

  function changeZoom(z: number) {
    setZoom(z);
    setOffset((o) => clamp(o, z));
  }

  async function save() {
    if (!nat || !url) return;
    setSaving(true);
    const { vw, vh } = viewport();
    const scale = coverScale() * zoom;
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sw = vw / scale;
    const sh = vh / scale;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = Math.round(outputWidth / aspect);
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = url;
    await new Promise((r) => {
      if (img.complete) r(null);
      else img.onload = () => r(null);
    });
    ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      async (blob) => {
        if (blob) await onComplete(blob);
        setSaving(false);
      },
      "image/jpeg",
      0.85,
    );
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold text-fg">{title}</h3>

        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="relative mt-4 w-full cursor-grab touch-none overflow-hidden rounded-xl bg-surface active:cursor-grabbing"
          style={{ aspectRatio: String(aspect) }}
        >
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                setNat({ w: el.naturalWidth, h: el.naturalHeight });
                const { vw, vh } = viewport();
                const cs = Math.max(vw / el.naturalWidth, vh / el.naturalHeight);
                setOffset({ x: (vw - el.naturalWidth * cs) / 2, y: (vh - el.naturalHeight * cs) / 2 });
              }}
              style={{
                position: "absolute",
                left: offset.x,
                top: offset.y,
                width: nat ? nat.w * coverScale() * zoom : "100%",
                height: nat ? nat.h * coverScale() * zoom : "auto",
                maxWidth: "none",
              }}
            />
          )}
        </div>

        <label className="mt-4 block text-sm text-fg-muted">
          {labels.zoom}
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="mt-1 w-full accent-accent"
          />
        </label>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-ghost !py-2">
            {labels.cancel}
          </button>
          <button onClick={save} disabled={saving || !nat} className="btn-primary !py-2 disabled:opacity-60">
            {saving ? labels.saving : labels.save}
          </button>
        </div>
      </div>
    </div>
  );
}
