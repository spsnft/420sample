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
  // Standalone price block between offerTitle and offerPriceNote — the
  // page's one moment of decision gets its own typographic weight instead
  // of living as a clause inside a paragraph. offerPriceNow is the number
  // the whole block exists to show; offerPriceWas is struck through beside
  // it, offerPriceMonthly sits under both.
  offerPriceNow: string;
  offerPriceWas: string;
  offerPriceMonthly: string;
  // Replaces the old fine-print "until … · then …" line: now the block's
  // only argument for acting now, so it runs at body-text size instead of
  // the smallest type in the section (ТЗ rewrite §5.3).
  offerPriceNote: string;
  // Shortened to its first two sentences — the "nobody on your street /
  // that won't stay true" close is dropped (ТЗ rewrite §5.4).
  offerBody: string;
  // NEW: the page's one guarantee (the old 50/50 split), promoted from a
  // small grey line under the add-ons list up to right where a reader is
  // actually weighing the risk — bold, body-text size, above the included
  // list (ТЗ rewrite §5.5). Replaces the old termsLine.
  guaranteeLine: string;

  includedTitle: string;
  includedItems: string[];
  // NEW: plain-text line under the included list (not a bullet) naming
  // what "your products loaded" accepts as input.
  includedNote: string;

  // Add-on price list. A separate shape from includedItems because the
  // price is right-aligned and is not part of the label string.
  addonsTitle: string;
  addonsItems: { label: string; price: string }[];

  // Subscription price and terms — now two lines: the locked monthly rate,
  // then the annual option. "locked for your first year" is gone (it begged
  // the question of what happens after); ТЗ rewrite §5.8.
  subscriptionLine: string;
  subscriptionYearlyLine: string;

  // FAQ. Order goes from deal mechanics to risk: the first question
  // answers "what happens if I message you", the last is "who are you".
  faqTitle: string;
  faqItems: { q: string; a: string }[];

  // Final CTA. Replaces "Tell us what you have. We'll tell you the final
  // price." — that headline told the reader, last thing on the page, that
  // none of the numbers above were final (ТЗ rewrite §7). ctaButton
  // (WhatsApp) and ctaButtonLine (LINE) are how to answer it — deliberately
  // just the brand name on both, equal weight. pricingLine is the page's
  // own closing price recap.
  ctaHeadline: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaButtonLine: string;
  pricingLine: string;

  footerPrivacy: string;
}

const en: PartnersDictionary = {
  heroTitle: "Already built. Just needs your name on it.",
  heroSubtitle: "A customer storefront, a live menu and a PT.33 client panel, running as one system. Have a click through it yourself.",
  heroPriceLine: `${P.setupPrice} · live in a few days`,

  blockPt33Title: "Your paperwork,\nalready done.",
  blockPt33Subtitle: "Type a name, get their PT.33, their history and everything they've bought. About five seconds, from any device behind the counter.",

  blockStorefrontTitle: "Your storefront,\nalready open.",
  blockStorefrontSubtitle: "One page under your name for everyone you send it to. Your customers request their certificate, then walk straight into a menu with live prices. Change a price or mark something sold out once — it's changed on the screen in the shop, on the site, and in the link your staff send on WhatsApp.",

  ctaStaff: "Open the staff panel",
  ctaStaffPending: "Signing in to demo…",
  ctaStaffErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
  ctaStaffErrorFailed: "Couldn't open the demo. Try again or message us.",
  ctaMenu: "Open the customer menu",

  offerTitle: "What it costs.",
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/month`,
  offerPriceNote: `We're setting up the first shops one at a time and pricing them at ${P.setupPrice} while we do. Until ${P.launchDeadlineDay} September.`,
  offerBody: "What you just clicked through is finished. It's not a prototype and you wouldn't be testing anything — the only new thing here is that it's for sale.",
  guaranteeLine: `You pay ${P.deposit} to start. The rest only when it's running and you've looked at it yourself. Nothing on your side switches off while we build.`,

  includedTitle: `Included at ${P.setupPrice}`,
  includedItems: [
    "Your storefront, your live menu and your PT.33 panel, running as one system",
    "Your logo, name and colours across all three",
    "Your products loaded — up to 80 items with prices, categories and photos",
    "Domain, hosting and setup",
  ],
  includedNote: "Send a spreadsheet, a photo of the board, a WhatsApp message — whatever you've got.",

  addonsTitle: "Add if you need it",
  addonsItems: [
    { label: "A logo and identity, if you don't have one", price: P.addonLogo },
    { label: "Your existing PT.33 cards entered", price: P.addonPt33Cards },
    { label: "A second shop", price: `${P.addonSecondShopSetup} setup + ${P.addonSecondShopMonthly}/month` },
    { label: "We keep the menu updated for you", price: `${P.addonMenuUpkeepMonthly}/month` },
  ],

  subscriptionLine: `${P.subscriptionMonthly}/month — hosting, domain, backups, updates and support. Locked: shops that come in now keep ${P.subscriptionMonthly} for as long as they stay with us.`,
  subscriptionYearlyLine: `Pay for the year instead — ${P.subscriptionYearly}. Two months off.`,

  faqTitle: "Questions",
  faqItems: [
    {
      q: "What happens after I message you?",
      a: "We reply the same day. You tell us what you already have and we quote it. You pay half, send the logo and the product list, and we build. Most shops are running within a few days — it depends on how much of it we're typing up for you.",
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
      a: "FT.Agency, on Phuket. Small team, and you'll be dealing with the person doing the work rather than a manager.",
    },
  ],

  ctaHeadline: "Send your logo and your menu. We'll do the rest.",
  ctaSubtitle: `A spreadsheet, a photo of the board, a WhatsApp message — whatever you've got. No logo? Say so, and we'll price that separately. Everything else is the ${P.setupPrice}.`,
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: `${P.setupPrice} setup · ${P.subscriptionMonthly}/month · we reply the same day, 9:00–20:00 Phuket time`,

  footerPrivacy: "Privacy",
};

const ru: PartnersDictionary = {
  heroTitle: "Уже готово. Осталось только поставить ваше имя.",
  heroSubtitle: "Витрина для клиентов, живое меню и панель PT.33 — одна система. Пройдите по ней сами.",
  heroPriceLine: `${P.setupPrice} · запуск за несколько дней`,

  blockPt33Title: "Ваши документы\nуже готовы.",
  blockPt33Subtitle: "Впишите имя — получите его PT.33, историю и всё, что он покупал. Около пяти секунд с любого устройства за прилавком.",

  blockStorefrontTitle: "Ваша витрина,\nуже открыта.",
  blockStorefrontSubtitle: "Одна страница под вашим именем — та, которую вы даёте всем. Клиент оттуда подаёт заявку на справку и сразу попадает в меню с живыми ценами. Меняете цену или отмечаете, что позиция кончилась, один раз — и это меняется на экране в магазине, на сайте и в ссылке, которую персонал отправляет в WhatsApp.",

  ctaStaff: "Открыть панель персонала",
  ctaStaffPending: "Вход в демо…",
  ctaStaffErrorNotConfigured: "Демо ещё не настроено. Напишите нам, и мы покажем панель напрямую.",
  ctaStaffErrorFailed: "Не удалось открыть демо. Попробуйте ещё раз или напишите нам.",
  ctaMenu: "Открыть меню для клиентов",

  offerTitle: "Сколько это стоит.",
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/мес`,
  offerPriceNote: `Первые магазины мы запускаем по одному и делаем их по ${P.setupPrice}, пока запускаем. До ${P.launchDeadlineDay} сентября.`,
  offerBody: "То, что вы только что покликали, — готовое. Это не прототип, и тестировать вам ничего не придётся. Новое здесь только одно: это можно купить.",
  guaranteeLine: `На старте вы платите ${P.deposit}. Остальное — только когда всё работает и вы сами это посмотрели. Пока мы делаем, у вас ничего не выключается.`,

  includedTitle: `Что входит за ${P.setupPrice}`,
  includedItems: [
    "Витрина, живое меню и панель PT.33 — одной системой",
    "Ваш логотип, название и цвета во всех трёх",
    "Ваши товары загружены — до 80 позиций с ценами, категориями и фото",
    "Домен, хостинг и настройка",
  ],
  includedNote: "Пришлите таблицу, фото доски или сообщение в WhatsApp — что есть, то и подойдёт.",

  addonsTitle: "Добавьте, если нужно",
  addonsItems: [
    { label: "Логотип и айдентика, если своих ещё нет", price: P.addonLogo },
    { label: "Перенос ваших действующих карт PT.33", price: P.addonPt33Cards },
    { label: "Второй магазин", price: `${P.addonSecondShopSetup} настройка + ${P.addonSecondShopMonthly}/мес` },
    { label: "Мы сами обновляем меню за вас", price: `${P.addonMenuUpkeepMonthly}/мес` },
  ],

  subscriptionLine: `${P.subscriptionMonthly}/месяц — хостинг, домен, бэкапы, обновления и поддержка. Ставка фиксируется: магазины, которые заходят сейчас, платят ${P.subscriptionMonthly} столько, сколько остаются с нами.`,
  subscriptionYearlyLine: `Можно оплатить год — ${P.subscriptionYearly}. Два месяца в подарок.`,

  faqTitle: "Вопросы",
  faqItems: [
    {
      q: "Что будет после того, как я вам напишу?",
      a: "Отвечаем в тот же день. Вы рассказываете, что у вас уже есть, мы называем цену. Платите половину, присылаете логотип и список товаров — мы делаем. Большинство магазинов работает через несколько дней; зависит от того, сколько за вас набирать.",
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
      a: "Витрина и меню отключаются. Данные о клиентах никуда не деваются — попросите, и мы пришлём вам всё файлом в любой день.",
    },
    {
      q: "Кто на самом деле это делает?",
      a: "FT.Agency, на Пхукете. Небольшая команда — вы будете общаться с тем, кто непосредственно делает работу, а не с менеджером.",
    },
  ],

  ctaHeadline: "Пришлите логотип и меню. Остальное на нас.",
  ctaSubtitle: `Таблица, фото доски, сообщение в WhatsApp — подойдёт что угодно. Логотипа нет? Скажите, посчитаем отдельно. Всё остальное — это те самые ${P.setupPrice}.`,
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: `${P.setupPrice} установка · ${P.subscriptionMonthly}/месяц · отвечаем в тот же день, 9:00–20:00 по Пхукету`,

  footerPrivacy: "Конфиденциальность",
};

const th: PartnersDictionary = {
  heroTitle: "พร้อมใช้งานแล้ว เหลือแค่ใส่ชื่อร้านของคุณ",
  heroSubtitle: "หน้าร้านสำหรับลูกค้า เมนูที่อัปเดตสด และแผงควบคุม PT.33 — ทำงานเป็นระบบเดียวกัน ลองคลิกดูด้วยตัวเองได้เลย",
  heroPriceLine: `${P.setupPrice} · เปิดใช้งานได้ในไม่กี่วัน`,

  blockPt33Title: "เอกสารของคุณ\nพร้อมอยู่แล้ว",
  blockPt33Subtitle: "พิมพ์ชื่อ แล้วดู PT.33 ประวัติ และทุกอย่างที่เขาเคยซื้อ ใช้เวลาประมาณห้าวินาที จากอุปกรณ์ใดก็ได้หลังเคาน์เตอร์",

  blockStorefrontTitle: "หน้าร้านของคุณ\nเปิดอยู่แล้ว",
  blockStorefrontSubtitle: "หน้าเดียวภายใต้ชื่อร้านของคุณ สำหรับส่งให้ทุกคน ลูกค้าขอใบรับรอง PT.33 ของตัวเองที่นั่น แล้วเข้าสู่เมนูที่มีราคาสดทันที เปลี่ยนราคาหรือทำเครื่องหมายว่าสินค้าหมดเพียงครั้งเดียว มันจะเปลี่ยนบนหน้าจอในร้าน บนเว็บไซต์ และในลิงก์ที่พนักงานส่งทาง WhatsApp พร้อมกัน",

  ctaStaff: "เปิดแผงควบคุมพนักงาน",
  ctaStaffPending: "กำลังเข้าสู่ระบบเดโม…",
  ctaStaffErrorNotConfigured: "เดโมยังไม่ได้ตั้งค่า ทักหาเรา แล้วเราจะโชว์แผงควบคุมให้ดูโดยตรง",
  ctaStaffErrorFailed: "เปิดเดโมไม่สำเร็จ ลองใหม่อีกครั้งหรือทักหาเรา",
  ctaMenu: "เปิดเมนูสำหรับลูกค้า",

  offerTitle: "ราคาเท่าไหร่",
  offerPriceNow: P.setupPrice,
  offerPriceWas: P.setupPriceWas,
  offerPriceMonthly: `${P.subscriptionMonthly}/เดือน`,
  offerPriceNote: `เรากำลังตั้งค่าร้านแรก ๆ ทีละร้าน และตั้งราคาไว้ที่ ${P.setupPrice} ระหว่างนี้ ถึงวันที่ ${P.launchDeadlineDay} กันยายน`,
  offerBody: "สิ่งที่คุณเพิ่งคลิกผ่านไปคือของจริง เสร็จสมบูรณ์แล้ว ไม่ใช่ต้นแบบ และคุณไม่ต้องทดสอบอะไรเลย — สิ่งใหม่มีอย่างเดียวคือตอนนี้มันวางขายแล้ว",
  guaranteeLine: `จ่ายแค่ ${P.deposit} เพื่อเริ่มต้น ส่วนที่เหลือจ่ายเมื่อระบบทำงานแล้วและคุณได้ดูด้วยตัวเองแล้วเท่านั้น ระหว่างที่เราสร้างให้ ฝั่งคุณไม่มีอะไรถูกปิดใช้งาน`,

  includedTitle: `รวมอยู่ในราคา ${P.setupPrice}`,
  includedItems: [
    "หน้าร้าน เมนูสด และแผงควบคุม PT.33 — ทำงานเป็นระบบเดียวกัน",
    "โลโก้ ชื่อร้าน และสีของคุณ ในทั้งสามระบบ",
    "สินค้าของคุณถูกโหลดเข้าระบบ — สูงสุด 80 รายการ พร้อมราคา หมวดหมู่ และรูปภาพ",
    "โดเมน โฮสติ้ง และการตั้งค่า",
  ],
  includedNote: "ส่งไฟล์สเปรดชีต รูปถ่ายกระดานเมนู หรือข้อความใน WhatsApp — มีอะไรส่งมาได้เลย",

  addonsTitle: "เพิ่มเติมถ้าต้องการ",
  addonsItems: [
    { label: "โลโก้และอัตลักษณ์แบรนด์ สำหรับร้านที่ยังไม่มี", price: P.addonLogo },
    { label: "นำเข้าบัตร PT.33 ที่คุณมีอยู่แล้ว", price: P.addonPt33Cards },
    { label: "ร้านที่สอง", price: `${P.addonSecondShopSetup} ตั้งค่า + ${P.addonSecondShopMonthly}/เดือน` },
    { label: "ให้เราอัปเดตเมนูให้คุณ", price: `${P.addonMenuUpkeepMonthly}/เดือน` },
  ],

  subscriptionLine: `${P.subscriptionMonthly}/เดือน — โฮสติ้ง โดเมน สำรองข้อมูล อัปเดต และซัพพอร์ต ราคาคงที่: ร้านที่สมัครตอนนี้จ่าย ${P.subscriptionMonthly} ตลอดระยะเวลาที่ยังใช้งานกับเรา`,
  subscriptionYearlyLine: `หรือจ่ายเป็นรายปีแทน — ${P.subscriptionYearly} ฟรี 2 เดือน`,

  faqTitle: "คำถามที่พบบ่อย",
  faqItems: [
    {
      q: "หลังจากที่ทักหาแล้วจะเกิดอะไรขึ้น?",
      a: "เราตอบกลับภายในวันเดียวกัน คุณบอกเราว่ามีอะไรอยู่แล้วบ้าง เราจะเสนอราคาให้ คุณจ่ายครึ่งหนึ่ง ส่งโลโก้และรายการสินค้า แล้วเราจะเริ่มสร้าง ร้านส่วนใหญ่พร้อมใช้งานภายในไม่กี่วัน ขึ้นอยู่กับว่าเราต้องพิมพ์ข้อมูลให้คุณมากแค่ไหน",
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
      a: "FT.Agency ที่ภูเก็ต ทีมงานขนาดเล็ก คุณจะได้คุยกับคนที่ลงมือทำงานจริง ไม่ใช่ผู้จัดการ",
    },
  ],

  ctaHeadline: "ส่งโลโก้และเมนูของคุณมา ที่เหลือเราจัดการเอง",
  ctaSubtitle: `สเปรดชีต รูปถ่ายกระดานเมนู ข้อความใน WhatsApp — มีอะไรส่งมาได้เลย ไม่มีโลโก้ใช่ไหม? บอกเราได้เลย แล้วเราจะคิดราคาแยกให้ ส่วนที่เหลือทั้งหมดคือราคา ${P.setupPrice}`,
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: `${P.setupPrice} ค่าติดตั้ง · ${P.subscriptionMonthly}/เดือน · ตอบกลับภายในวันเดียวกัน 9:00–20:00 เวลาภูเก็ต`,

  footerPrivacy: "ความเป็นส่วนตัว",
};

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  en,
  ru,
  th,
};
