"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import { members } from "@/lib/data";

const ALL = "All";

function unique(values: string[]): string[] {
  return [ALL, ...Array.from(new Set(values)).sort()];
}

export default function DirectoryClient() {
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState(ALL);
  const [major, setMajor] = useState(ALL);
  const [state, setState] = useState(ALL);
  const [degree, setDegree] = useState(ALL);
  const [onlyAlumni, setOnlyAlumni] = useState(false);

  const universities = useMemo(() => unique(members.map((m) => m.university)), []);
  const majors = useMemo(() => unique(members.map((m) => m.major)), []);
  const states = useMemo(() => unique(members.map((m) => m.state)), []);
  const degrees = useMemo(() => unique(members.map((m) => m.degree)), []);

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.major.toLowerCase().includes(q) ||
      m.university.toLowerCase().includes(q) ||
      m.industry.toLowerCase().includes(q);
    return (
      matchesQuery &&
      (university === ALL || m.university === university) &&
      (major === ALL || m.major === major) &&
      (state === ALL || m.state === state) &&
      (degree === ALL || m.degree === degree) &&
      (!onlyAlumni || m.isAlumni)
    );
  });

  const selectClass =
    "rounded-lg border border-white/10 bg-ink-soft px-3 py-2 text-sm text-zinc-200 outline-none focus:border-accent/60";

  return (
    <div>
      <div className="card p-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, major, university, or industry…"
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-accent/60"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <select value={university} onChange={(e) => setUniversity(e.target.value)} className={selectClass}>
            {universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <select value={major} onChange={(e) => setMajor(e.target.value)} className={selectClass}>
            {majors.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectClass}>
            {degrees.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-ink-soft px-3 py-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={onlyAlumni}
              onChange={(e) => setOnlyAlumni(e.target.checked)}
              className="accent-accent"
            />
            Alumni only
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-zinc-400">
        {filtered.length} {filtered.length === 1 ? "member" : "members"}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="card p-6">
            <div className="flex items-start justify-between">
              <Avatar initials={m.initials} size="lg" />
              {m.isAlumni && <span className="chip">Alumni</span>}
            </div>
            <h3 className="mt-4 font-semibold text-white">{m.name}</h3>
            <p className="text-sm text-zinc-400">
              {m.major} · {m.degree}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{m.university}</p>
            <p className="mt-3 text-sm text-zinc-400">{m.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{m.industry}</span>
              <span className="chip">
                {m.city}, {m.state}
              </span>
              <span className="chip">Class of {m.gradYear}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card mt-4 p-10 text-center text-zinc-400">
          No members match your filters yet.
        </div>
      )}
    </div>
  );
}
