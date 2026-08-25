import type { Language } from "@/lib/translations"
import { partnersPricing as P } from "@/lib/partners/pricing"

// Copy for the B2B pitch page, served at buds.digital's own apex ("/" — see
// middleware.ts and app/page.tsx). Kept separate from the public-site
// dictionary in @/lib/translations since none of these keys are shared with
// the storefront demo it links out to (at /demo).
export interface PartnersDictionary {
  // Says what the system is, not what it does for the shop — "already
  // built" is the argument, not a promise of speed. No turnaround time
  // appears on the page at all: it's mentioned exactly once, in the FAQ,
  // as an observation rather than a commitment.
  heroTitle: string;
  // Subtitle: sits between the H1 and the price line, quieter than both.
  // The H1 says the system is ready; this line names the three parts of it
  // and sends the reader into the demo.
  heroSubtitle: string;
  // Replaces the old two-pill row (ТЗ rewrite pitch-page §2.1): a single
  // small, muted, letter-spaced line under the subtitle. No "From"/"от" —
  // deliberate, see the dictionaries below. No standalone CTA here either:
  // blocks 01/02 already carry the two real ones, and a third, generic
  // button here would only blur which of them to press.
  heroPriceLine: string;

  // Block 01 — the PT.33 panel, the compliance record the shop is actually
  // buying, so it leads. Headings are the client's approved "set A" — see
  // ТЗ №2 M1.
  blockPt33Title: string;
  blockPt33Subtitle: string;

  // Block 02 — the client-facing storefront the same system also ships.
  // Presents the storefront as a surface ("already open"), not the price
  // sync as a feature — see rewrite ТЗ §4.
  blockStorefrontTitle: string;
  blockStorefrontSubtitle: string;

  // Block 01's CTA opens the /staff demo login (a form, so it needs its own
  // pending/error copy); block 02's opens /demo, a plain link with neither.
  // Split into two key-pairs (ТЗ rewrite §3) since the labels now name what
  // each block actually opens instead of sharing one generic "live system"
  // label.
  ctaStaff: string;
  ctaStaffPending: string;
  ctaStaffErrorNotConfigured: string;
  ctaStaffErrorFailed: string;
  ctaMenu: string;

  offerTitle: string;
  // NEW (ТЗ-4 §4.3): small-caps eyebrow above the price, replacing the old
  // offerPriceNote ("we're setting up the first shops one at a time…") —
  // same claim (launch pricing, a deadline), compressed to a label instead
  // of a sentence. Applies only to the setup price, never to the
  // subscription. ТЗ-6 §3 dropped the "first five shops" half of the claim
  // entirely (here and everywhere else on the page, all locales) — a shop
  // count isn't something the reader can verify, unlike the date, and
  // leaving it in read as a number they had to take on faith.
  offerPriceEyebrow: string;
  // Standalone price block — the page's one moment of decision gets its own
  // typographic weight instead of living as a clause inside a paragraph.
  // offerPriceNow is the number the whole block exists to show;
  // offerPriceWas is struck through beside it. offerPriceMonthly moved into
  // its own section (ТЗ-5 §3, see subscriptionEyebrow below) rather than
  // sitting directly under the setup price — the two are separate
  // obligations, one-time and standing, and typesetting them as one block
  // read as if the subscription were a detail of the setup purchase.
  offerPriceNow: string;
  offerPriceWas: string;
  offerPriceMonthly: string;
  // The page's one guarantee (the old 50/50 split) — bold, body-text size,
  // right under the price where a reader is actually weighing the risk
  // (ТЗ rewrite §5.5, position confirmed unchanged by ТЗ-4 §4.4). The old
  // second sentence ("nothing on your side switches off while we build")
  // is gone — ТЗ-4 §4.4: unclear what it referred to, and at this point in
  // the pitch the reader has nothing running yet to switch off. ТЗ-6 §4
  // also dropped "...and you've looked at it yourself" from the end: it
  // gave the reader a pretext to stall the second half indefinitely ("I
  // haven't looked yet"), where "when it's running" alone is already an
  // objectively checkable condition and needs no witness clause.
  guaranteeLine: string;
  // Second guarantee line, same weight as guaranteeLine directly above it —
  // a timeline commitment (7 days) alongside the existing payment one.
  liveInDaysLine: string;

  includedTitle: string;
  includedItems: string[];

  // Add-on price list. A separate shape from includedItems because the
  // price is right-aligned and is not part of the label string. Title
  // reads "Optional extras" now (ТЗ-4 §4.8) — the old "Add if you need it"
  // repeated "if" once as the section label and again in its own first
  // row's copy. Row order also changed: one-off/small-recurring work first,
  // the second shop (the biggest single line item) last. Opens its own
  // section now (ТЗ-5 §3) — the third of three, after setup and
  // subscription, behind a visible divider.
  addonsTitle: string;
  addonsItems: { label: string; price: string }[];

  // The price block's second section (ТЗ-5 §3): a standing obligation
  // (฿2,400/month, forever) was previously typeset as a footnote under the
  // one-time ฿9,000, reading as a detail of the setup purchase rather than
  // a second, separate commitment. subscriptionEyebrow ("Then, every
  // month") is what lets offerPriceMonthly sit in its own section, set at
  // the same weight as offerPriceNow, without the number looking orphaned —
  // the word "then" is what tells the reader everything above was one-time.
  // subscriptionLine now opens with "Covers…" rather than repeating the
  // price, since the price is now the heading directly above it, not a
  // clause the sentence needs to reintroduce. subscriptionYearlyLine
  // (ТЗ-6 §5) dropped "Two months off" — it and the ฿ savings figure said
  // the same thing twice, so only the number (computed from P.annualSavings,
  // never hardcoded) stays. "Locked: shops that come in now keep ฿2,400…" stays gone —
  // that promise was aimed at the market, not this reader, and it named a
  // rate that doesn't otherwise appear on the page.
  subscriptionEyebrow: string;
  subscriptionLine: string;
  subscriptionYearlyLine: string;

  // FAQ. Order goes from deal mechanics to risk: the first question
  // answers "what happens if I message you", the last is "who are you".
  faqTitle: string;
  // aLinkText, when set, is a substring of `a` that renders as a link to
  // the agency portfolio (the only FAQ answer that links out).
  faqItems: { q: string; a: string; aLinkText?: string }[];

  // Final CTA. Replaces "Tell us what you have. We'll tell you the final
  // price." — that headline told the reader, last thing on the page, that
  // none of the numbers above were final (ТЗ rewrite §7). ctaButton
  // (WhatsApp) and ctaButtonLine (LINE) are how to answer it — deliberately
  // just the brand name on both, equal weight. ctaSubtitle no longer
  // hedges on the logo or restates the setup price (ТЗ-5 §4) — both are
  // said, correctly, one screen up, and repeating a price here that the
  // addons list has already priced a piece of (the logo) read as the page
  // not knowing its own numbers. pricingLine now carries only the one
  // thing this block adds that nothing above it has said: reply time.
  ctaHeadline: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaButtonLine: string;
  pricingLine: string;

  footerPrivacy: string;
}

const en: PartnersDictionary = {
  heroTitle: "Already built. Just needs your name on it.",
  // "client" dropped — a shop owner has their own clients, and "PT.33
  // client panel" read as a second, competing use of the word right next
  // to "customer storefront." "running as one" tightened to "working as
  // one system" (ТЗ-4 §1.1).
  heroSubtitle: "A customer storefront, a live menu and a PT.33 panel — working as one system. Click through it yourself.",
  heroPriceLine: `${P.setupPrice} · live in a few days`,

  blockPt33Title: "Your paperwork,\nalready done.",
  blockPt33Subtitle: "Type a name — get their PT.33 and their full purchase history. About five seconds, from any device behind the counter.",

  blockStorefrontTitle: "Your storefront,\nalready open.",
  // ТЗ-6 §2: "you give" dropped — the owner-as-subject framing (ТЗ-5 §2)
  // made the sentence about the act of handing out a link rather than
  // about the link itself; "for every customer" keeps the same referent-
  // first order without it.
  blockStorefrontSubtitle: "One link for every customer — your contacts, their PT.33 request and today's menu with live prices. One address that always works, whatever happens to your other pages.",

  ctaStaff: "Open the staff panel",
  ctaStaffPending: "Signing in to demo…",
  ctaStaffErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
  ctaStaffErrorFailed: "Couldn't open the demo. Try again or message us.",
  ctaMenu: "Open the customer menu",

  offerTitle: "What it costs.",
  // ТЗ-6 §3: "First five shops" dropped — a shop count isn't something the
  // reader can check, unlike the date, so it read as a claim taken on
  // faith rather than a fact. The eyebrow is now just the deadline.
  offerPriceEyebrow: `Until ${P.launchDeadlineDay} September`,
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/month`,
  guaranteeLine: `You pay ${P.deposit} to start. The rest when it's running.`,
  liveInDaysLine: "Live in 7 days or your money back.",

  includedTitle: `Included at ${P.setupPrice}`,
  includedItems: [
    "Your storefront, your live menu and your PT.33 panel, running as one system",
    "Your logo, name and colours across all three",
    "Your products loaded — up to 80 items with prices, categories and photos",
    "Domain, hosting and setup",
  ],

  addonsTitle: "Optional extras",
  addonsItems: [
    { label: "A logo and identity, if you don't have one", price: P.addonLogo },
    { label: "Your existing PT.33 entered", price: P.addonPt33Cards },
    { label: "We keep the menu updated for you", price: `${P.addonMenuUpkeepMonthly}/month` },
    { label: "A second shop", price: `${P.addonSecondShopSetup} setup + ${P.addonSecondShopMonthly}/month` },
  ],

  subscriptionEyebrow: "Then, every month",
  subscriptionLine: "Covers hosting, domain, backups, updates and support.",
  subscriptionYearlyLine: `Pay for the year instead — ${P.subscriptionYearly}. You save ${P.annualSavings}.`,

  faqTitle: "Questions",
  faqItems: [
    {
      q: "What happens after I message you?",
      a: "We reply the same day. You tell us what you already have and we quote it. You pay half, send the logo and the product list, and we build. Most shops are running within a few days. The 7 days start when we have your logo and your product list.",
    },
    {
      q: "My staff don't read English.",
      a: "The panel and the menu both run in Thai, English and Russian. Your staff use Thai, your customers pick their own.",
    },
    {
      q: "Who updates the menu?",
      a: `You do — a minute on your phone. If you'd rather not, ${P.addonMenuUpkeepMonthly}/month and you send the change on WhatsApp instead; it's live the same day.`,
    },
    {
      q: "What if I stop paying?",
      a: "The storefront and menu go offline. Your client records don't go anywhere — ask and we send you the lot as a file, any day.",
    },
    {
      q: "Who actually builds this?",
      a: "FT.Agency, on Phuket. Marketing and web work since 2016 — see the portfolio. We'll come to your shop if you'd rather talk in person.",
      aLinkText: "the portfolio",
    },
  ],

  ctaHeadline: "Send your logo and your menu. We'll do the rest.",
  ctaSubtitle: "A spreadsheet, a photo of the board, a WhatsApp message — whatever you've got.",
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: "We reply the same day, 9:00–20:00 Phuket time.",

  footerPrivacy: "Privacy",
};

const ru: PartnersDictionary = {
  heroTitle: "Уже готово. Осталось только поставить ваше имя.",
  heroSubtitle: "Витрина для клиентов, живое меню и панель PT.33 — работают как одна система. Попробуйте сами.",
  heroPriceLine: `${P.setupPrice} · запуск за несколько дней`,

  blockPt33Title: "Документы —\nуже готовы.",
  blockPt33Subtitle: "Впишите имя — получите его PT.33 и полную историю покупок. Около пяти секунд с любого устройства за прилавком.",

  blockStorefrontTitle: "Витрина —\nуже открыта.",
  blockStorefrontSubtitle: "Одна ссылка для каждого клиента — ваши контакты, его запрос PT.33 и сегодняшнее меню с живыми ценами. Один адрес, который всегда работает, что бы ни случилось с остальными вашими страницами.",

  ctaStaff: "Открыть панель персонала",
  ctaStaffPending: "Вход в демо…",
  ctaStaffErrorNotConfigured: "Демо ещё не настроено. Напишите нам, и мы покажем панель напрямую.",
  ctaStaffErrorFailed: "Не удалось открыть демо. Попробуйте ещё раз или напишите нам.",
  ctaMenu: "Открыть меню для клиентов",

  offerTitle: "Сколько это стоит.",
  offerPriceEyebrow: `До ${P.launchDeadlineDay} сентября`,
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/мес`,
  guaranteeLine: `На старте вы платите ${P.deposit}. Остальное — когда всё работает.`,
  liveInDaysLine: "Заработает за 7 дней — или мы вернём деньги.",

  includedTitle: `Что входит за ${P.setupPrice}`,
  includedItems: [
    "Витрина, живое меню и панель PT.33 — одной системой",
    "Ваш логотип, название и цвета во всех трёх",
    "Ваши товары загружены — до 80 позиций с ценами, категориями и фото",
    "Домен, хостинг и настройка",
  ],

  addonsTitle: "Дополнительно",
  addonsItems: [
    { label: "Логотип и айдентика", price: P.addonLogo },
    { label: "Перенос ваших действующих PT.33", price: P.addonPt33Cards },
    { label: "Мы обновляем меню за вас", price: `${P.addonMenuUpkeepMonthly}/мес` },
    { label: "Второй магазин", price: `${P.addonSecondShopSetup} настройка + ${P.addonSecondShopMonthly}/мес` },
  ],

  subscriptionEyebrow: "Потом — каждый месяц",
  subscriptionLine: "Покрывает хостинг, домен, бэкапы, обновления и поддержку.",
  subscriptionYearlyLine: `Можно оплатить год — ${P.subscriptionYearly}. Экономия ${P.annualSavings}.`,

  faqTitle: "Вопросы",
  faqItems: [
    {
      q: "Что будет после того, как я вам напишу?",
      a: "Отвечаем в тот же день. Вы рассказываете, что у вас уже есть, мы называем цену. Платите половину, присылаете логотип и список товаров — мы делаем. Большинство магазинов работает через несколько дней. Эти 7 дней начинаются, когда у нас есть ваш логотип и список товаров.",
    },
    {
      q: "Мой персонал не читает по-английски.",
      a: "И панель, и меню работают на тайском, английском и русском. Персонал пользуется тайским, клиенты выбирают свой язык сами.",
    },
    {
      q: "Кто обновляет меню?",
      a: `Вы сами — минута с телефона. Если не хотите, ${P.addonMenuUpkeepMonthly}/мес — и вы просто присылаете изменение в WhatsApp; оно появляется в тот же день.`,
    },
    {
      q: "Что если я перестану платить?",
      a: "Витрина и меню отключаются. Данные о клиентах никуда не пропадают — попросите, и мы пришлём вам всё файлом в любой день.",
    },
    {
      q: "Кто на самом деле это делает?",
      a: "FT.Agency, на Пхукете. Маркетинг и веб-разработка с 2016 года — смотрите портфолио. Если удобнее поговорить лично, приедем к вам в магазин.",
      aLinkText: "портфолио",
    },
  ],

  ctaHeadline: "Пришлите логотип и меню. Остальное на нас.",
  ctaSubtitle: "Таблица, фото доски, сообщение в WhatsApp — подойдёт что угодно.",
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: "Отвечаем в тот же день, 9:00–20:00 по Пхукету.",

  footerPrivacy: "Конфиденциальность",
};

const th: PartnersDictionary = {
  heroTitle: "พร้อมใช้งานแล้ว เหลือแค่ใส่ชื่อร้านของคุณ",
  heroSubtitle: "หน้าร้านสำหรับลูกค้า เมนูที่อัปเดตสด และแผงควบคุม PT.33 — ทำงานเป็นระบบเดียวกัน คลิกดูด้วยตัวเองได้เลย",
  heroPriceLine: `${P.setupPrice} · เปิดใช้งานได้ในไม่กี่วัน`,

  blockPt33Title: "เอกสารของคุณ\nพร้อมอยู่แล้ว",
  blockPt33Subtitle: "พิมพ์ชื่อ — ดู PT.33 และประวัติการซื้อทั้งหมด ใช้เวลาประมาณห้าวินาที จากอุปกรณ์ใดก็ได้หลังเคาน์เตอร์",

  blockStorefrontTitle: "หน้าร้านของคุณ\nเปิดอยู่แล้ว",
  blockStorefrontSubtitle: "ลิงก์เดียวสำหรับลูกค้าทุกคน — ข้อมูลติดต่อของคุณ คำขอ PT.33 ของเขา และเมนูวันนี้พร้อมราคาสด ที่อยู่เดียวที่ใช้งานได้เสมอ ไม่ว่าจะเกิดอะไรขึ้นกับหน้าอื่น ๆ ของคุณ",

  ctaStaff: "เปิดแผงควบคุมพนักงาน",
  ctaStaffPending: "กำลังเข้าสู่ระบบเดโม…",
  ctaStaffErrorNotConfigured: "เดโมยังไม่ได้ตั้งค่า ทักหาเรา แล้วเราจะโชว์แผงควบคุมให้ดูโดยตรง",
  ctaStaffErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",
  ctaMenu: "เปิดเมนูสำหรับลูกค้า",

  offerTitle: "ราคาเท่าไหร่",
  offerPriceEyebrow: `ถึงวันที่ ${P.launchDeadlineDay} กันยายน`,
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/เดือน`,
  guaranteeLine: `จ่ายแค่ ${P.deposit} เพื่อเริ่มต้น ส่วนที่เหลือจ่ายเมื่อระบบทำงานแล้ว`,
  liveInDaysLine: "เริ่มใช้งานได้ภายใน 7 วัน หรือคืนเงินให้เต็มจำนวน",

  includedTitle: `รวมอยู่ในราคา ${P.setupPrice}`,
  includedItems: [
    "หน้าร้าน เมนูสด และแผงควบคุม PT.33 — ทำงานเป็นระบบเดียวกัน",
    "โลโก้ ชื่อร้าน และสีของคุณ ในทั้งสามระบบ",
    "สินค้าของคุณถูกโหลดเข้าระบบ — สูงสุด 80 รายการ พร้อมราคา หมวดหมู่ และรูปภาพ",
    "โดเมน โฮสติ้ง และการตั้งค่า",
  ],

  addonsTitle: "ตัวเลือกเสริม",
  addonsItems: [
    { label: "โลโก้และอัตลักษณ์แบรนด์ สำหรับร้านที่ยังไม่มี", price: P.addonLogo },
    { label: "นำเข้า PT.33 ที่คุณมีอยู่แล้ว", price: P.addonPt33Cards },
    { label: "ให้เราอัปเดตเมนูให้คุณ", price: `${P.addonMenuUpkeepMonthly}/เดือน` },
    { label: "ร้านที่สอง", price: `${P.addonSecondShopSetup} ตั้งค่า + ${P.addonSecondShopMonthly}/เดือน` },
  ],

  subscriptionEyebrow: "จากนั้น ทุกเดือน",
  subscriptionLine: "ครอบคลุมโฮสติ้ง โดเมน สำรองข้อมูล อัปเดต และซัพพอร์ต",
  subscriptionYearlyLine: `หรือจ่ายเป็นรายปีแทน — ${P.subscriptionYearly} ประหยัด ${P.annualSavings}`,

  faqTitle: "คำถามที่พบบ่อย",
  faqItems: [
    {
      q: "หลังจากที่ทักหาแล้วจะเกิดอะไรขึ้น?",
      a: "เราตอบกลับภายในวันเดียวกัน คุณบอกเราว่ามีอะไรอยู่แล้วบ้าง เราจะเสนอราคาให้ คุณจ่ายครึ่งหนึ่ง ส่งโลโก้และรายการสินค้า แล้วเราจะเริ่มสร้าง ร้านส่วนใหญ่พร้อมใช้งานภายในไม่กี่วัน 7 วันนี้เริ่มนับตั้งแต่วันที่เราได้รับโลโก้และรายการสินค้าของคุณ",
    },
    {
      q: "พนักงานของฉันอ่านภาษาอังกฤษไม่ออก",
      a: "ทั้งแผงควบคุมและเมนูรองรับภาษาไทย อังกฤษ และรัสเซีย พนักงานของคุณใช้ภาษาไทยได้เลย ส่วนลูกค้าเลือกภาษาของตัวเอง",
    },
    {
      q: "ใครเป็นคนอัปเดตเมนู?",
      a: `คุณเองได้เลย ใช้เวลาแค่นาทีเดียวบนมือถือ ถ้าไม่อยากทำเอง จ่าย ${P.addonMenuUpkeepMonthly}/เดือน แล้วส่งการเปลี่ยนแปลงมาทาง WhatsApp แทน จะขึ้นให้ทันทีในวันเดียวกัน`,
    },
    {
      q: "ถ้าฉันหยุดจ่ายเงินจะเป็นอย่างไร?",
      a: "หน้าร้านและเมนูจะออฟไลน์ แต่ข้อมูลลูกค้าของคุณไม่หายไปไหน แจ้งมาได้ทุกวัน แล้วเราจะส่งข้อมูลทั้งหมดให้เป็นไฟล์",
    },
    {
      q: "ใครเป็นคนสร้างระบบนี้จริง ๆ?",
      a: "FT.Agency ที่ภูเก็ต ทำงานด้านการตลาดและเว็บไซต์มาตั้งแต่ปี 2016 — ดูผลงานได้ที่นี่ หากสะดวกคุยกันต่อหน้า เรายินดีไปที่ร้านของคุณ",
      aLinkText: "ผลงาน",
    },
  ],

  ctaHeadline: "ส่งโลโก้และเมนูของคุณมา ที่เหลือเราจัดการเอง",
  ctaSubtitle: "สเปรดชีต รูปถ่ายกระดานเมนู ข้อความใน WhatsApp — มีอะไรส่งมาได้เลย",
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: "ตอบกลับภายในวันเดียวกัน 9:00–20:00 เวลาภูเก็ต",

  footerPrivacy: "ความเป็นส่วนตัว",
};

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  en,
  ru,
  th,
};
