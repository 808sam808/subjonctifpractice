import { useEffect, useMemo, useRef, useState } from "react";

type Person = "je" | "tu" | "il" | "nous" | "vous" | "ils";
type ConjugationMap = Record<Person, string[]>; // allow variants like paie/paye

type Verb = {
  infinitive: string;
  translation: string;
  group: "irregular" | "er" | "ir" | "re";
  subjunctive: ConjugationMap;
  stemHint?: string;
  irregularity?: string;
};

const VERBS: Verb[] = [
  {
    infinitive: "avoir",
    translation: "to have",
    group: "irregular",
    subjunctive: {
      je: ["aie"],
      tu: ["aies"],
      il: ["ait"],
      nous: ["ayons"],
      vous: ["ayez"],
      ils: ["aient"],
    },
    stemHint: "aie- / ay-",
    irregularity: "Completely irregular",
  },
  {
    infinitive: "être",
    translation: "to be",
    group: "irregular",
    subjunctive: {
      je: ["sois"],
      tu: ["sois"],
      il: ["soit"],
      nous: ["soyons"],
      vous: ["soyez"],
      ils: ["soient"],
    },
    stemHint: "soi- / soy-",
    irregularity: "Completely irregular",
  },
  {
    infinitive: "faire",
    translation: "to do / make",
    group: "irregular",
    subjunctive: {
      je: ["fasse"],
      tu: ["fasses"],
      il: ["fasse"],
      nous: ["fassions"],
      vous: ["fassiez"],
      ils: ["fassent"],
    },
    stemHint: "fass-",
    irregularity: "Unique stem",
  },
  {
    infinitive: "aller",
    translation: "to go",
    group: "irregular",
    subjunctive: {
      je: ["aille"],
      tu: ["ailles"],
      il: ["aille"],
      nous: ["allions"],
      vous: ["alliez"],
      ils: ["aillent"],
    },
    stemHint: "aill- / all-",
    irregularity: "Two stems",
  },
  {
    infinitive: "savoir",
    translation: "to know",
    group: "irregular",
    subjunctive: {
      je: ["sache"],
      tu: ["saches"],
      il: ["sache"],
      nous: ["sachions"],
      vous: ["sachiez"],
      ils: ["sachent"],
    },
    stemHint: "sach-",
    irregularity: "Unique stem",
  },
  {
    infinitive: "vouloir",
    translation: "to want",
    group: "irregular",
    subjunctive: {
      je: ["veuille"],
      tu: ["veuilles"],
      il: ["veuille"],
      nous: ["voulions"],
      vous: ["vouliez"],
      ils: ["veuillent"],
    },
    stemHint: "veuill- / voul-",
    irregularity: "Two stems",
  },
  {
    infinitive: "pouvoir",
    translation: "to be able to",
    group: "irregular",
    subjunctive: {
      je: ["puisse"],
      tu: ["puisses"],
      il: ["puisse"],
      nous: ["puissions"],
      vous: ["puissiez"],
      ils: ["puissent"],
    },
    stemHint: "puiss-",
    irregularity: "Unique stem",
  },
  {
    infinitive: "prendre",
    translation: "to take",
    group: "re",
    subjunctive: {
      je: ["prenne"],
      tu: ["prennes"],
      il: ["prenne"],
      nous: ["prenions"],
      vous: ["preniez"],
      ils: ["prennent"],
    },
    stemHint: "prenn- / pren-",
    irregularity: "Two stems",
  },
  {
    infinitive: "venir",
    translation: "to come",
    group: "ir",
    subjunctive: {
      je: ["vienne"],
      tu: ["viennes"],
      il: ["vienne"],
      nous: ["venions"],
      vous: ["veniez"],
      ils: ["viennent"],
    },
    stemHint: "vienn- / ven-",
    irregularity: "Two stems",
  },
  {
    infinitive: "devoir",
    translation: "to have to / must",
    group: "irregular",
    subjunctive: {
      je: ["doive"],
      tu: ["doives"],
      il: ["doive"],
      nous: ["devions"],
      vous: ["deviez"],
      ils: ["doivent"],
    },
    stemHint: "doiv- / dev-",
    irregularity: "Two stems",
  },
  {
    infinitive: "voir",
    translation: "to see",
    group: "irregular",
    subjunctive: {
      je: ["voie"],
      tu: ["voies"],
      il: ["voie"],
      nous: ["voyions"],
      vous: ["voyiez"],
      ils: ["voient"],
    },
    stemHint: "voi- / voy-",
    irregularity: "Two stems",
  },
  {
    infinitive: "croire",
    translation: "to believe",
    group: "re",
    subjunctive: {
      je: ["croie"],
      tu: ["croies"],
      il: ["croie"],
      nous: ["croyions"],
      vous: ["croyiez"],
      ils: ["croient"],
    },
    stemHint: "croi- / croy-",
    irregularity: "Two stems",
  },
  {
    infinitive: "boire",
    translation: "to drink",
    group: "re",
    subjunctive: {
      je: ["boive"],
      tu: ["boives"],
      il: ["boive"],
      nous: ["buvions"],
      vous: ["buviez"],
      ils: ["boivent"],
    },
    stemHint: "boiv- / buv-",
    irregularity: "Two stems",
  },
  {
    infinitive: "envoyer",
    translation: "to send",
    group: "er",
    subjunctive: {
      je: ["envoie"],
      tu: ["envoies"],
      il: ["envoie"],
      nous: ["envoyions"],
      vous: ["envoyiez"],
      ils: ["envoient"],
    },
    stemHint: "envoi- / envoy-",
    irregularity: "y → i stem change",
  },
  {
    infinitive: "appeler",
    translation: "to call",
    group: "er",
    subjunctive: {
      je: ["appelle"],
      tu: ["appelles"],
      il: ["appelle"],
      nous: ["appelions"],
      vous: ["appeliez"],
      ils: ["appellent"],
    },
    stemHint: "appell- / appel-",
    irregularity: "Double l",
  },
  {
    infinitive: "jeter",
    translation: "to throw",
    group: "er",
    subjunctive: {
      je: ["jette"],
      tu: ["jettes"],
      il: ["jette"],
      nous: ["jetions"],
      vous: ["jetiez"],
      ils: ["jettent"],
    },
    stemHint: "jett- / jet-",
    irregularity: "Double t",
  },
  {
    infinitive: "mourir",
    translation: "to die",
    group: "ir",
    subjunctive: {
      je: ["meure"],
      tu: ["meures"],
      il: ["meure"],
      nous: ["mourions"],
      vous: ["mouriez"],
      ils: ["meurent"],
    },
    stemHint: "meur- / mour-",
    irregularity: "Two stems",
  },
  {
    infinitive: "payer",
    translation: "to pay",
    group: "er",
    subjunctive: {
      je: ["paie", "paye"],
      tu: ["paies", "payes"],
      il: ["paie", "paye"],
      nous: ["payions"],
      vous: ["payiez"],
      ils: ["paient", "payent"],
    },
    stemHint: "pai-/pay-",
    irregularity: "Two spellings accepted",
  },
  {
    infinitive: "recevoir",
    translation: "to receive",
    group: "irregular",
    subjunctive: {
      je: ["reçoive"],
      tu: ["reçoives"],
      il: ["reçoive"],
      nous: ["recevions"],
      vous: ["receviez"],
      ils: ["reçoivent"],
    },
    stemHint: "reçoiv- / recev-",
    irregularity: "cedilla + two stems",
  },
  {
    infinitive: "préférer",
    translation: "to prefer",
    group: "er",
    subjunctive: {
      je: ["préfère"],
      tu: ["préfères"],
      il: ["préfère"],
      nous: ["préférions"],
      vous: ["préfériez"],
      ils: ["préfèrent"],
    },
    stemHint: "préfèr- / préfér-",
    irregularity: "Accent change",
  },
];

const PERSONS: { key: Person; label: string; pronoun: string }[] = [
  { key: "je", label: "je", pronoun: "que je" },
  { key: "tu", label: "tu", pronoun: "que tu" },
  { key: "il", label: "il/elle", pronoun: "qu'il/elle" },
  { key: "nous", label: "nous", pronoun: "que nous" },
  { key: "vous", label: "vous", pronoun: "que vous" },
  { key: "ils", label: "ils/elles", pronoun: "qu'ils/elles" },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents for lenient check
    .replace(/[^a-z]/g, "");
}

function isCorrect(user: string, answers: string[]) {
  const u = normalize(user.trim());
  if (!u) return false;
  return answers.some((a) => normalize(a) === u);
}

// Simulated Python backend interface
async function fetchVerbFromBackend(exclude?: string[]): Promise<Verb> {
  // In a real app, this would be: await fetch('/api/verb?exclude=...')
  await new Promise((r) => setTimeout(r, 180)); // simulate latency
  const pool = VERBS.filter((v) => !exclude?.includes(v.infinitive));
  return pool[Math.floor(Math.random() * pool.length)] ?? VERBS[0];
}

async function checkFromBackend(verb: Verb, answers: Record<Person, string>) {
  await new Promise((r) => setTimeout(r, 120));
  const result: Record<Person, { ok: boolean; expected: string[] }> = {
    je: { ok: false, expected: verb.subjunctive.je },
    tu: { ok: false, expected: verb.subjunctive.tu },
    il: { ok: false, expected: verb.subjunctive.il },
    nous: { ok: false, expected: verb.subjunctive.nous },
    vous: { ok: false, expected: verb.subjunctive.vous },
    ils: { ok: false, expected: verb.subjunctive.ils },
  };
  (Object.keys(result) as Person[]).forEach((p) => {
    result[p].ok = isCorrect(answers[p] ?? "", result[p].expected);
  });
  return result;
}

function useStreak() {
  const [streak, setStreak] = useState(() => {
    const s = localStorage.getItem("subj-streak");
    return s ? parseInt(s, 10) : 0;
  });
  const [best, setBest] = useState(() => {
    const b = localStorage.getItem("subj-best");
    return b ? parseInt(b, 10) : 0;
  });
  useEffect(() => {
    localStorage.setItem("subj-streak", String(streak));
    if (streak > best) {
      setBest(streak);
      localStorage.setItem("subj-best", String(streak));
    }
  }, [streak, best]);
  return { streak, setStreak, best };
}

export default function App() {
  const [verb, setVerb] = useState<Verb | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<Person, string>>({
    je: "",
    tu: "",
    il: "",
    nous: "",
    vous: "",
    ils: "",
  });
  const [result, setResult] = useState<ReturnType<typeof checkFromBackend> extends Promise<infer T> ? T | null : null>(null);
  const [showHint, setShowHint] = useState(false);
  const [mode, setMode] = useState<"practice" | "learn">("practice");
  const [history, setHistory] = useState<string[]>([]);
  const inputsRef = useRef<Record<Person, HTMLInputElement | null>>({
    je: null, tu: null, il: null, nous: null, vous: null, ils: null,
  });
  const { streak, setStreak, best } = useStreak();
  const [toast, setToast] = useState<string | null>(null);

  const loadNext = async () => {
    setLoading(true);
    setResult(null);
    setAnswers({ je: "", tu: "", il: "", nous: "", vous: "", ils: "" });
    setShowHint(false);
    const next = await fetchVerbFromBackend(history.slice(-5));
    setVerb(next);
    setLoading(false);
    setTimeout(() => inputsRef.current.je?.focus(), 50);
  };

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allFilled = useMemo(
    () => Object.values(answers).every((v) => v.trim().length > 0),
    [answers]
  );

  const score = useMemo(() => {
    if (!result) return null;
    const correct = Object.values(result).filter((r) => r.ok).length;
    return { correct, total: 6, pct: Math.round((correct / 6) * 100) };
  }, [result]);

  const handleCheck = async () => {
    if (!verb) return;
    const r = await checkFromBackend(verb, answers);
    setResult(r);
    const perfect = Object.values(r).every((x) => x.ok);
    if (perfect) {
      setStreak((s) => s + 1);
      setToast("Parfait ! +1 streak");
      setHistory((h) => [...h, verb.infinitive]);
      setTimeout(() => setToast(null), 1400);
    } else {
      setStreak(0);
    }
  };

  const handleKey = (e: React.KeyboardEvent, person: Person) => {
    if (e.key === "Enter") {
      const idx = PERSONS.findIndex((p) => p.key === person);
      const next = PERSONS[idx + 1];
      if (next) inputsRef.current[next.key]?.focus();
      else if (allFilled) handleCheck();
    }
  };

  const reset = () => {
    setAnswers({ je: "", tu: "", il: "", nous: "", vous: "", ils: "" });
    setResult(null);
    inputsRef.current.je?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-zinc-100 relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vh] w-[70vw] rounded-[40px] border border-white/5" />
      </div>

      <header className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-violet-900/30">
            <span className="text-[11px] font-bold tracking-widest">SUBJ</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Subjonctif · Practice</h1>
            <p className="text-xs text-zinc-400 -mt-0.5">Python backend · React frontend</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400">Streak</span>
            <span className="text-sm font-semibold">{streak}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400">best {best}</span>
          </div>
          <button
            onClick={() => setMode((m) => (m === "practice" ? "learn" : "practice"))}
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs sm:text-[13px] transition"
          >
            {mode === "practice" ? "Learn mode" : "Practice mode"}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start">
          {/* Card: quiz */}
          <section className="rounded-[28px] border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/5 grid place-items-center border border-white/10">
                  <span className="text-[11px] font-mono tracking-widest">FR</span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400">Conjugue au subjonctif présent</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight">
                      {loading ? "…" : verb?.infinitive}
                    </h2>
                    <span className="text-zinc-400 text-sm">— {verb?.translation}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint((s) => !s)}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs transition"
                >
                  {showHint ? "Hide hint" : "Show hint"}
                </button>
                <button
                  onClick={loadNext}
                  className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 px-3 py-1.5 text-xs font-medium shadow-lg shadow-fuchsia-900/20 transition"
                >
                  New verb
                </button>
              </div>
            </div>

            <div className="px-5 sm:px-7 py-5">
              {showHint && verb && (
                <div className="mb-5 grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Stem</p>
                    <p className="text-sm font-medium">{verb.stemHint}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Group</p>
                    <p className="text-sm font-medium capitalize">{verb.group}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Note</p>
                    <p className="text-sm font-medium">{verb.irregularity}</p>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                {PERSONS.map(({ key, pronoun }) => {
                  const state = result?.[key];
                  const val = answers[key];
                  return (
                    <div key={key} className="group relative">
                      <label className="absolute -top-2 left-3 px-1.5 text-[10px] uppercase tracking-widest text-zinc-400 bg-zinc-900/80 backdrop-blur rounded">
                        {pronoun}
                      </label>
                      <div
                        className={[
                          "flex items-center gap-2 rounded-2xl border px-3 py-2.5 bg-zinc-950/60 transition",
                          "border-white/10 group-focus-within:border-violet-500/50",
                          state
                            ? state.ok
                              ? "ring-1 ring-emerald-500/40 border-emerald-500/30"
                              : "ring-1 ring-rose-500/30 border-rose-500/30"
                            : "",
                        ].join(" ")}
                      >
                        <span className="text-zinc-500 text-sm font-mono select-none">→</span>
                        <input
                          ref={(el) => { inputsRef.current[key] = el; }}
                          value={val}
                          onChange={(e) =>
                            setAnswers((a) => ({ ...a, [key]: e.target.value }))
                          }
                          onKeyDown={(e) => handleKey(e, key)}
                          placeholder={mode === "learn" ? verb?.subjunctive[key][0] : "type the form"}
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck={false}
                          className="w-full bg-transparent outline-none text-[15px] placeholder:text-zinc-600"
                        />
                        {state && (
                          <span
                            className={[
                              "text-[11px] px-2 py-0.5 rounded-full border",
                              state.ok
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-300 border-rose-500/20",
                            ].join(" ")}
                          >
                            {state.ok ? "correct" : "try again"}
                          </span>
                        )}
                      </div>
                      {state && !state.ok && (
                        <p className="mt-1.5 text-[12px] text-zinc-400">
                          Expected:{" "}
                          <span className="text-zinc-200 font-medium">
                            {state.expected.join(" / ")}
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCheck}
                  disabled={!allFilled || loading}
                  className="rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium transition"
                >
                  Check answers
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition"
                >
                  Clear
                </button>
                <button
                  onClick={async () => {
                    if (!verb) return;
                    setAnswers({
                      je: verb.subjunctive.je[0],
                      tu: verb.subjunctive.tu[0],
                      il: verb.subjunctive.il[0],
                      nous: verb.subjunctive.nous[0],
                      vous: verb.subjunctive.vous[0],
                      ils: verb.subjunctive.ils[0],
                    });
                    await handleCheck();
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition"
                >
                  Reveal
                </button>

                {score && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                        style={{ width: `${score.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400">
                      {score.correct}/6 · {score.pct}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Card: reference / patterns */}
          <aside className="rounded-[28px] border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-white/5">
              <h3 className="text-sm font-semibold tracking-wide">Subjonctif présent — quick guide</h3>
              <p className="text-xs text-zinc-400">Endings are the same for almost all verbs.</p>
            </div>
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-3 gap-2 text-[13px]">
                {[
                  ["je", "-e"],
                  ["tu", "-es"],
                  ["il/elle", "-e"],
                  ["nous", "-ions"],
                  ["vous", "-iez"],
                  ["ils/elles", "-ent"],
                ].map(([p, e]) => (
                  <div key={p} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 flex items-center justify-between">
                    <span className="text-zinc-400">{p}</span>
                    <span className="font-mono">{e}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">How to build it</p>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-zinc-200">
                  <li>Take <span className="font-medium">ils</span> present: <span className="font-mono">ils prendr<strong>ent</strong></span></li>
                  <li>Remove <span className="font-mono">-ent</span> → stem: <span className="font-mono">prenn-</span></li>
                  <li>Add subjunctive endings: <span className="font-mono">prenne, prennes, prenne…</span></li>
                  <li><span className="font-medium">nous/vous</span> often use the <span className="font-medium">nous</span> present stem: <span className="font-mono">pren-ions, pren-iez</span></li>
                </ol>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 mb-2">Irregulars to master</p>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  {[
                    ["avoir", "aie / ay-"],
                    ["être", "soi- / soy-"],
                    ["aller", "aill- / all-"],
                    ["faire", "fass-"],
                    ["savoir", "sach-"],
                    ["pouvoir", "puiss-"],
                    ["vouloir", "veuill- / voul-"],
                    ["prendre", "prenn- / pren-"],
                  ].map(([v, s]) => (
                    <div key={v} className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2">
                      <span className="text-zinc-300">{v}</span>
                      <span className="font-mono text-zinc-400">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs text-amber-200/90">
                  Tip: The backend (Python) would serve verbs, validate answers, and track SRS intervals. This demo simulates those API calls client-side.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Verb list */}
        <section className="mt-8 rounded-[28px] border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide">Your verb set (20)</h3>
            <p className="text-[11px] text-zinc-400">Click to practice a specific verb</p>
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {VERBS.map((v) => {
                const active = verb?.infinitive === v.infinitive;
                return (
                  <button
                    key={v.infinitive}
                    onClick={async () => {
                      setLoading(true);
                      setResult(null);
                      setAnswers({ je: "", tu: "", il: "", nous: "", vous: "", ils: "" });
                      // simulate backend fetch by id
                      await new Promise((r) => setTimeout(r, 120));
                      setVerb(v);
                      setLoading(false);
                      setTimeout(() => inputsRef.current.je?.focus(), 50);
                    }}
                    className={[
                      "px-3 py-1.5 rounded-full border text-[13px] transition",
                      active
                        ? "bg-white text-zinc-900 border-white"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200",
                    ].join(" ")}
                    title={v.translation}
                  >
                    {v.infinitive}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Toast */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className={[
            "transition-all duration-300",
            toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          {toast && (
            <div className="pointer-events-auto rounded-2xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl px-4 py-2 text-sm text-emerald-200 shadow-lg">
              {toast}
            </div>
          )}
        </div>
      </div>

      {/* footer meta */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-zinc-500">
          <p>Built for subjonctif présent drilling · Simulated Python API: <code className="font-mono">GET /verb</code>, <code className="font-mono">POST /check</code></p>
          <p className="opacity-80">Tip: "il faut que…" triggers the subjunctive.</p>
        </div>
      </footer>
    </div>
  );
}