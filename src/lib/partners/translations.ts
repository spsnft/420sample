import type { Language } from "@/lib/translations"

// Copy for partners.buds.digital — the B2B pitch page for dispensary/vape
// shop owners. Kept separate from the public-site dictionary in
// @/lib/translations since none of these keys are shared with buds.digital.
export interface PartnersDictionary {
  heroTitle: string;
  // The USP line reads as a row of pills under the H1. heroPillAccent is the
  // single highlighted one and carries the urgency claim that used to sit in a
  // separate badge above the H1 — it lives here instead so the page states it
  // once, not twice.
  heroPills: [string, string, string, string];
  heroPillAccent: string;

  // Blocks 1 and 2 are a deliberate pair — the same surface shown to the two
  // audiences — so their titles stay grammatically parallel in every language.
  block1Title: string;
  block2Title: string;
  block2Desc: string;

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
    heroTitle: "Не просто сайт. Система, на которой держится ваш диспенсари.",
    heroPills: [
      "Статус мед. допуска",
      "Цифровое меню",
      "Контакты и отзывы",
      "По законам Таиланда",
    ],
    heroPillAccent: "⚡ Запуск за 1 день",

    block1Title: "Вот что видит\nваш клиент",
    block2Title: "Вот что видит\nваш персонал",
    block2Desc: "Продавец вводит имя или номер карты — и за секунду видит, действует ли медицинский допуск и сколько осталось от месячной квоты. Ошибиться невозможно.",

    ctaLive: "Смотреть живое демо",
    ctaLivePending: "Входим в демо…",
    ctaLiveErrorNotConfigured: "Демо-доступ ещё не настроен. Напишите нам, и мы покажем панель лично.",
    ctaLiveErrorFailed: "Не получилось открыть демо. Попробуйте ещё раз или напишите нам.",

    ctaTitle: "Хотите такую же систему для своего заведения? Напишите — соберём под ваш бренд за несколько дней.",
    ctaButton: "Написать в WhatsApp",
  },
  en: {
    heroTitle: "Not just a website. The system your dispensary runs on.",
    heroPills: [
      "Medical pass status",
      "Digital menu",
      "Contacts & Reviews",
      "TH law compliant",
    ],
    heroPillAccent: "⚡ Live in 1 day",

    block1Title: "This is what\nyour customer sees",
    block2Title: "This is what\nyour staff sees",
    block2Desc: "Staff type in a name or card number and get an instant green-or-red status, plus how much of the monthly quota is left. There's no room for mistakes.",

    ctaLive: "See the live demo",
    ctaLivePending: "Signing in to demo…",
    ctaLiveErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
    ctaLiveErrorFailed: "Couldn't open the demo. Try again or message us.",

    ctaTitle: "Want the same system for your business? Message me — we'll build it under your brand in a few days.",
    ctaButton: "Message on WhatsApp",
  },
  th: {
    heroTitle: "ไม่ใช่แค่เว็บไซต์ แต่คือระบบที่ร้านกัญชาของคุณใช้ขับเคลื่อนธุรกิจ",
    heroPills: [
      "สถานะบัตรทางการแพทย์",
      "เมนูดิจิทัล",
      "ติดต่อและรีวิว",
      "ถูกต้องตามกฎหมายไทย",
    ],
    heroPillAccent: "⚡ พร้อมใช้งานภายใน 1 วัน",

    block1Title: "นี่คือสิ่งที่\nลูกค้าของคุณเห็น",
    block2Title: "นี่คือสิ่งที่\nพนักงานของคุณเห็น",
    block2Desc: "พนักงานพิมพ์ชื่อหรือหมายเลขบัตร แล้วเห็นสถานะสีเขียวหรือแดงทันที พร้อมโควตารายเดือนที่เหลือ ผิดพลาดไม่ได้เลย",

    ctaLive: "ดูเดโมจริง",
    ctaLivePending: "กำลังเข้าสู่เดโม…",
    ctaLiveErrorNotConfigured: "ยังไม่ได้ตั้งค่าเดโม ทักหาเราแล้วเราจะโชว์แผงควบคุมให้โดยตรง",
    ctaLiveErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",

    ctaTitle: "สนใจระบบแบบนี้สำหรับร้านของคุณไหม? ทักมาได้เลย เราจะสร้างให้ตรงกับแบรนด์ของคุณภายในไม่กี่วัน",
    ctaButton: "ทักผ่าน WhatsApp",
  },
};
