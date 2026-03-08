// src/App.jsx
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import "./App.css";
import studio1 from "./assets/images/studio/studio1.jpg";
import studio2 from "./assets/images/studio/studio2.jpg";

/** =========================
 *  EmailJS 設定（.env 推奨）
 * ========================= */
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_qze5wxv";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_8ngrqqa";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

/** =========================
 *  Google Analytics 4
 * ========================= */
const GA_ID = "G-64GDLMEYPS";

function trackPageView(path) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, {
    page_path: path,
    page_title: document.title,
  });
}

function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location]);

  return null;
}

/** =========================
 *  画像自動読み込み（年代フォルダ分け）
 *  例: src/assets/images/2026/01.jpg
 * ========================= */
const imageModules = import.meta.glob("./assets/images/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

export const STATEMENT_JA_PARAS = [
  "私の制作の主題は「空間」です。ただし、ここでいう空間は、建物や風景といった物理的な広がりを描写することではありません。私が関心を向けているのは、人が何かを見たときに無意識に行ってしまう判断や意味づけが、いったん静まったときにもなお残っている「場」のあり方です。意味が与えられる前、あるいは意味に回収されきらなかった部分に、どのような知覚が立ち上がるのか。その条件を、絵画という形式で探究しています。",
  "私たちは日常の中で、目の前のものをすぐに言葉にし、価値づけ、理解しようとします。しかし、その理解の枠組みが届かない領域にも、確かに何かが存在しています。それは明確な出来事としては成立せず、善悪や目的といった評価にも定着しません。ただ、可能性として漂い続ける状態です。私はその不確定な状態を、画面上に保とうとしています。",
  "制作においては、特定の物語や象徴を提示することを目的にしていません。色彩や筆致、余白の関係を通して、緊張と静けさが同時に存在する場を構成します。構図は均衡を意識しながらも、完全な調和には閉じません。どこかにわずかなずれや未決の感触を残すことで、観る方の解釈が立ち上がる直前の時間を引き延ばしたいと考えています。",
  "私が大切にしているのは、祈りに近い静けさです。それは特定の宗教性を示すものではなく、自分の意図や主張をできる限り抑えたときに生まれる透明な状態です。描こうとしすぎず、説明しすぎず、判断が入りきらなかった痕跡を消さないこと。その姿勢が、私の制作の基盤になっています。",
  "さまざまな空間を描くとは、多様な場所を再現することではありません。意味の重力が少し緩んだときにあらわれる場の質を、繰り返し異なるかたちで試みることです。完成された答えを示すのではなく、まだ確定していない可能性が静かに存在し続ける場を差し出すこと。それが、私の絵画の目指しているところです。",
];

export const BIOGRAPHY_JA_PARAS = `東京を拠点に活動する美術家。 哲学的思索と絵画制作を往復しながら、「空間」を主題とする作品を発表している。

ここでいう空間とは、建築や風景といった物理的な広がりを描写することではない。人がものを見るときに無意識に行ってしまう判断や意味づけが、いったん静まったときにもなお残る「場」の感触に関心を向けている。明確な出来事やメッセージとして確定する以前の状態、あるいは意味に回収されきらなかった痕跡を、絵画の中でどのように保ちうるかを探究している。

制作は主に抽象絵画。色彩の重なりや筆致の運動、余白の緊張関係を通して、強い物語性に回収されない空間を構成する。完全な調和や結論へと閉じるのではなく、わずかなずれや未決の感触をあえて残すことで、鑑賞者の解釈が立ち上がる直前の時間を引き延ばすことを意図している。作品は、何かを説明するための図像ではなく、見ることの条件そのものを問い直す場として提示される。

思想的背景には、近現代哲学や美学の思考があり、制作と並行して言語化の試みも行っている。絵画を単なる感情表現としてではなく、空間をめぐる思索の実践として位置づけ、理論と制作の双方から検討を重ねている。

主な展示に、2024年 中和ギャラリー（東京）での個展がある。現在も東京を拠点に、空間の在り方をめぐる継続的な制作と発表を行っている。`;

const NEWS_DATA = [
  { date: "2026-03-07", text: "新作シリーズを制作中（それから-after）" },
  { date: "2024-05-23", text: "中和ギャラリー（東京）にて個展を開催しました" },
];

const UPDATE_DATA = [
  { date: "2026-03-07", text: "Top / News のレイアウトを更新しました" },
  { date: "2026-03-06", text: "Biography / Statement の段落構成を調整しました" },
  { date: "2026-03-05", text: "Paintings のサムネイル表示を調整しました" },
];

function formatNewsDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * WORKS を自動生成
 * - year: フォルダ名（4桁年）
 * - title: ファイル名（拡張子除去）
 * - 年代降順 + 年内はファイル名の数値順（01,02,10...）
 */
const WORKS = Object.entries(imageModules)
  .map(([path, src]) => {
    const parts = path.split("/");
    const year = Number(parts[parts.length - 2]);
    const filename = parts[parts.length - 1];
    const title = filename.replace(/\.[^/.]+$/, "");

    return {
      id: path,
      title,
      year: Number.isFinite(year) ? year : 0,
      medium: "Oil on canvas",
      size: "",
      image: src,
    };
  })
  .sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
  });

function clampIndex(i, n) {
  if (n <= 0) return 0;
  return ((i % n) + n) % n;
}

/** =========================
 *  i18n
 * ========================= */
const LangContext = createContext(null);

const I18N = {
  ja: {
    brand: "Con Tadahiro",
    nav: { top: "Top", news: "News", paintings: "Paintings", bio: "Biography", contact: "Contact" },
    top: {
      featured: "Featured Work",
      newsTitle: "News",
      updateTitle: "Update",
      viewAllPaintings: "View all paintings",
      latestWorkText: "最新作を、トップページに表示しています。",
      noWorkText: "作品画像を追加すると、ここに表示されます。",
    },
    news: {
      title: "News",
      updateTitle: "Update",
    },
    paintings: { title: "Paintings" },
    about: {
      title: "Biography",
      statement: "Statement",
      bioText: BIOGRAPHY_JA_PARAS,
      stText: STATEMENT_JA_PARAS,
    },
    contact: {
      title: "Contact",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      hint: "",
      missingKeys: "EmailJSの Service ID / Template ID / Public Key を .env か App.jsx の定数で設定してください。",
      ok: "送信しました。",
      fail:
        "送信に失敗しました。EmailJSテンプレの変数（{{name}}, {{email}}, {{message}}, {{title}}）とフォームの name 属性が一致しているか、To/Reply-to設定を確認してください。",
    },
    footer: "",
    notFound: "Not Found",
    langBtn: "EN",
    langAria: "Switch language to English",
    emptyWorks: "画像がまだありません。src/assets/images/2026/01.jpg のように追加してください。",
  },
  en: {
    brand: "CON Chihiro",
    nav: { top: "Top", news: "News", paintings: "Paintings", bio: "Biography", contact: "Contact" },
    top: {
      featured: "Featured Work",
      newsTitle: "News",
      updateTitle: "Update",
      viewAllPaintings: "View all paintings",
      latestWorkText: "The latest work is shown on the top page.",
      noWorkText: "When you add artwork images, they will appear here.",
    },
    news: {
      title: "News",
      updateTitle: "Update",
    },
    paintings: { title: "Paintings" },
    about: {
      title: "Biography",
      statement: "Statement",
      bioText: "Write your biography here (birth year, location, education, exhibitions, etc.).",
      stText: "Write your statement here (themes, methods, interests, series description, etc.).",
    },
    contact: {
      title: "Contact",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      hint: "",
      missingKeys: "Please set EmailJS Service ID / Template ID / Public Key in .env or App.jsx.",
      ok: "Message sent.",
      fail:
        "Failed to send. Check EmailJS template variables ({{name}}, {{email}}, {{message}}, {{title}}), form name attributes, and To/Reply-to settings.",
    },
    footer: "",
    notFound: "Not Found",
    langBtn: "JA",
    langAria: "日本語に切り替え",
    emptyWorks: "No images yet. Add files like src/assets/images/2026/01.jpg",
  },
};

function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("LangContext not found");
  return ctx;
}

/** =========================
 *  Lightbox
 * ========================= */
const SMOOTH_TWEEN = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

function Lightbox({ work, isOpen, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && work && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={SMOOTH_TWEEN}
        >
          <div className="lightboxBackdrop" onClick={onClose} />

          <button className="lbNav lbPrev" onClick={onPrev} aria-label="Previous">
            ←
          </button>
          <button className="lbNav lbNext" onClick={onNext} aria-label="Next">
            →
          </button>

          <motion.div
            className="lightboxPanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={SMOOTH_TWEEN}
          >
            <motion.img
              src={work.image}
              alt={work.title}
              className="lightboxImg"
              layoutId={`work-image-${work.id}`}
              transition={SMOOTH_TWEEN}
            />
            <div className="lbCaption">
              <div className="lbTitle">{work.title}</div>
              <div className="lbMeta">
                {work.year} · {work.medium}
                {work.size ? ` · ${work.size}` : ""}
              </div>
            </div>

            <button className="lbClose" onClick={onClose} aria-label="Close">
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** =========================
 *  Layout
 * ========================= */
function Header() {
  const { lang, setLang, t } = useLang();
  const linkClass = ({ isActive }) => (isActive ? "navLink navLinkActive" : "navLink");

  const toggleLang = () => setLang(lang === "ja" ? "en" : "ja");

  return (
    <header className="header">
      <div className="headerInner">
        <Link to="/" className="brand">
          {t.brand}
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={linkClass}>
            {t.nav.top}
          </NavLink>
          <NavLink to="/news" className={linkClass}>
            {t.nav.news}
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            {t.nav.paintings}
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            {t.nav.bio}
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            {t.nav.contact}
          </NavLink>
        </nav>

        <button className="langBtn" onClick={toggleLang} aria-label={t.langAria} title={t.langAria}>
          {t.langBtn}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div>© {new Date().getFullYear()} Con Gallery</div>
        <div className="muted">{t.footer}</div>
      </div>
    </footer>
  );
}

function Shell({ children }) {
  return (
    <div className="page">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

/** =========================
 *  Pages
 * ========================= */
function TopPage() {
  const { t } = useLang();
  const featuredWork = WORKS[0];
  const newsItems = useMemo(() => sortByDateDesc(NEWS_DATA), []);
  const updateItems = useMemo(() => sortByDateDesc(UPDATE_DATA), []);

  return (
    <Shell>
      <section className="topHero">
        <div className="container topHeroInner">
          <div className="topHeroImageWrap">
            {featuredWork ? (
              <Link to="/gallery" className="topHeroImageLink" aria-label={`Open ${featuredWork.title}`}>
                <img className="topHeroImage" src={featuredWork.image} alt={featuredWork.title} />
              </Link>
            ) : (
              <div className="topHeroEmpty" />
            )}
          </div>

          <div className="topHeroMeta">
            <div className="topHeroLabel">{t.top.featured}</div>
            {featuredWork ? (
              <>
                <h1 className="topHeroTitle">{featuredWork.title}</h1>
                <div className="topHeroInfo">
                  {featuredWork.year} · {featuredWork.medium}
                  {featuredWork.size ? ` · ${featuredWork.size}` : ""}
                </div>
                <div className="topHeroText">{t.top.latestWorkText}</div>
                <Link to="/gallery" className="textLink">
                  {t.top.viewAllPaintings}
                </Link>
              </>
            ) : (
              <div className="topHeroText">{t.top.noWorkText}</div>
            )}
          </div>
        </div>
      </section>

      <main className="container topMain">
        <section className="topNewsBlock">
          <h2 className="pageTitle">{t.top.newsTitle}</h2>
          <div className="rule" />
          <ul className="newsList">
            {newsItems.map((item, i) => (
              <li key={i} className="newsItem">
                <div className="newsDate">{formatNewsDate(item.date)}</div>
                <div className="newsText">{item.text}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="topNewsBlock">
          <h2 className="pageTitle">{t.top.updateTitle}</h2>
          <div className="rule" />
          <ul className="newsList">
            {updateItems.map((item, i) => (
              <li key={i} className="newsItem">
                <div className="newsDate">{formatNewsDate(item.date)}</div>
                <div className="newsText">{item.text}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Shell>
  );
}

function NewsPage() {
  const { t } = useLang();
  const newsItems = useMemo(() => sortByDateDesc(NEWS_DATA), []);
  const updateItems = useMemo(() => sortByDateDesc(UPDATE_DATA), []);

  return (
    <Shell>
      <main className="container">
        <h1 className="pageTitle">{t.news.title}</h1>
        <div className="rule" />
        <ul className="newsList">
          {newsItems.map((item, i) => (
            <li key={i} className="newsItem">
              <div className="newsDate">{formatNewsDate(item.date)}</div>
              <div className="newsText">{item.text}</div>
            </li>
          ))}
        </ul>

        <div className="aboutSpacer" />

        <h2 className="pageTitle">{t.news.updateTitle}</h2>
        <div className="rule" />
        <ul className="newsList">
          {updateItems.map((item, i) => (
            <li key={i} className="newsItem">
              <div className="newsDate">{formatNewsDate(item.date)}</div>
              <div className="newsText">{item.text}</div>
            </li>
          ))}
        </ul>
      </main>
    </Shell>
  );
}

function GalleryPage() {
  const { t } = useLang();

  const years = useMemo(() => {
    return [...new Set(WORKS.map((w) => w.year))].filter((y) => y).sort((a, b) => b - a);
  }, []);

  const worksByYear = useMemo(() => {
    const m = new Map();
    years.forEach((y) => m.set(y, []));
    WORKS.forEach((w, idx) => {
      if (!m.has(w.year)) m.set(w.year, []);
      m.get(w.year).push({ ...w, _index: idx });
    });
    return m;
  }, [years]);

  const [activeIndex, setActiveIndex] = useState(null);

  const activeWork = useMemo(() => {
    if (activeIndex === null) return null;
    return WORKS[clampIndex(activeIndex, WORKS.length)];
  }, [activeIndex]);

  useEffect(() => {
    if (!activeWork) return;

    trackEvent("view_work", {
      work_title: activeWork.title,
      work_year: String(activeWork.year),
      medium: activeWork.medium,
    });
  }, [activeWork]);

  const openAt = (idx) => {
    const work = WORKS[idx];
    if (work) {
      trackEvent("select_work", {
        work_title: work.title,
        work_year: String(work.year),
        medium: work.medium,
      });
    }
    setActiveIndex(idx);
  };

  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => clampIndex((i ?? 0) - 1, WORKS.length));
  const next = () => setActiveIndex((i) => clampIndex((i ?? 0) + 1, WORKS.length));

  return (
    <Shell>
      <main className="container">
        <h1 className="pageTitle">{t.paintings.title}</h1>
        <div className="rule" />

        {WORKS.length === 0 && <div className="paper">{t.emptyWorks}</div>}

        {years.map((y) => {
          const list = worksByYear.get(y) || [];
          return (
            <section key={y} className="yearSection">
              <div className="yearHead">
                <div className="yearLabel">{y}</div>
                <div className="yearRule" />
              </div>

              <div className="iconGrid" aria-label={`Paintings ${y}`}>
                {list.map((w) => (
                  <button
                    key={w.id}
                    className="iconBtn"
                    onClick={() => openAt(w._index)}
                    aria-label={`Open ${w.title}`}
                  >
                    <motion.img
                      src={w.image}
                      alt={w.title}
                      className="iconImg"
                      layoutId={`work-image-${w.id}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </button>
                ))}
              </div>

              <div className="sectionGap" />
            </section>
          );
        })}

        <Lightbox
          work={activeWork}
          isOpen={activeIndex !== null}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      </main>
    </Shell>
  );
}

function AboutPage() {
  const { t, lang } = useLang();

  const bioParagraphs =
    lang === "ja"
      ? BIOGRAPHY_JA_PARAS.split("\n\n").filter(Boolean)
      : Array.isArray(t.about.bioText)
      ? t.about.bioText
      : [t.about.bioText];

  const statementParagraphs =
    lang === "ja"
      ? STATEMENT_JA_PARAS
      : Array.isArray(t.about.stText)
      ? t.about.stText
      : [t.about.stText];

  return (
    <Shell>
      <main className="container aboutPage">
        <h1 className="pageTitle">{t.about.title}</h1>
        <div className="rule" />

        <section className="aboutSection">
          <div className="aboutText">
            {bioParagraphs.map((para, i) => (
              <p key={i} className="aboutParagraph">
                {para}
              </p>
            ))}
          </div>
        </section>

        <section className="aboutImagesSection" aria-label="Studio views">
          <div className="aboutImagesGrid">
            <figure className="aboutFigure">
              <img src={studio1} alt="制作風景 1" className="aboutStudioImage" />
            </figure>
            <figure className="aboutFigure">
              <img src={studio2} alt="制作風景 2" className="aboutStudioImage" />
            </figure>
          </div>
        </section>

        <div className="aboutSpacer" />

        <h2 className="pageTitle">{t.about.statement}</h2>
        <div className="rule" />

        <section className="aboutSection">
          <div className="aboutText">
            {statementParagraphs.map((para, i) => (
              <p key={i} className="aboutParagraph">
                {para}
              </p>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

function ContactPage() {
  const { t } = useLang();
  const formRef = useRef(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY && !String(EMAILJS_PUBLIC_KEY).startsWith("YOUR_")) {
      try {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      } catch {
        // no-op
      }
    }
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY ||
      String(EMAILJS_PUBLIC_KEY).startsWith("YOUR_")
    ) {
      setStatus({ state: "error", message: t.contact.missingKeys });
      return;
    }

    setStatus({ state: "sending", message: "…" });

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });

      trackEvent("contact_submit_success", {
        form_name: "contact",
        page_path: "/contact",
      });

      setStatus({ state: "success", message: t.contact.ok });
      formRef.current?.reset();
    } catch (err) {
      console.error(err);

      trackEvent("contact_submit_error", {
        form_name: "contact",
        page_path: "/contact",
      });

      setStatus({
        state: "error",
        message: err?.text ? `${t.contact.fail} (${err.text})` : t.contact.fail,
      });
    }
  };

  return (
    <Shell>
      <main className="container">
        <h1 className="pageTitle">{t.contact.title}</h1>
        <div className="rule" />

        <form ref={formRef} className="paper" onSubmit={sendEmail}>
          <input type="hidden" name="title" value="Contact from Con Gallery" />

          <label className="field">
            <div className="label">{t.contact.name}</div>
            <input className="input" name="name" required autoComplete="name" placeholder="Your name" />
          </label>

          <label className="field">
            <div className="label">{t.contact.email}</div>
            <input className="input" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </label>

          <label className="field">
            <div className="label">{t.contact.message}</div>
            <textarea className="input" name="message" rows={7} required placeholder="Write your message..." />
          </label>

          <button className="btn" type="submit" disabled={status.state === "sending"}>
            {status.state === "sending" ? t.contact.sending : t.contact.send}
          </button>

          {status.state !== "idle" && (
            <div className={`status ${status.state === "error" ? "statusError" : "statusOk"}`}>{status.message}</div>
          )}
        </form>

        <div style={{ marginTop: 14 }} className="muted">
          {t.contact.hint}
        </div>
      </main>
    </Shell>
  );
}

/** =========================
 *  App
 * ========================= */
function AppRoutes() {
  const { t } = useLang();

  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="*"
        element={
          <Shell>
            <main className="container">
              <div className="paper">{t.notFound}</div>
            </main>
          </Shell>
        }
      />
    </Routes>
  );
}

export default function App() {
  const [lang, setLang] = useState("ja");

  const t = useMemo(() => I18N[lang] ?? I18N.ja, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <LangContext.Provider value={value}>
      <AnalyticsTracker />
      <AppRoutes />
    </LangContext.Provider>
  );
}