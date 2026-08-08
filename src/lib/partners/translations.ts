import type { Language } from "@/lib/translations"

// Copy for partners.buds.digital — the B2B pitch page for dispensary/vape
// shop owners. Kept separate from the public-site dictionary in
// @/lib/translations since none of these keys are shared with buds.digital.
export interface PartnersDictionary {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;

  block1Title: string;
  block1Cta: string;

  block2Title: string;
  block2Desc: string;
  block2Cta: string;
  block2CtaPending: string;
  block2ErrorNotConfigured: string;
  block2ErrorFailed: string;

  ctaTitle: string;
  ctaButton: string;
}

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  ru: {
    heroBadge: "⚡ Запуск за 1 день",
    heroTitle: "Не просто сайт. Система, на которой держится ваш диспенсари.",
    heroSubtitle: "Статус медицинского допуска · Цифровое меню · Адрес, часы работы и отзывы — полностью по законам Таиланда.",

    block1Title: "Вот что видит\nваш клиент",
    block1Cta: "Открыть живой пример",

    block2Title: "Вот что видит ваш персонал",
    block2Desc: "Продавец вводит имя или номер карты — и за секунду видит, действует ли медицинский допуск и сколько осталось от месячной квоты. Ошибиться невозможно.",
    block2Cta: "Live Demo — открыть панель персонала",
    block2CtaPending: "Входим в демо…",
    block2ErrorNotConfigured: "Демо-доступ ещё не настроен. Напишите нам, и мы покажем панель лично.",
    block2ErrorFailed: "Не получилось открыть демо. Попробуйте ещё раз или напишите нам.",

    ctaTitle: "Хотите такую же систему для своего заведения? Напишите — соберём под ваш бренд за несколько дней.",
    ctaButton: "Написать в WhatsApp",
  },
  en: {
    heroBadge: "⚡ Live in 1 day",
    heroTitle: "Not just a website. The system your dispensary runs on.",
    heroSubtitle: "Medical pass status · Digital menu · Address, hours & reviews — fully compliant with Thai law.",

    block1Title: "This is what\nyour customer sees",
    block1Cta: "See the live example",

    block2Title: "Here's what your staff sees",
    block2Desc: "Staff type in a name or card number and get an instant green-or-red status, plus how much of the monthly quota is left. There's no room for mistakes.",
    block2Cta: "Live Demo — open the staff panel",
    block2CtaPending: "Signing in to demo…",
    block2ErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
    block2ErrorFailed: "Couldn't open the demo. Try again or message us.",

    ctaTitle: "Want the same system for your business? Message me — we'll build it under your brand in a few days.",
    ctaButton: "Message on WhatsApp",
  },
  th: {
    heroBadge: "⚡ พร้อมใช้งานภายใน 1 วัน",
    heroTitle: "ไม่ใช่แค่เว็บไซต์ แต่คือระบบที่ร้านกัญชาของคุณใช้ขับเคลื่อนธุรกิจ",
    heroSubtitle: "สถานะบัตรทางการแพทย์ · เมนูดิจิทัล · ที่อยู่ เวลาทำการ และรีวิว — ถูกต้องตามกฎหมายไทยครบถ้วน",

    block1Title: "นี่คือสิ่งที่ลูกค้าของคุณ\nเห็น",
    block1Cta: "ดูตัวอย่างจริง",

    block2Title: "นี่คือสิ่งที่พนักงานของคุณเห็น",
    block2Desc: "พนักงานพิมพ์ชื่อหรือหมายเลขบัตร แล้วเห็นสถานะสีเขียวหรือแดงทันที พร้อมโควตารายเดือนที่เหลือ ผิดพลาดไม่ได้เลย",
    block2Cta: "Live Demo — เปิดแผงควบคุมพนักงาน",
    block2CtaPending: "กำลังเข้าสู่เดโม…",
    block2ErrorNotConfigured: "ยังไม่ได้ตั้งค่าเดโม ทักหาเราแล้วเราจะโชว์แผงควบคุมให้โดยตรง",
    block2ErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",

    ctaTitle: "สนใจระบบแบบนี้สำหรับร้านของคุณไหม? ทักมาได้เลย เราจะสร้างให้ตรงกับแบรนด์ของคุณภายในไม่กี่วัน",
    ctaButton: "ทักผ่าน WhatsApp",
  },
};
