"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import Tr from "@/components/Tr";
import { useApp } from "@/components/Providers";
import type { Member } from "@/lib/data";

export default function DirectoryClient({ members }: { members: Member[] }) {
  const { t } = useApp();
  const ALL = t.crowdfunding.all;

  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState(ALL);
  const [major, setMajor] = useState(ALL);
  const [state, setState] = useState(ALL);
  const [degree, setDegree] = useState(ALL);
  const [onlyAlumni, setOnlyAlumni] = useState(false);

  const unique = (values: string[]) => [ALL, ...Array.from(new Set(values)).sort()];
  const universities = useMemo(() => unique(members.map((m) => m.university)), [members, ALL]);
  const majors = useMemo(() => unique(members.map((m) => m.major)), [members, ALL]);
  const states = useMemo(() => unique(members.map((m) => m.state)), [members, ALL]);
  const degrees = useMemo(() => unique(members.map((m) => m.degree)), [members, ALL]);

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
    "rounded-lg border border-line/10 bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent/60";

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.directory.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.directory.sub}</p>

      <div className="mt-10 card p-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.directory.searchPlaceholder}
          className="w-full rounded-lg border border-line/10 bg-bg px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-muted/60 focus:border-accent/60"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <select value={university} onChange={(e) => setUniversity(e.target.value)} className={selectClass}>
            {universities.map((u) => <option key={u}>{u}</option>)}
          </select>
          <select value={major} onChange={(e) => setMajor(e.target.value)} className={selectClass}>
            {majors.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectClass}>
            {degrees.map((d) => <option key={d}>{d}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line/10 bg-surface px-3 py-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={onlyAlumni}
              onChange={(e) => setOnlyAlumni(e.target.checked)}
              className="accent-accent"
            />
            {t.directory.alumniOnly}
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-fg-muted">
        {filtered.length} {filtered.length === 1 ? t.directory.resultsOne : t.directory.resultsMany}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="card p-6">
            <div className="flex items-start justify-between">
              <Avatar initials={m.initials} src={m.avatarUrl} size="lg" />
              {m.isAlumni && <span className="chip">{t.directory.alumni}</span>}
            </div>
            <h3 className="mt-4 font-semibold text-fg">{m.name}</h3>
            <p className="text-sm text-fg-muted">{m.major} · {m.degree}</p>
            <p className="mt-1 text-xs text-fg-muted/70">{m.university}</p>
            <p className="mt-3 text-sm text-fg-muted"><Tr>{m.bio}</Tr></p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{m.industry}</span>
              <span className="chip">{m.city}, {m.state}</span>
              {m.gradYear > 0 && <span className="chip">{t.directory.classOf} {m.gradYear}</span>}
            </div>
            {(m.publicEmail || m.linkedin || m.website) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line/10 pt-4">
                {m.publicEmail && (
                  <a href={`mailto:${m.publicEmail}`} className="btn-ghost !px-4 !py-1.5 !text-xs">
                    {t.directory.email}
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-1.5 !text-xs">
                    {t.directory.linkedin}
                  </a>
                )}
                {m.website && (
                  <a href={m.website} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-1.5 !text-xs">
                    {t.directory.website}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card mt-4 p-10 text-center text-fg-muted">{t.directory.empty}</div>
      )}
    </div>
  );
}
