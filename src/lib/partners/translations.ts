import type { Language } from "@/lib/translations"

// Copy for buds.digital (rewritten from /partners at the apex — see
// middleware.ts) — the B2B pitch page for dispensary/vape shop owners. Kept
// separate from the public-site dictionary in @/lib/translations since none
// of these keys are shared with the storefront demo.
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

  // Pre-footer close. ctaHeadline is the bold claim ("live in 24 hours");
  // ctaSubtitle is the White-Glove Onboarding proof underneath it. Optional
  // so a locale can ship the headline alone (see ru/th) without an empty
  // paragraph rendering under it.
  ctaHeadline: string;
  ctaSubtitle?: string;
  ctaButton: string;
}

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  ru: {
    heroTitle: "Полноценная цифровая экосистема для диспансеров",
    heroPills: [
      "Витрина для клиентов",
      "Живое цифровое меню",
      "Автоматизированный CRM для PT.33",
    ],
    heroPillAccent: "⚡ Запуск за 1 день",

    block1Title: "Вот что видит\nваш клиент",
    block2Title: "Вот что видит\nваш персонал",

    ctaLive: "Смотреть живое демо",
    ctaLivePending: "Входим в демо…",
    ctaLiveErrorNotConfigured: "Демо-доступ ещё не настроен. Напишите нам, и мы покажем панель лично.",
    ctaLiveErrorFailed: "Не получилось открыть демо. Попробуйте ещё раз или напишите нам.",

    ctaHeadline: "Ваша цифровая экосистема под ключ — запуск за 24 часа.",
    ctaSubtitle: "Система корпоративного уровня, разворачивается без простоя вашей работы. Пришлите нам меню и брендинг — мы возьмём на себя всю настройку, пока вы занимаетесь бизнесом. Оставляйте заявку.",
    ctaButton: "Написать в WhatsApp",
  },
  en: {
    heroTitle: "The complete digital ecosystem for dispensaries",
    heroPills: [
      "Client storefront",
      "Live digital menu",
      "Automated PT.33 CRM",
    ],
    heroPillAccent: "⚡ Live in 1 day",

    block1Title: "This is what\nyour customer sees",
    block2Title: "This is what\nyour staff sees",

    ctaLive: "See the live demo",
    ctaLivePending: "Signing in to demo…",
    ctaLiveErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
    ctaLiveErrorFailed: "Couldn't open the demo. Try again or message us.",

    ctaHeadline: "Your complete digital ecosystem, operational in 24 hours.",
    ctaSubtitle: "Enterprise-grade system, deployed without downtime. Send us your menu and branding — our team handles the entire setup while you focus on your business. Let's talk.",
    ctaButton: "Message on WhatsApp",
  },
  th: {
    heroTitle: "ระบบดิจิทัลครบวงจรสำหรับร้านจำหน่ายกัญชา",
    heroPills: [
      "หน้าร้านสำหรับลูกค้า",
      "เมนูดิจิทัลแบบเรียลไทม์",
      "ระบบ CRM PT.33 อัตโนมัติ",
    ],
    heroPillAccent: "⚡ พร้อมใช้งานภายใน 1 วัน",

    block1Title: "นี่คือสิ่งที่\nลูกค้าของคุณเห็น",
    block2Title: "นี่คือสิ่งที่\nพนักงานของคุณเห็น",

    ctaLive: "ดูเดโมจริง",
    ctaLivePending: "กำลังเข้าสู่เดโม…",
    ctaLiveErrorNotConfigured: "ยังไม่ได้ตั้งค่าเดโม ทักหาเราแล้วเราจะโชว์แผงควบคุมให้โดยตรง",
    ctaLiveErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",

    ctaHeadline: "ระบบดิจิทัลครบวงจรของคุณ พร้อมใช้งานภายใน 24 ชั่วโมง",
    ctaSubtitle: "ระบบระดับองค์กร ติดตั้งได้โดยไม่กระทบการทำงานของร้าน ส่งเมนูและแบรนด์ของคุณมาให้เรา ทีมงานของเราจะดูแลการตั้งค่าทั้งหมด ขณะที่คุณโฟกัสกับธุรกิจ ทักมาได้เลย",
    ctaButton: "ทักผ่าน WhatsApp",
  },
};
