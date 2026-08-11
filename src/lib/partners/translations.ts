import type { Language } from "@/lib/translations"

// Copy for partners.buds.digital — the B2B pitch page for dispensary/vape
// shop owners. Kept separate from the public-site dictionary in
// @/lib/translations since none of these keys are shared with buds.digital.
export interface PartnersDictionary {
  // Says what the system does for the shop, not what the shop does with the
  // system. This page's job is to earn a demo click, and a promise of benefit
  // does that better than a promise of reliability — which answers an
  // objection and belongs further down, beside the PT.33 claim.
  heroTitle: string;
  // The USP line reads as a row of pills under the H1. heroPillAccent is the
  // single highlighted one and carries the urgency claim that used to sit in a
  // separate badge above the H1 — it lives here instead so the page states it
  // once, not twice.
  //
  // The first pill names the form, not the card: the panel does not check
  // anyone's medical card, it keeps each client's PT.33 prescriptions — issued,
  // valid, expired, revoked — and logs what was dispensed against them. A shop
  // owner reading this page knows what PT.33 is; "med card check" described
  // something the product does not do.
  heroPills: [string, string, string];
  heroPillAccent: string;

  // Blocks 1 and 2 are a deliberate pair — the same surface shown to the two
  // audiences — so their titles stay grammatically parallel in every language.
  block1Title: string;
  block2Title: string;

  // Both blocks share one CTA label: each opens a real, live surface.
  ctaLive: string;
  ctaLivePending: string;
  ctaLiveErrorNotConfigured: string;
  ctaLiveErrorFailed: string;

  ctaTitle: string;
  ctaButton: string;
}

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  ru: {
    heroTitle: "Не просто сайт. Система, которая работает на вас",
    heroPills: [
      "Учёт PT.33",
      "Цифровое меню",
      "Контакты и отзывы",
    ],
    heroPillAccent: "⚡ Запуск за 1 день",

    block1Title: "Вот что видит\nваш клиент",
    block2Title: "Вот что видит\nваш персонал",

    ctaLive: "Смотреть живое демо",
    ctaLivePending: "Входим в демо…",
    ctaLiveErrorNotConfigured: "Демо-доступ ещё не настроен. Напишите нам, и мы покажем панель лично.",
    ctaLiveErrorFailed: "Не получилось открыть демо. Попробуйте ещё раз или напишите нам.",

    ctaTitle: "Ваше заведение, ваш бренд, запуск за день. Оставляйте заявку.",
    ctaButton: "Написать в WhatsApp",
  },
  en: {
    heroTitle: "Not just a website. A system that works for you",
    heroPills: [
      "PT.33 records",
      "Digital menu",
      "Contacts & Reviews",
    ],
    heroPillAccent: "⚡ Live in 1 day",

    block1Title: "This is what\nyour customer sees",
    block2Title: "This is what\nyour staff sees",

    ctaLive: "See the live demo",
    ctaLivePending: "Signing in to demo…",
    ctaLiveErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
    ctaLiveErrorFailed: "Couldn't open the demo. Try again or message us.",

    ctaTitle: "Your shop, your brand, live in a day. Let's talk.",
    ctaButton: "Message on WhatsApp",
  },
  th: {
    heroTitle: "ไม่ใช่แค่เว็บไซต์ แต่คือระบบที่ทำงานให้คุณ",
    heroPills: [
      "ทะเบียน PT.33",
      "เมนูดิจิทัล",
      "ติดต่อและรีวิว",
    ],
    heroPillAccent: "⚡ พร้อมใช้งานภายใน 1 วัน",

    block1Title: "นี่คือสิ่งที่\nลูกค้าของคุณเห็น",
    block2Title: "นี่คือสิ่งที่\nพนักงานของคุณเห็น",

    ctaLive: "ดูเดโมจริง",
    ctaLivePending: "กำลังเข้าสู่เดโม…",
    ctaLiveErrorNotConfigured: "ยังไม่ได้ตั้งค่าเดโม ทักหาเราแล้วเราจะโชว์แผงควบคุมให้โดยตรง",
    ctaLiveErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",

    ctaTitle: "ร้านของคุณ แบรนด์ของคุณ พร้อมใช้งานใน 1 วัน ทักมาได้เลย",
    ctaButton: "ทักผ่าน WhatsApp",
  },
};
