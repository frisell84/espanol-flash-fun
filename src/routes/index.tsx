import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { words, categories, type Word } from "@/data/words";
import { useAmbientMusic } from "@/hooks/use-ambient-music";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flashkort Spanska – 500 vanliga ord för nybörjare" },
      {
        name: "description",
        content:
          "Lär dig spanska med vackra flashkort. Över 500 vanliga nybörjarord i 13 kategorier, med progress och repetition.",
      },
      { property: "og:title", content: "Flashkort Spanska – 500 vanliga ord" },
      {
        property: "og:description",
        content: "Vänd korten, lär dig 500 vanliga spanska ord med svensk översättning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const ALL = "Alla ord";

function Index() {
  const [category, setCategory] = useState(ALL);
  const [deck, setDeck] = useState<Word[]>([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState(0);
  const [esFirst, setEsFirst] = useState(true);
  const { playing, toggle } = useAmbientMusic();

  const pool = useMemo(
    () => (category === ALL ? words : words.filter((w) => w.cat === category)),
    [category],
  );

  useEffect(() => {
    setDeck(shuffle(pool));
    setI(0);
    setFlipped(false);
    setKnown(0);
    setReview(0);
  }, [pool]);

  const card = deck[i];
  const done = deck.length > 0 && i >= deck.length;

  function next(ok: boolean) {
    if (ok) setKnown((n) => n + 1);
    else setReview((n) => n + 1);
    setFlipped(false);
    setTimeout(() => setI((n) => n + 1), 160);
  }

  function restart() {
    setDeck(shuffle(pool));
    setI(0);
    setFlipped(false);
    setKnown(0);
    setReview(0);
  }

  const progress = deck.length ? Math.min(i / deck.length, 1) * 100 : 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10">
      <header className="text-center">
        <div className="flex items-center justify-center gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Español · Nivå A1
          </p>
          <button
            onClick={toggle}
            aria-label={playing ? "Stäng av musik" : "Spela musik"}
            className="rounded-full border border-border bg-card p-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            title={playing ? "Stäng av musik" : "Spela lugn musik"}
          >
            {playing ? "🔊" : "🔇"}
          </button>
        </div>
        <h1 className="mt-3 text-5xl leading-none text-foreground sm:text-6xl">
          Flashkort <span className="text-primary">Spanska</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {words.length} vanliga ord · {categories.length} kategorier
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {[ALL, ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
              c === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            Kort {Math.min(i + 1, deck.length)} av {deck.length}
          </span>
          <span>
            ✓ {known} · ↻ {review}
          </span>
        </div>
      </div>

      {done ? (
        <section className="mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
          <h2 className="text-4xl">¡Muy bien!</h2>
          <p className="mt-3 text-muted-foreground">
            Du klarade {known} av {deck.length} kort.
          </p>
          <button
            onClick={restart}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            Kör igen
          </button>
        </section>
      ) : (
        card && (
          <>
            <div
              className="flip-scene mt-8 h-72 w-full cursor-pointer select-none sm:h-80"
              onClick={() => setFlipped((f) => !f)}
            >
              <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
                <div className="card-face card-front">
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                    {esFirst ? "Español" : "Svenska"}
                  </span>
                  <p className="font-display mt-4 text-5xl leading-tight sm:text-6xl">
                    {esFirst ? card.es : card.sv}
                  </p>
                  <span className="mt-6 text-xs text-muted-foreground">{card.cat}</span>
                </div>
                <div className="card-face card-back">
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] opacity-70">
                    {esFirst ? "Svenska" : "Español"}
                  </span>
                  <p className="font-display mt-4 text-5xl leading-tight sm:text-6xl">
                    {esFirst ? card.sv : card.es}
                  </p>
                  <span className="mt-6 text-xs opacity-70">Tryck för att vända</span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                onClick={() => next(false)}
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60"
              >
                ↻ Öva mer
              </button>
              <button
                onClick={() => setFlipped((f) => !f)}
                className="rounded-full bg-sun px-6 py-3 text-sm font-medium text-sun-foreground transition-transform hover:scale-105"
              >
                Vänd
              </button>
              <button
                onClick={() => next(true)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
              >
                Nästa
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
              <button onClick={() => setEsFirst((v) => !v)} className="underline-offset-4 hover:underline">
                Byt riktning ({esFirst ? "ES → SV" : "SV → ES"})
              </button>
              <button onClick={restart} className="underline-offset-4 hover:underline">
                Blanda om
              </button>
            </div>
          </>
        )
      )}

      <footer className="mt-auto pt-12 text-center text-xs text-muted-foreground">
        Hecho con cariño · öva lite varje dag
      </footer>
    </main>
  );
}
