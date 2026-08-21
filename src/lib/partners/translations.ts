import type { Language } from "@/lib/translations"

// Copy for the B2B pitch page, served at buds.digital's own apex ("/" — see
// middleware.ts and app/page.tsx). Kept separate from the public-site
// dictionary in @/lib/translations since none of these keys are shared with
// the storefront demo it links out to (at /demo).
export interface PartnersDictionary {
  // Says what the system is, not what it does for the shop — "one system"
  // is the argument, not a promise of speed. The 72-hour turnaround is
  // deliberately not here: it's stated exactly once on this page, in
  // heroPillAccent below, so a shop owner skimming the page never has to
  // reconcile two different numbers.
  heroTitle: string;
  // White-Glove line: sits between the H1 and the pills, quieter than both —
  // it answers "what do I have to do", not "what is this".
  whiteGloveLine: string;
  // The USP line reads as a row of pills under the H1. heroPillAccent is the
  // single highlighted one and is the one place on the page that states the
  // turnaround time — see heroTitle above.
  //
  // The first pill names the form, not the card: the panel does not check
  // anyone's medical card, it keeps each client's PT.33 prescriptions — issued,
  // valid, expired, revoked — and logs what was dispensed against them. A shop
  // owner reading this page knows what PT.33 is; "med card check" described
  // something the product does not do.
  heroPills: [string, string, string];
  heroPillAccent: string;

  // Block 01 — the PT.33 panel, the compliance record the shop is actually
  // buying. blockPt33Title is built around record-keeping, not "here's what
  // your staff sees" (that framing undersold it — see the ТЗ's audit note
  // for /staff, part 3: the exact wording here is a placeholder until that
  // audit settles what the client card itself says). blockPt33Subtitle is
  // fixed copy, not blocked on that audit.
  blockPt33Title: string;
  blockPt33Subtitle: string;

  // Block 02 — the client-facing storefront the same system also ships.
  blockStorefrontTitle: string;

  // Both blocks share one CTA label: each opens a real, live surface.
  ctaLive: string;
  ctaLivePending: string;
  ctaLiveErrorNotConfigured: string;
  ctaLiveErrorFailed: string;
  // Small print under each demo CTA — sets expectations before the click.
  demoSampleNote: string;

  // Trust block, just above the final CTA: who built this, a portfolio link
  // signed with the agency name (never the bare domain), the 72-hour
  // guarantee, and a plain checklist of what's included. Deliberately no
  // photos, names, or invented experience/project-count figures.
  trustLocation: string;
  trustPortfolioLabel: string;
  trustGuarantee: string;
  trustChecklistTitle: string;
  trustChecklistItems: string[];

  // Final CTA. ctaHeadline + ctaSubtitle are the ask; ctaButton (WhatsApp)
  // and ctaButtonLine (LINE) are how to answer it. pricingLine/pricingNote
  // are placeholder figures — swap for real numbers before release.
  ctaHeadline: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaButtonLine: string;
  pricingLine: string;
  pricingNote: string;

  footerPrivacy: string;
}

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  ru: {
    heroTitle: "Витрина, живое меню и учёт PT.33 — одна система.",
    whiteGloveLine: "Пришлите нам меню и фото — остальное сделаем мы.",
    heroPills: [
      "Витрина для клиентов",
      "Живое цифровое меню",
      "CRM-система для PT.33",
    ],
    heroPillAccent: "⚡ Запуск за 72 часа",

    blockPt33Title: "Каждая продажа —\nпод учётом.",
    blockPt33Subtitle: "Каждый клиент, каждый рецепт, каждая продажа — в системе. На всякий случай.",

    blockStorefrontTitle: "Вот что видит\nваш клиент",

    ctaLive: "Смотреть живое демо",
    ctaLivePending: "Входим в демо…",
    ctaLiveErrorNotConfigured: "Демо-доступ ещё не настроен. Напишите нам, и мы покажем панель лично.",
    ctaLiveErrorFailed: "Не получилось открыть демо. Попробуйте ещё раз или напишите нам.",
    demoSampleNote: "Живое демо с тестовыми данными.",

    trustLocation: "FT.Agency — Пхукет",
    trustPortfolioLabel: "FT.Agency",
    trustGuarantee: "Не запустились за 72 часа? Настройка — бесплатно.",
    trustChecklistTitle: "Что входит",
    trustChecklistItems: [
      "Публичная витрина с вашим брендингом",
      "Живое цифровое меню — обновляете сами",
      "Панель PT.33 для клиентов и продаж",
      "Каталог товаров, загруженный и готовый к работе",
      "Обучение персонала",
    ],

    ctaHeadline: "Пришлите меню. Через 72 часа вы в сети.",
    ctaSubtitle: "Мы соберём витрину, загрузим товары и настроим панель PT.33. Вы продолжаете работать — ничего не отключается.",
    ctaButton: "Написать в WhatsApp",
    ctaButtonLine: "LINE",
    pricingLine: "От ฿12,000 за настройку + ฿2,900/мес.",
    pricingNote: "В настройку входят меню, брендинг и обучение персонала.",

    footerPrivacy: "Конфиденциальность",
  },
  en: {
    heroTitle: "Storefront, live menu and PT.33 records — one system.",
    whiteGloveLine: "Send us your menu and photos — we do the rest.",
    heroPills: [
      "Client storefront",
      "Live digital menu",
      "Automated PT.33 CRM",
    ],
    heroPillAccent: "⚡ Live in 72 hours",

    blockPt33Title: "Every sale,\naccounted for.",
    blockPt33Subtitle: "Every client, every prescription, every sale — on record. Just in case.",

    blockStorefrontTitle: "This is what\nyour customer sees",

    ctaLive: "See the live demo",
    ctaLivePending: "Signing in to demo…",
    ctaLiveErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
    ctaLiveErrorFailed: "Couldn't open the demo. Try again or message us.",
    demoSampleNote: "Live demo with sample data.",

    trustLocation: "FT.Agency — Phuket",
    trustPortfolioLabel: "FT.Agency",
    trustGuarantee: "Not live in 72 hours? The setup is free.",
    trustChecklistTitle: "What you get",
    trustChecklistItems: [
      "A public storefront with your branding",
      "A live digital menu you update yourself",
      "The PT.33 client & sales panel",
      "Your product catalog loaded and ready",
      "A staff training walkthrough",
    ],

    ctaHeadline: "Send us your menu. In 72 hours you're live.",
    ctaSubtitle: "We build your storefront, load your products and set up the PT.33 panel. You keep working — nothing goes down.",
    ctaButton: "Message on WhatsApp",
    ctaButtonLine: "LINE",
    pricingLine: "From ฿12,000 setup + ฿2,900/month",
    pricingNote: "Setup includes menu, branding and staff training.",

    footerPrivacy: "Privacy",
  },
  th: {
    heroTitle: "หน้าร้าน เมนูสด และระบบบันทึก PT.33 — ในระบบเดียว",
    whiteGloveLine: "ส่งเมนูและรูปภาพมาให้เรา ที่เหลือเราจัดการให้",
    heroPills: [
      "หน้าร้านสำหรับลูกค้า",
      "เมนูดิจิทัลแบบเรียลไทม์",
      "ระบบ CRM PT.33 อัตโนมัติ",
    ],
    heroPillAccent: "⚡ พร้อมใช้งานภายใน 72 ชั่วโมง",

    blockPt33Title: "ทุกการขาย\nถูกบันทึกไว้ครบ",
    blockPt33Subtitle: "ลูกค้าทุกคน ใบสั่งยาทุกใบ การขายทุกครั้ง — บันทึกไว้ครบ เผื่อไว้ก่อน",

    blockStorefrontTitle: "นี่คือสิ่งที่\nลูกค้าของคุณเห็น",

    ctaLive: "ดูเดโมจริง",
    ctaLivePending: "กำลังเข้าสู่เดโม…",
    ctaLiveErrorNotConfigured: "ยังไม่ได้ตั้งค่าเดโม ทักหาเราแล้วเราจะโชว์แผงควบคุมให้โดยตรง",
    ctaLiveErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",
    demoSampleNote: "เดโมจริงพร้อมข้อมูลตัวอย่าง",

    trustLocation: "FT.Agency — ภูเก็ต",
    trustPortfolioLabel: "FT.Agency",
    trustGuarantee: "ไม่พร้อมใช้งานภายใน 72 ชั่วโมง? เราติดตั้งให้ฟรี",
    trustChecklistTitle: "สิ่งที่คุณจะได้รับ",
    trustChecklistItems: [
      "หน้าร้านสาธารณะพร้อมแบรนด์ของคุณ",
      "เมนูดิจิทัลแบบเรียลไทม์ที่คุณอัปเดตเองได้",
      "แผง PT.33 สำหรับลูกค้าและการขาย",
      "แคตตาล็อกสินค้าที่โหลดพร้อมใช้งาน",
      "อบรมการใช้งานให้พนักงาน",
    ],

    ctaHeadline: "ส่งเมนูมาให้เรา ภายใน 72 ชั่วโมงคุณพร้อมใช้งาน",
    ctaSubtitle: "เราจะสร้างหน้าร้าน โหลดสินค้า และตั้งค่าแผง PT.33 ให้คุณ ร้านของคุณทำงานต่อได้ตามปกติ ไม่มีการหยุดชะงัก",
    ctaButton: "ทักผ่าน WhatsApp",
    ctaButtonLine: "LINE",
    pricingLine: "เริ่มต้น ฿12,000 ค่าติดตั้ง + ฿2,900/เดือน",
    pricingNote: "ค่าติดตั้งรวมเมนู แบรนด์ และการอบรมพนักงาน",

    footerPrivacy: "ความเป็นส่วนตัว",
  },
};
