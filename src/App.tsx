import React, { useMemo, useState, useEffect } from "react";
import { Sun, Moon, Search, ExternalLink, Sparkles, Wand2, NotebookText, Music3, Image, FlaskConical, Boxes, PanelsTopLeft, Rocket, Settings2, Star, StarOff, ChevronLeft } from "lucide-react";

// Material 3-ish tokens
const m3 = {
  shape: { xl: "rounded-3xl", lg: "rounded-2xl", md: "rounded-xl" },
  pad: { section: "px-5 sm:px-8 py-6" },
  elev: {
    1: "shadow-[0_1px_2px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.08)]",
    2: "shadow-[0_2px_6px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]",
    3: "shadow-[0_4px_12px_rgba(0,0,0,0.14),0_2px_4px_rgba(0,0,0,0.10)]",
    4: "shadow-[0_8px_24px_rgba(0,0,0,0.16),0_4px_10px_rgba(0,0,0,0.12)]",
  },
} as const;

// --- Data ---
export type Service = {
  key: string;
  name: string;
  desc: string;
  navDesc?: string;
  url: string;
  icon: React.ComponentType<any>;
  badge: string;
};

const SERVICES: Service[] = [
  { key: "gemini", name: "Gemini", desc: "Чат и инструменты на моделях Gemini.", navDesc: "Чат на Gemini", url: "https://gemini.google.com/", icon: Sparkles, badge: "AI" },
  { key: "opal", name: "Opал", desc: "No‑code конструктор AI‑мини‑приложений.", navDesc: "No‑code мини‑аппы", url: "https://labs.google/experiments/opal", icon: Wand2, badge: "Labs" },
  { key: "notebooklm", name: "NotebookLM", desc: "Идеи, конспекты, авто‑резюме по материалам.", navDesc: "Заметки и конспекты", url: "https://notebooklm.google/", icon: NotebookText, badge: "AI" },
  { key: "searchlabs", name: "Search Labs", desc: "Эксперименты поиска с AI‑функциями.", navDesc: "AI‑поиск", url: "https://labs.google/search", icon: FlaskConical, badge: "Labs" },
  { key: "musicfx", name: "Music FX", desc: "Генерация музыки по описанию.", navDesc: "Музыка из текста", url: "https://labs.google/experiments/music-fx", icon: Music3, badge: "Labs" },
  { key: "imagefx", name: "Image FX", desc: "Генерация и редактирование изображений.", navDesc: "Изображения и правки", url: "https://labs.google/experiments/image-fx", icon: Image, badge: "Labs" },
  { key: "idx", name: "Project IDX", desc: "Облачная среда для веб‑разработки.", navDesc: "Веб‑IDE", url: "https://idx.dev/", icon: PanelsTopLeft, badge: "Dev" },
  { key: "flow", name: "Google Flow", desc: "Визуальные AI‑воркфлоу и агенты.", navDesc: "AI‑воркфлоу", url: "https://labs.google/experiments/flow", icon: Boxes, badge: "Labs" },
  { key: "aistudio", name: "AI Studio", desc: "Песочница и ключи к Gemini API.", navDesc: "API и песочница", url: "https://aistudio.google.com/", icon: Rocket, badge: "Dev" },
];

// --- Small UI primitives (no external UI lib) ---
function Card({ className = "", style, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border rounded-2xl ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}
function CardHeader({ className = "", style, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}
function CardTitle({ className = "", style, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`font-semibold ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}
function CardContent({ className = "", style, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 pt-0 ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}
function Input({ className = "", style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`outline-none w-full ${className}`} style={style} {...rest} />;
}

// Props for ServiceCard (без поля key — чтобы не дублировать React key)
type ServiceCardProps = Omit<Service, "key"> & { onOpen?: () => void; onFav?: () => void; fav?: boolean };

function ServiceCard({ name, desc, url, icon: Icon, badge, onOpen, onFav, fav }: ServiceCardProps) {
  return (
    <Card className={`card-m3 ${m3.shape.lg} ${m3.elev[2]} border-0`} style={{ backgroundColor: "var(--m3-card-surface)", color: "var(--m3-on-surface)" }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className={`h-10 w-10 ${m3.shape.xl} grid place-items-center`} style={{ backgroundColor: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}>
              <Icon className="h-5 w-5" />
            </div>
            <span>{name}</span>
          </CardTitle>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--m3-secondary-container)", color: "var(--m3-on-secondary-container)" }}>{badge}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm min-h-[40px]" style={{ color: "var(--m3-on-surface-variant)" }}>{desc}</p>
        <div className="mt-4 flex items-center gap-2">
          <button className={`btn btn-primary ${m3.shape.md} px-3 py-2 text-sm`} onClick={onOpen} data-testid={`open-${name}`}>Открыть</button>
          <a href={url} target="_blank" rel="noreferrer" className={`btn btn-outlined ${m3.shape.md} px-3 py-2 text-sm`}>В новом окне</a>
          <button onClick={onFav} className={`btn btn-icon ${m3.shape.md} p-2`} title={fav ? "Убрать из избранного" : "В избранное"}>
            {fav ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoogleHub() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Service | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [useTunnel, setUseTunnel] = useState(false);
  const [emphasis, setEmphasis] = useState<boolean>(false);
  const proxyHost = "https://your-proxy.example/open?url=";

  useEffect(() => {
    const savedTunnel = localStorage.getItem("ghub:tunnel");
    if (savedTunnel === "1") setUseTunnel(true);
    const savedTheme = localStorage.getItem("ghub:theme");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    const savedEmph = localStorage.getItem("ghub:emph");
    if (savedEmph === "1") setEmphasis(true);
  }, []);
  useEffect(() => { localStorage.setItem("ghub:tunnel", useTunnel ? "1" : "0"); }, [useTunnel]);
  useEffect(() => { localStorage.setItem("ghub:theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("ghub:emph", emphasis ? "1" : "0"); }, [emphasis]);

  // Простые runtime-проверки вместо тестов
  useEffect(() => {
    SERVICES.forEach((s) => { console.assert(!!s.key && !!s.name && !!s.url, `SERVICE_INVALID:${s.key}`); });
    const keys = SERVICES.map((s) => s.key); const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
    console.assert(dup.length === 0, `DUPLICATE_KEYS:${dup.join(',')}`);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICES;
    return SERVICES.filter((s) => [s.name, s.desc, s.badge].some((t) => t.toLowerCase().includes(q)));
  }, [query]);

  const openService = (s: Service) => setActive(s);
  const closeService = () => setActive(null);
  const isFav = (k: string) => favorites.includes(k);
  const toggleFav = (k: string) => setFavorites((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  const externalUrl = (url: string) => (useTunnel ? `${proxyHost}${encodeURIComponent(url)}` : url);
  console.assert(typeof externalUrl("https://example.com") === "string", "EXTERNAL_URL_RETURN_TYPE");

  return (
    <div className={`theme-${theme}`} data-testid="theme-root" data-emph={emphasis ? "1" : "0"}>
      <StyleBlock />

      <div className="min-h-screen" style={{ backgroundColor: "var(--m3-surface)", color: "var(--m3-on-surface)" }}>
        <header className={`container ${m3.pad.section}` style={{ backgroundColor: "var(--m3-surface)", borderBottom: "1px solid var(--m3-surface-variant)" }}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 ${m3.shape.xl} grid place-items-center`} style={{ backgroundColor: "var(--m3-primary)", color: "var(--m3-on-primary)" }}>G</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Google Hub</h1>
              <p className="text-sm" style={{ color: "var(--m3-on-surface-variant)" }}>Единая панель Google Labs & AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setUseTunnel((v) => !v)} className={`btn btn-tonal ${m3.shape.md} px-3 py-2 text-sm`} data-testid="tunnel-toggle-main" title="Открывать через облачный туннель США">
              {useTunnel ? "Туннель: ON" : "Туннель: OFF"}
            </button>
            <button onClick={() => setEmphasis((v) => !v)} className={`btn btn-outlined ${m3.shape.md} px-3 py-2 text-sm`} title="Сделать эффекты заметнее (Emphasis+)" data-testid="emphasis-toggle">
              Emphasis{emphasis ? "+" : ""}
            </button>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={`btn btn-icon ${m3.shape.md} p-2`} title={theme === "light" ? "Тёмная тема" : "Светлая тема"} data-testid="theme-toggle">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <section className={`container ${m3.pad.section}`>
          <div className={`field flex items-center gap-2 ${m3.shape.lg} ${m3.elev[1]} p-2`}>
            <Search className="h-5 w-5" style={{ color: "var(--m3-on-surface-variant)" }} />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по сервисам и описанию…" className="border-none bg-transparent focus-visible:ring-0" data-testid="search-input" style={{ color: "var(--m3-on-surface)", caretColor: "var(--m3-primary)" }} />
          </div>
          <div className="hidden sm:block text-sm" style={{ color: "var(--m3-on-surface-variant)" }}>
            Подсказка: «Открыть» загрузит сервис на полный экран внутри Хаба.
          </div>
        </section>

        <section className={`container ${m3.pad.section}`>
          {favorites.length > 0 && (
            <div>
              <h2 className="text-sm font-medium mb-2" style={{ color: "var(--m3-on-surface-variant)" }}>Избранные</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="favorites">
                {favorites.map((k) => {
                  const s = SERVICES.find((x) => x.key === k)!;
                  const { key: _omit, ...rest } = s; // убрать key из spread
                  return (
                    <ServiceCard key={`fav-${k}`} {...rest} onOpen={() => openService(s)} onFav={() => toggleFav(k)} fav />
                  );
                })}
              </div>
            </div>
          )}
          <div data-testid="favorites-count" className="hidden">{favorites.length}</div>
        </section>

        <main className={`container ${m3.pad.section}`>
          {filtered.length === 0 ? (
            <p style={{ color: "var(--m3-on-surface-variant)" }}>Ничего не найдено. Попробуйте другое слово.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-view">
              {filtered.map((s) => {
                const { key: _omit, ...rest } = s; // убрать key из spread
                return (
                  <ServiceCard key={s.key} {...rest} onOpen={() => openService(s)} onFav={() => toggleFav(s.key)} fav={isFav(s.key)} />
                );
              })}
            </div>
          )}
          <div data-testid="services-count" className="hidden">{SERVICES.length}</div>
        </main>

        <footer className={`mt-10 container ${m3.pad.section}` style={{ color: "var(--m3-on-surface-variant)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings2 className="h-4 w-4" />
              <span className="text-sm">Material 3 • Fullscreen frames • No-code</span>
            </div>
            <div className="text-sm opacity-80">v1.0</div>
          </div>
        </footer>
      </div>

      {active && (
        <div className="fixed inset-0 z-50" data-testid="overlay" style={{ background: "color-mix(in oklab, black 60%, transparent)" }}>
          <div className={`absolute inset-0 sm:inset-6 grid grid-cols-1 sm:grid-cols-[260px_1fr] overflow-hidden ${m3.shape.lg} ${m3.elev[3]}`} style={{ backgroundColor: "var(--m3-elev-3)" }}>
            <aside className="hidden sm:block h-full overflow-y-auto overscroll-contain p-3 pr-2 nav-rail" style={{ borderRight: "1px solid var(--m3-surface-variant)" }} data-testid="nav-rail">
              <div className="mb-2 text-[10px] uppercase tracking-wide" style={{ color: "var(--m3-on-surface-variant)" }}>Мини‑аппы</div>
              <nav className="grid gap-1">
                {SERVICES.map((s) => {
                  const IconComp = s.icon;
                  const activeCls = active.key === s.key ? " active" : "";
                  return (
                    <button
                      key={`nav-${s.key}`}
                      onClick={() => setActive(s)}
                      className={`nav-item nav-button text-left px-2 py-2 ${m3.shape.md}${activeCls}`}
                      aria-current={active.key === s.key ? "page" : undefined}
                      title={s.name}
                    >
                      <span className="icon-wrap grid place-items-center h-8 w-8 rounded-xl" style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}>
                        <IconComp className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm truncate">{s.name}</span>
                        <span className="block text-[11px] truncate" style={{ color: "var(--m3-on-surface-variant)" }}>{s.navDesc ?? s.desc}</span>
                      </span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--m3-secondary-container)", color: "var(--m3-on-secondary-container)" }}>{s.badge}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <section className="relative h-full grid grid-rows-[auto_1fr]">
              <div className="flex items-center justify-between gap-2 p-3" style={{ borderBottom: "1px solid var(--m3-surface-variant)", background: "var(--m3-elev-2)" }}>
                <div className="flex items-center gap-2">
                  <button className={`btn btn-icon ${m3.shape.md} p-2 h-9 w-9 grid place-items-center`} onClick={closeService} aria-label="Назад" title="Назад" data-testid="back-button">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-sm" style={{ color: "var(--m3-on-surface-variant)" }}>{active.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`btn btn-icon ${m3.shape.md} p-2`} onClick={() => toggleFav(active.key)} title={isFav(active.key) ? "Убрать из избранного" : "В избранное"}>
                    {isFav(active.key) ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </button>
                  <button className={`btn btn-outlined ${m3.shape.md} px-3 py-2 text-sm`} onClick={() => setUseTunnel((v) => !v)} title="Открывать через облачный туннель США" data-testid="tunnel-toggle">
                    {useTunnel ? "Туннель: ON" : "Туннель: OFF"}
                  </button>
                  <a href={externalUrl(active.url)} target="_blank" rel="noreferrer" className={`btn btn-primary ${m3.shape.md} px-3 py-2 text-sm`}>
                    В новом окне
                    <ExternalLink className="ml-2 h-4 w-4 inline" />
                  </a>
                </div>
              </div>

              <div className="h-full w-full" style={{ background: "var(--m3-surface)" }}>
                <iframe title={active.name} src={externalUrl(active.url)} className="h-full w-full" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" />
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function StyleBlock() {
  return (
    <style>{`
      /* --- Material 3 palette & elevations --- */
      :root {
        --m3-primary: #6750A4; --m3-on-primary: #FFFFFF; --m3-primary-container: #EADDFF; --m3-on-primary-container: #21005D;
        --m3-secondary: #625B71; --m3-on-secondary: #FFFFFF; --m3-secondary-container: #E8DEF8; --m3-on-secondary-container: #1D192B;
        --m3-surface: #FFFBFE; --m3-surface-variant: #E7E0EC; --m3-on-surface: #1C1B1F; --m3-on-surface-variant: #49454F;
        --m3-outline: #79747E; --m3-error: #B3261E; --m3-on-error: #FFFFFF;
        --m3-elev-1: #FFFBFE; --m3-elev-2: #FFFBFE; --m3-elev-3: #FFFBFE; --m3-elev-4: #FFFFFF;
        --m3-state-hover: 0.08; --m3-state-press: 0.12; --m3-focus-ring: 2px solid color-mix(in oklab, var(--m3-primary) 60%, transparent);
        --m3-card-surface: var(--m3-elev-2);
      }
      .theme-dark {
        --m3-primary: #D0BCFF; --m3-on-primary: #371E73; --m3-primary-container: #4F378B; --m3-on-primary-container: #EADDFF;
        --m3-secondary: #CCC2DC; --m3-on-secondary: #332D41; --m3-secondary-container: #4A4458; --m3-on-secondary-container: #E8DEF8;
        --m3-surface: #141218; --m3-surface-variant: #49454F; --m3-on-surface: #E6E0E9; --m3-on-surface-variant: #CAC4D0;
        --m3-outline: #938F99; --m3-error: #F2B8B5; --m3-on-error: #601410;
        --m3-elev-1: #1D1B20; --m3-elev-2: #211F26; --m3-elev-3: #26242A; --m3-elev-4: #2B2930;
        --m3-card-surface: var(--m3-elev-2);
      }
      .theme-light {}

      /* --- Base reset & typography --- */
      *,*::before,*::after{box-sizing:border-box}
      html,body,#root{height:100%}
      body{margin:0;font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"; line-height:1.4; background:var(--m3-surface); color:var(--m3-on-surface); -webkit-font-smoothing:antialiased;}
      h1,h2,h3,p{margin:0}
      a{color:inherit;text-decoration:none}
      button{font:inherit}
      .container{max-width:1100px;margin:0 auto}

      /* --- Minimal utility classes (Tailwind-like) --- */
      .min-h-screen{min-height:100vh}
      .hidden{display:none}
      .block{display:block}
      .grid{display:grid}
      .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
      .flex{display:flex}
      .relative{position:relative}
      .absolute{position:absolute}
      .fixed{position:fixed}
      .inset-0{top:0;right:0;bottom:0;left:0}
      .z-50{z-index:50}

      .items-center{align-items:center}
      .justify-between{justify-content:space-between}
      .text-left{text-align:left}
      .uppercase{text-transform:uppercase}
      .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .tracking-wide{letter-spacing:.025em}
      .place-items-center{place-items:center}

      /* spacing */
      .p-2{padding:.5rem}
      .p-3{padding:.75rem}
      .p-4{padding:1rem}
      .px-2{padding-left:.5rem;padding-right:.5rem}
      .px-3{padding-left:.75rem;padding-right:.75rem}
      .px-5{padding-left:1.25rem;padding-right:1.25rem}
      .py-0{padding-top:0;padding-bottom:0}
      .py-2{padding-top:.5rem;padding-bottom:.5rem}
      .py-6{padding-top:1.5rem;padding-bottom:1.5rem}
      .pt-0{padding-top:0}
      .pt-2{padding-top:.5rem}
      .pt-3{padding-top:.75rem}
      .pb-10{padding-bottom:2.5rem}
      .pb-2{padding-bottom:.5rem}
      .pr-2{padding-right:.5rem}
      .mt-4{margin-top:1rem}
      .mb-2{margin-bottom:.5rem}
      .ml-2{margin-left:.5rem}
      .gap-1{gap:.25rem}
      .gap-2{gap:.5rem}
      .gap-3{gap:.75rem}
      .gap-4{gap:1rem}
      .gap-5{gap:1.25rem}

      /* sizing */
      .h-4{height:1rem}.w-4{width:1rem}
      .h-5{height:1.25rem}.w-5{width:1.25rem}
      .h-8{height:2rem}.w-8{width:2rem}
      .h-9{height:2.25rem}.w-9{width:2.25rem}
      .h-10{height:2.5rem}.w-10{width:2.5rem}
      .h-full{height:100%}.w-full{width:100%}
      .min-w-0{min-width:0}

      /* border & radius */
      .border{border:1px solid var(--m3-outline)}
      .border-0{border:0}
      .rounded-xl{border-radius:0.75rem}
      .rounded-2xl{border-radius:1rem}
      .rounded-3xl{border-radius:1.5rem}
      .rounded-full{border-radius:9999px}

      /* text */
      .text-[10px]{font-size:10px}
      .text-xs{font-size:.75rem;line-height:1rem}
      .text-sm{font-size:.875rem;line-height:1.25rem}
      .text-lg{font-size:1.125rem;line-height:1.75rem}
      .text-xl{font-size:1.25rem;line-height:1.75rem}
      .text-2xl{font-size:1.5rem;line-height:2rem}
      .font-medium{font-weight:500}
      .font-semibold{font-weight:600}
      .opacity-80{opacity:.8}
      .min-h-\[40px\]{min-height:40px}

      /* grid templates */
      .sm\:grid-cols-2{grid-template-columns:repeat(1,minmax(0,1fr))}
      .lg\:grid-cols-3{grid-template-columns:repeat(1,minmax(0,1fr))}
      @media (min-width:640px){
        .sm\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
        .sm\:inset-6{top:1.5rem;right:1.5rem;bottom:1.5rem;left:1.5rem}
        .sm\:block{display:block}
        .sm\:text-2xl{font-size:1.5rem;line-height:2rem}
        .sm\:grid-cols-\[1fr\,auto\]{grid-template-columns:1fr auto}
        .sm\:grid-cols-\[260px_1fr\]{grid-template-columns:260px 1fr}
      }
      @media (min-width:1024px){
        .lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
      }

      /* buttons & states */
      [data-emph='1'] { --m3-state-hover: 0.12; --m3-state-press: 0.20; }
      .btn { position: relative; isolation:isolate; transition: box-shadow .18s ease, transform .18s ease; cursor:pointer; }
      .btn::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; z-index:0; }
      .btn > * { position:relative; z-index:1; }
      .btn:hover{ transform: translateY(-1px); }
      .btn:where(:hover):after { background: color-mix(in oklab, currentColor calc(var(--m3-state-hover)*100%), transparent); }
      .btn:where(:active){ transform: translateY(0); }
      .btn:where(:active):after { background: color-mix(in oklab, currentColor calc(var(--m3-state-press)*100%), transparent); }
      .btn:where(:focus-visible) { outline: var(--m3-focus-ring); outline-offset:2px; }
      .btn-primary { background: var(--m3-primary); color: var(--m3-on-primary); box-shadow: none; }
      .btn-tonal { background: var(--m3-secondary-container); color: var(--m3-on-secondary-container); border: 1px solid color-mix(in oklab, var(--m3-on-secondary-container) 12%, transparent); }
      .btn-outlined { background: transparent; color: var(--m3-on-surface); border:1px solid var(--m3-outline); }
      .btn-icon { background: transparent; color: var(--m3-on-surface); border:1px solid var(--m3-outline); }
      [data-emph='1'] .btn-primary { box-shadow: 0 6px 14px rgba(0,0,0,.18); }

      /* cards, fields, nav */
      .card-m3 { background: var(--m3-card-surface); transition: box-shadow .22s ease, transform .22s ease, background-color .22s ease; }
      .card-m3:hover { transform: translateY(-2px); }
      [data-emph='1'] .card-m3:hover { box-shadow: 0 10px 26px rgba(0,0,0,.20); }
      .nav-item { background: transparent; color: var(--m3-on-surface); border-radius: 0.75rem; }
      .nav-item:hover { background: color-mix(in oklab, var(--m3-primary) calc(var(--m3-state-hover)*100%), transparent); }
      .nav-item:active { background: color-mix(in oklab, var(--m3-primary) calc(var(--m3-state-press)*100%), transparent); }
      .nav-item.active { background: color-mix(in oklab, var(--m3-primary) 8%, transparent); }
      .field { background: var(--m3-elev-1); border:1px solid var(--m3-outline); transition: box-shadow .16s ease, border-color .16s ease; width:100%; }
      .field:focus-within { border-color: color-mix(in oklab, var(--m3-primary) 40%, var(--m3-outline)); box-shadow: 0 0 0 2px color-mix(in oklab, var(--m3-primary) 25%, transparent); }
      .nav-rail{ width: 100%; max-width: 260px; overflow-x:hidden; }
      .nav-button{ display:flex; align-items:center; gap:.5rem; height: 3rem; position:relative; width:100%; }
      .nav-button.active{ background: color-mix(in oklab, var(--m3-primary) 8%, transparent); box-shadow: inset 3px 0 0 0 var(--m3-primary); }
      .nav-button:focus-visible{ outline: var(--m3-focus-ring); outline-offset:2px; }
      .nav-rail::-webkit-scrollbar{ width:10px; }
      .nav-rail::-webkit-scrollbar-thumb{ border-radius:999px; background: color-mix(in oklab, var(--m3-on-surface-variant) 30%, transparent); border: 3px solid transparent; background-clip: padding-box; }
      .nav-rail{ scrollbar-color: color-mix(in oklab, var(--m3-on-surface-variant) 30%, transparent) transparent; scrollbar-width: thin; }
    `}</style>
  );
}
