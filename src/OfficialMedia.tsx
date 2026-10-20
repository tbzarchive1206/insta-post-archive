import { MediaTile } from "./MediaTile";
import { useMemo, useState } from "react";

type Media = { id: string; kind: "image" | "audio" | "video"; mimeType: string; name: string; date: number; year: number; account: string; members: string[] };
export type Archive = { generatedAt: string; sourceFolderId: string; accounts: string[]; media: Media[] };

const members = [{ id: "Group photo", label: "Group photo" }, { id: "Sangyeon", label: "Sangyeon" }, { id: "Jacob", label: "Jacob" }, { id: "Younghoon", label: "Younghoon" }, { id: "Hyunjae", label: "Hyunjae" }, { id: "Juyeon", label: "Juyeon" }, { id: "Kevin", label: "Kevin" }, { id: "Q", label: "Q" }, { id: "Sunwoo", label: "Sunwoo" }, { id: "Eric", label: "Eric" }, { id: "Hwall", label: "Hwall (2017 - 2019)" }, { id: "Haknyeon", label: "Haknyeon (2017 - 2025)" }, { id: "New", label: "New (2017 - 2026)" }, { id: "Other", label: "OTHER" }];
const pageSize = 28;
const memberMatches = (item: Media, selected: string) => {
  if (selected === "Other") return /\bother\b/iu.test(item.name);
  const tagged = item.members.some((member) => member === selected || member.replace(/\s*\(.*/, "") === selected);
  if (tagged) return true;
  const filename = item.name;
  if (selected === "Hwall") return /\bhwall\b/iu.test(filename);
  if (selected === "Haknyeon") return /\bhaknyeon\b/iu.test(filename);
  if (selected === "New") return /\b(new|chanhee)\b/iu.test(filename);
  return false;
};

export function OfficialMedia({ data, onBack }: { data: Archive; onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [shown, setShown] = useState(pageSize);
  const years = useMemo(() => [...new Set(data.media.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a), [data]);
  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return data.media.filter((item) => year === "all" || item.year === Number(year))
      .filter((item) => selectedMembers.every((selected) => memberMatches(item, selected)))
      .filter((item) => !search || [item.name, ...item.members, String(item.date)].join(" ").toLocaleLowerCase().includes(search))
      .sort((a, b) => sort === "newest" ? b.date - a.date : a.date - b.date);
  }, [data, query, selectedMembers, sort, year]);
  const update = (fn: () => void) => { fn(); setShown(pageSize); };
  const sourceUrl = `https://drive.google.com/drive/folders/${encodeURIComponent(data.sourceFolderId)}`;
  const toggleMember = (id: string) => update(() => setSelectedMembers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  return <main id="top" className="official-gallery">
    <header className="masthead">
      <div className="utility"><a className="brand" href="https://tbzarchive.com">THE BOYZ / FAN ARCHIVE</a><nav><span>OFFICIAL_THEBOYZ</span><span>/</span><a href="https://x.com/tbzarchive1206_" target="_blank" rel="noreferrer">TWITTER ↗</a></nav></div>
      <h1><span className="solid">OFFICIAL_THEBOYZ</span><span className="outline">ARCHIVE</span></h1>
      <div className="stats"><p><strong>{data.media.length.toLocaleString("en-US")}</strong> MEDIA FILES</p><i /><p>UPDATED <strong>{new Date(data.generatedAt).toLocaleDateString("en-GB")}</strong></p></div>
    </header>
    <button className="official-back" onClick={onBack}>← ALL PROFILES</button><section className="controls" aria-label="Official Instagram media filters">
      <label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => update(() => setQuery(event.target.value))} type="search" placeholder="SEARCH DATE OR MEMBER..." /></label>
      <div className="filter-row">
        <label>YEAR<select value={year} onChange={(event) => update(() => setYear(event.target.value))}><option value="all">ALL YEARS</option>{years.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>SORT<select value={sort} onChange={(event) => update(() => setSort(event.target.value as "newest" | "oldest"))}><option value="newest">NEWEST FIRST</option><option value="oldest">OLDEST FIRST</option></select></label>
      </div>
      <div className="member-tabs" aria-label="Filter by one or more members"><button className={selectedMembers.length === 0 ? "selected" : ""} onClick={() => update(() => setSelectedMembers([]))}>ALL</button>{members.map(({ id, label }) => <button className={selectedMembers.includes(id) ? "selected" : ""} onClick={() => toggleMember(id)} key={id} aria-pressed={selectedMembers.includes(id)}>{label}</button>)}</div>
    </section>
    <section className="archive-section"><div className="results-head"><p>{results.length.toLocaleString("en-US")} RESULTS · {sort === "newest" ? "NEWEST FIRST" : "OLDEST FIRST"}</p><a href={sourceUrl} target="_blank" rel="noreferrer">OPEN SOURCE FOLDER ↗</a></div>
      {results.length ? <div className="media-grid">{results.slice(0, shown).map((item) => <MediaTile key={item.id} media={item} videoLink />)}</div> : <div className="empty"><strong>NO RESULTS</strong>TRY CHANGING THE SEARCH OR FILTERS.</div>}
      {shown < results.length && <button className="load-more" onClick={() => setShown((value) => value + pageSize)}>LOAD MORE MEDIA ↓</button>}
    </section>
    <footer><a href="https://tbzarchive.com/">← MAIN ARCHIVE</a><a href="#top">BACK TO TOP ↑</a></footer>

  </main>;
}
