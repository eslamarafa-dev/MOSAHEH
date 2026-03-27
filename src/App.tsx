import { useEffect, useMemo, useState, useCallback } from "react";

/* ─── Data ─── */
type Service = {
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
  whatsappText: string;
  popular?: boolean;
};

const whatsappNumber = "201070637470";

const services: Service[] = [
  {
    title: "التدقيق اللغوي",
    description:
      "مراجعة لغوية شاملة للنصوص الأكاديمية والتجارية مع ضبط القواعد والأسلوب والإملاء.",
    price: "1,200",
    icon: "✦",
    features: ["ضبط نحوي وصرفي", "تدقيق إملائي كامل", "تحسين الأسلوب"],
    whatsappText: "أرغب في خدمة التدقيق اللغوي الشهرية",
    popular: true,
  },
  {
    title: "إعادة الصياغة",
    description:
      "إعادة صياغة احترافية تحافظ على المعنى مع تحسين الوضوح والبلاغة والتأثير.",
    price: "500",
    icon: "✎",
    features: ["حفظ المعنى الأصلي", "بلاغة أقوى", "لكل 1000 كلمة"],
    whatsappText: "أرغب في خدمة إعادة الصياغة",
  },
  {
    title: "تحويل PDF إلى Word",
    description:
      "تفريغ دقيق ومنسق من PDF إلى Word مع الحفاظ على بنية المحتوى والجداول.",
    price: "300",
    icon: "⇄",
    features: ["حفظ التنسيق", "دقة عالية", "تسليم سريع"],
    whatsappText: "أرغب في خدمة تحويل PDF إلى Word",
  },
  {
    title: "نسخ المخطوطات",
    description:
      "نسخ ومقابلة المخطوطات بعناية لغوية فائقة وتنسيق مناسب للنشر والطباعة.",
    price: "1,500",
    icon: "⌘",
    features: ["عناية لغوية فائقة", "جاهز للطباعة", "مقابلة دقيقة"],
    whatsappText: "أرغب في خدمة نسخ ومقابلة المخطوطات",
  },
];

const typingWords = [
  "التدقيق اللغوي",
  "إعادة الصياغة",
  "تفريغ PDF إلى Word",
  "نسخ المخطوطات",
];

const makeWhatsAppLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

/* ─── Component ─── */
export default function App() {
  const [typedText, setTypedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  /* Typing effect */
  useEffect(() => {
    const currentWord = typingWords[wordIndex % typingWords.length];
    const speed = isDeleting ? 40 : 85;
    const timeout = setTimeout(() => {
      setTypedText((prev) => {
        if (!isDeleting) {
          const next = currentWord.slice(0, prev.length + 1);
          if (next === currentWord) setTimeout(() => setIsDeleting(true), 1200);
          return next;
        }
        const next = currentWord.slice(0, Math.max(prev.length - 1, 0));
        if (next.length === 0) {
          setIsDeleting(false);
          setWordIndex((idx) => (idx + 1) % typingWords.length);
        }
        return next;
      });
    }, speed);
    return () => clearTimeout(timeout);
  }, [typedText, wordIndex, isDeleting]);

  /* Scroll Reveal + Sticky CTA */
  const handleScroll = useCallback(() => {
    setShowSticky(window.scrollY > 600);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Reveal observer */
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    let observer: IntersectionObserver | null = null;

    if (!prefersReduced) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-visible");
            observer?.unobserve(e.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
      );
      nodes.forEach((el) => observer?.observe(el));
    } else {
      nodes.forEach((el) => el.classList.add("is-visible"));
    }

    /* Sticky CTA scroll listener */
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const stats = useMemo(
    () => [
      { label: "عميل راضٍ", value: "+2,300", icon: "👥" },
      { label: "مشروع مكتمل", value: "+5,000", icon: "📄" },
      { label: "نسبة الرضا", value: "98%", icon: "⭐" },
      { label: "متوسط زمن الرد", value: "5 دقائق", icon: "⚡" },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "كم يستغرق التدقيق اللغوي؟",
        a: "يعتمد على حجم النص. عادةً من 24 إلى 72 ساعة للمشاريع المتوسطة، مع إمكانية الاستعجال.",
      },
      {
        q: "هل يمكنني مراجعة النص بعد التدقيق؟",
        a: "بالتأكيد! نرسل لك النص مع التعديلات المُعلّمة لمراجعتها والموافقة عليها.",
      },
      {
        q: "ما أنواع النصوص التي تدققونها؟",
        a: "نعمل على جميع الأنواع: أكاديمية، تجارية، أدبية، قانونية، وإعلامية.",
      },
    ],
    []
  );

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="noise-overlay relative overflow-hidden bg-[#050505] text-white">
      {/* ── Animated Background ── */}
      <div className="luxury-bg pointer-events-none fixed inset-0 z-0" />

      {/* ── Floating Orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ═══════ HEADER ═══════ */}
      <header className="relative z-10 mx-auto flex w-[min(1200px,92%)] items-center justify-between py-6">
        <a
          href="#"
          className="group text-3xl font-extrabold tracking-wide text-white transition-all duration-300"
        >
          <span className="transition-colors duration-300 group-hover:text-[#f5f5f5]">
            مُصـ
          </span>
          <span className="gold-text-shimmer">ـحّح</span>
        </a>

        <a
          href={makeWhatsAppLink("أرغب في الاستفادة من خصم 10%")}
          className="border-glow rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-2.5 text-sm font-bold text-[#f7d478] transition-all duration-400 hover:border-[#d4af37] hover:bg-[#d4af37]/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          ✨ خصم 10% لفترة محدودة
        </a>
      </header>

      <main className="relative z-10">
        {/* ═══════ HERO ═══════ */}
        <section className="mx-auto grid w-[min(1200px,92%)] items-center gap-16 pb-20 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          {/* ── Content Side ── */}
          <div
            className="reveal-right order-2 space-y-8 lg:order-1"
            data-reveal
          >
            <p className="text-lg font-medium text-[#c8b48a]">
              دقّق رسالتك بإتقان، واستعد للتميز.
            </p>

            <h1 className="text-[2.7rem] leading-[1.15] font-black md:text-[3.5rem]">
              اغتنم الفرصة
              <span className="gold-text-shimmer text-glow mt-3 block">
                مع خدماتنا
              </span>
            </h1>

            <p className="min-h-10 text-xl text-[#f1d58a]">
              خدمة اليوم:{" "}
              <span className="typing-caret font-bold">{typedText}</span>
            </p>

            <ul className="space-y-4 text-lg text-[#f5f5f5]">
              {services.map((item, i) => (
                <li
                  key={item.title}
                  className="reveal flex items-center gap-3"
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="icon-glow inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37]/15 text-sm text-[#d4af37] transition-all duration-300">
                    ✓
                  </span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a
                href={makeWhatsAppLink("أرغب في طلب خدمتي الآن")}
                className="btn-gold cta-pulse inline-flex items-center gap-3 rounded-2xl bg-gradient-to-l from-[#d4a24c] to-[#c8892b] px-10 py-[18px] text-lg font-extrabold text-[#1a1206] transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span>اطلب خدمتك الآن</span>
                <span className="text-xl">←</span>
              </a>

              <div className="text-base leading-loose text-[#e0e0e0]">
                <a
                  className="flex items-center gap-2 transition-colors duration-300 hover:text-[#d4af37]"
                  href="tel:01070637470"
                >
                  <span className="text-[#d4af37]">📞</span> 01070637470
                </a>
                <a
                  className="flex items-center gap-2 transition-colors duration-300 hover:text-[#d4af37]"
                  href="tel:01024000235"
                >
                  <span className="text-[#d4af37]">📞</span> 01024000235
                </a>
              </div>
            </div>
          </div>

          {/* ── Image Side ── */}
          <div
            className="reveal-left relative order-1 lg:order-2"
            data-reveal
          >
            {/* Discount Badge */}
            <div className="badge-float absolute -left-2 top-6 z-20 flex h-[90px] w-[90px] -rotate-12 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#a01030] to-[#7a0c24] text-center font-black shadow-[0_10px_40px_rgba(160,16,48,0.5)] ring-2 ring-white/20 md:-left-4">
              <span className="text-[13px] leading-none text-white/90">
                خصم
              </span>
              <span className="text-[28px] leading-none text-white">10%</span>
            </div>

            {/* Main Image */}
            <div className="glow-card overflow-hidden rounded-[2.2rem] border border-[#d4af37]/30 bg-[#120d08] p-3 shadow-[0_0_60px_rgba(212,162,76,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1100&q=80"
                alt="خدمات مصحح للتدقيق اللغوي"
                className="h-[480px] w-full rounded-[1.8rem] object-cover lg:h-[540px]"
                loading="eager"
              />
            </div>

            {/* Circle Image */}
            <div className="absolute -bottom-6 -right-5 h-36 w-36 overflow-hidden rounded-full border-[5px] border-[#d4af37]/60 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.15)] md:-bottom-8 md:-right-7 md:h-48 md:w-48">
              <img
                src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=500&q=80"
                alt="تحرير نص احترافي"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ── Gold Divider ── */}
        <hr className="gold-divider mx-auto w-[min(1200px,80%)]" />

        {/* ═══════ STATS BAR ═══════ */}
        <section className="mx-auto w-[min(1200px,92%)] py-16">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="reveal-scale glow-card rounded-2xl border border-[#1f1a14] bg-gradient-to-b from-[#0f0c09] to-[#0a0908] p-6 text-center"
                data-reveal
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="mb-2 block text-3xl">{stat.icon}</span>
                <p className="stat-glow text-3xl font-black md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#a0a0a0]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ SERVICES / PRICING ═══════ */}
        <section className="mx-auto w-[min(1200px,92%)] py-16">
          <div className="reveal mb-14 text-center" data-reveal>
            <h2 className="text-3xl font-extrabold md:text-[2.6rem]">
              خدماتنا{" "}
              <span className="gold-text-shimmer text-glow">وأسعارنا</span>
            </h2>
            <p className="mt-4 text-lg text-[#a0a0a0]">
              اختر الخدمة المناسبة واطلبها مباشرة عبر واتساب
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, idx) => (
              <article
                key={service.title}
                className={`reveal card-shine card-topline group rounded-3xl border p-7 transition-all duration-500 hover-lift glow-card ${
                  service.popular
                    ? "border-[#d4af37]/60 bg-gradient-to-b from-[#181208] to-[#0d0b08] shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                    : "border-[#231c12] bg-gradient-to-b from-[#100d09] to-[#0a0908]"
                }`}
                data-reveal
                style={{ transitionDelay: `${Math.min(idx * 90, 360)}ms` }}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="mb-5 inline-block rounded-full bg-gradient-to-l from-[#d4a24c] to-[#c8892b] px-4 py-1.5 text-xs font-bold text-[#1a1206] shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                    ⭐ الأكثر طلباً
                  </div>
                )}

                {/* Icon */}
                <div className="icon-glow mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4af37]/12 text-2xl text-[#d4af37] transition-all duration-400 group-hover:bg-[#d4af37] group-hover:text-[#1a1206] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-[1.4rem] font-extrabold text-[#f5f5f5]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-3 min-h-16 text-[15px] leading-7 text-[#909090]">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mt-5 mb-5 flex items-baseline gap-2">
                  <span className="text-glow text-3xl font-black text-white">
                    {service.price}
                  </span>
                  <span className="text-sm font-semibold text-[#d4af37]">
                    جنيه
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2.5 border-t border-[#1f1a14] pt-5">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-[#b0b0b0]"
                    >
                      <span className="text-xs text-[#d4af37]">◆</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={makeWhatsAppLink(service.whatsappText)}
                  className={`block rounded-xl px-4 py-3.5 text-center text-base font-bold transition-all duration-400 ${
                    service.popular
                      ? "btn-gold bg-gradient-to-l from-[#d4a24c] to-[#c8892b] text-[#1a1206] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]"
                      : "border border-[#d4af37]/40 text-[#f6d786] hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1206] hover:shadow-[0_8px_25px_rgba(212,175,55,0.3)]"
                  }`}
                >
                  اطلب عبر واتساب
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── Gold Divider ── */}
        <hr className="gold-divider mx-auto w-[min(1200px,60%)]" />

        {/* ═══════ BEFORE / AFTER ═══════ */}
        <section className="mx-auto w-[min(1200px,92%)] py-16">
          <div className="reveal mb-12 text-center" data-reveal>
            <h2 className="text-3xl font-extrabold md:text-[2.5rem]">
              الفرق الذي يصنعه{" "}
              <span className="gold-text-shimmer text-glow">مُصحّح</span>
            </h2>
          </div>

          <div
            className="reveal grid gap-8 md:grid-cols-2"
            data-reveal
          >
            {/* Before */}
            <div className="glow-card rounded-3xl border border-red-900/30 bg-gradient-to-b from-[#120808] to-[#0a0706] p-7">
              <div className="mb-4 inline-block rounded-full bg-red-900/30 px-4 py-1.5 text-sm font-bold text-red-400">
                ✗ قبل التدقيق
              </div>
              <p className="text-lg leading-9 text-[#c09090]" dir="rtl">
                ان اللغه العربيه هى من اجمل لغات العالم ، و هى لغة القرأن الكريم
                اللذي نزل على سيدنا محمد صلى الله عليه و سلم ، و يجب علينا ان
                نحافظ عليها لانها هويتنا
              </p>
            </div>

            {/* After */}
            <div className="glow-card rounded-3xl border border-[#d4af37]/30 bg-gradient-to-b from-[#110f08] to-[#0a0908] p-7">
              <div className="mb-4 inline-block rounded-full bg-[#d4af37]/15 px-4 py-1.5 text-sm font-bold text-[#d4af37]">
                ✓ بعد التدقيق
              </div>
              <p className="text-lg leading-9 text-[#d0d0c0]" dir="rtl">
                إنّ اللغة العربية هي من أجمل لغات العالم، وهي لغة القرآن الكريم
                الذي نزل على سيدنا محمد ﷺ، ويجب علينا أن نحافظ عليها؛ لأنها
                هويتنا.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ TRUST / TESTIMONIALS ═══════ */}
        <section className="mx-auto w-[min(1200px,92%)] py-16">
          <div
            className="reveal glow-card rounded-3xl border border-[#241c12] bg-gradient-to-b from-[#0d0a07] to-[#080706] p-8 md:p-12"
            data-reveal
          >
            <h2 className="text-3xl font-extrabold md:text-4xl">
              لماذا يثق العملاء في{" "}
              <span className="gold-text-shimmer">مُصحّح</span>؟
            </h2>

            {/* Testimonials */}
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                {
                  text: "تعاملت مع مصحح في تدقيق رسالة الماجستير. الدقة والاحترافية في أعلى مستوى، وأنصح بهم بشدة.",
                  name: "أحمد محمود",
                  role: "باحث أكاديمي",
                },
                {
                  text: "خدمة سريعة واحترافية. تحويل ملفات PDF إلى Word بجودة ممتازة وتنسيق محفوظ بالكامل.",
                  name: "سارة عبدالله",
                  role: "كاتبة محتوى",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="reveal card-shine rounded-2xl border border-[#1f1a14] bg-[#0c0a08] p-6"
                  data-reveal
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="mb-4 text-4xl text-[#d4af37]/20">"</div>
                  <p className="text-base leading-8 text-[#c8c8c8] italic">
                    {t.text}
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-[#1f1a14] pt-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37]/15 text-lg font-bold text-[#d4af37]">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-sm text-[#808080]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="mb-6 text-2xl font-bold text-white">
                الأسئلة الشائعة
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="reveal rounded-2xl border border-[#1f1a14] bg-[#0c0a08] transition-all duration-400"
                    data-reveal
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between p-5 text-right transition-colors duration-300 hover:bg-[#141210]"
                    >
                      <span className="text-base font-semibold text-white">
                        {faq.q}
                      </span>
                      <span
                        className="text-xl text-[#d4af37] transition-transform duration-400"
                        style={{
                          transform:
                            openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        ▾
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: openFaq === i ? "200px" : "0",
                        opacity: openFaq === i ? 1 : 0,
                      }}
                    >
                      <p className="px-5 pb-5 text-[15px] leading-7 text-[#a0a0a0]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#2a2010] bg-gradient-to-l from-[#130f0a] to-[#0d0b08] p-8 text-center md:flex-row md:text-right">
              <div>
                <p className="text-xl font-bold text-[#f0f0f0]">
                  انطلق الآن واحصل على تدقيق لغوي احترافي
                </p>
                <p className="mt-1 text-sm text-[#808080]">
                  مع خصم الإطلاق — الأماكن محدودة
                </p>
              </div>
              <a
                href={makeWhatsAppLink("أرغب بالبدء فورًا مع مصحح")}
                className="btn-gold cta-pulse shrink-0 rounded-xl bg-gradient-to-l from-[#d4a24c] to-[#c8892b] px-8 py-4 text-lg font-extrabold text-[#1a1206] transition-transform duration-300 hover:-translate-y-1"
              >
                ابدأ عبر واتساب ←
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 mt-10 border-t border-[#1f1a14]">
        <div className="mx-auto flex w-[min(1200px,92%)] flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-right">
          <div>
            <span className="text-xl font-extrabold text-white">
              مُصـ<span className="text-[#d4af37]">ـحّح</span>
            </span>
            <p className="mt-1 text-sm text-[#606060]">
              خدمات التدقيق اللغوي الاحترافية
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#808080]">
            <a
              href="tel:01070637470"
              className="transition-colors duration-300 hover:text-[#d4af37]"
            >
              📞 01070637470
            </a>
            <a
              href="tel:01024000235"
              className="transition-colors duration-300 hover:text-[#d4af37]"
            >
              📞 01024000235
            </a>
            <a
              href={makeWhatsAppLink("مرحباً، أريد الاستفسار عن خدماتكم")}
              className="transition-colors duration-300 hover:text-[#d4af37]"
            >
              💬 واتساب
            </a>
          </div>
          <p className="text-xs text-[#404040]">
            © {new Date().getFullYear()} مصحح — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

      {/* ═══════ STICKY MOBILE CTA ═══════ */}
      <div
        className={`sticky-cta lg:hidden ${showSticky ? "is-shown" : ""}`}
      >
        <a
          href={makeWhatsAppLink("أرغب في طلب خدمتي الآن")}
          className="btn-gold flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-l from-[#d4a24c] to-[#c8892b] py-3.5 text-base font-extrabold text-[#1a1206]"
        >
          <span>اطلب خدمتك الآن</span>
          <span>←</span>
        </a>
      </div>
    </div>
  );
}
