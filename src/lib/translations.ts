export type Language = 'en' | 'ru' | 'th';

export interface CertStep {
  title: string;
  description: string;
}

export interface TranslationDictionary {
  // Header & Navigation
  updates: string;
  sales: string;
  // The three category names, used for the menu's tabs, its section headings
  // and the category label on a showcase card — one word per category, so the
  // tab and the card never disagree. English and Russian both keep "Buds" and
  // "Joints": those are the words the shop itself uses on its shelves, and a
  // Russian customer reads them faster than a translation would be read.
  buds: string;
  joints: string;
  accessories: string;
  menuTitle: string;
  /** Accessible name of the header's destination chip and of the panel it opens. */
  navLabel: string;
  // The three surfaces the product is made of, which is what the chip switches
  // between: the shop's public site, the panel its staff run the med-card
  // checks from, and the pitch page for other shop owners.
  navSite: string;
  navStaff: string;
  navBusiness: string;
  open: string;
  close: string;
  remove: string;
  basket: string;
  items: string;
  total: string;

  // Catalogue states — shown in place of the product sections when the menu
  // cannot be fetched, or when it loads but has nothing in it.
  catalogErrorTitle: string;
  catalogErrorBody: string;
  catalogRetry: string;
  catalogEmpty: string;
  filterAll: string;
  tagNew: string;
  tagSale: string;

  // Product sheet
  taste: string;
  terpenes: string;
  savingLabel: string;
  /** {qty}, {unit} and {amount} name the tier that would start saving money. */
  savingHint: string;
  updateCta: string;

  // Kiosk idle prompt
  idleTitle: string;
  idleBody: string;
  idleStay: string;

  // Order flow (kiosk)
  orderTitle: string;
  emptyCart: string;
  placeOrder: string;
  orderPlacedTitle: string;
  showStaffLine: string;
  newOrderCta: string;

  // Home page
  // "\n" marks the line break the card renders as a <br/> — see HomeClient.
  heroDoorCertTitle: string;
  heroDoorMenuTitle: string;
  heroDoorCertLine: string;
  heroDoorMenuLine: string;
  // "Flowers. Done properly." is hardcoded in English across all locales
  // (not translated) — see HomeClient.
  addressLabel: string;
  hoursLabel: string;
  reviewsLabel: string;
  // Same value in every locale, deliberately (audit ТЗ pitch-layout-2
  // №5.3) — it sits directly under the always-English tagline above it and
  // the two read as one bilingual-brand line together, not a translated
  // subtitle.
  aboutLead: string;
  aboutPhotoLabel: string;
  certSteps: [CertStep, CertStep, CertStep];
  contactsTitle: string;
  // One line, not two — the old two-paragraph version didn't fit on two
  // lines even on an iPhone 14 Plus (428pt). Still carries both legal
  // points (age/PT.33 requirement, and "reference only" as the storefront's
  // cover for showing product and prices without being an ad) — neither is
  // droppable, just shorter.
  footerDisclaimer: string;

  // Sticky strip above the header on the storefront demo (see DemoBar) —
  // marks the page as sample data to a prospect who clicked in from the
  // pitch page, and links back to it.
  demoBarLabel: string;
  demoBarCta: string;

  // Consultation modal — opened from the "Get Medical Certificate" hero
  // card, so consultCta names that promise rather than the mechanism
  // ("Free Consultation") behind it.
  consultCta: string;
  consultNameLabel: string;
  consultPhoneLabel: string;
  // Dial-code select beside the phone input, defaulting to +66 — Phuket's
  // customers carry phones from everywhere, and a number with no country
  // code is a lead nobody can call back. consultPhoneCodeOther labels the
  // select's last option, which reveals a free-text code field for any
  // country not in the short list.
  consultPhoneCodeOther: string;
  consultConsentLabel: string;
  consultSubmitCta: string;
  // Submitting the form never calls a real backend — nothing typed into it
  // is sent, logged, or stored, unconditionally (see the audit ТЗ this
  // shipped with, item 6: there is exactly one instance of this project) —
  // it just swaps the modal's header and body for this success state.
  // consultSuccessHeadline is two lines ("\n"-joined, see renderLines) set
  // in the same weight as the modal's own heading; consultSuccessNote is
  // the one line on the whole storefront addressed to the shop owner
  // touring it rather than to a customer, so it renders smaller and
  // visually apart from the two lines above it.
  consultSuccessTitle: string;
  consultSuccessHeadline: string;
  consultSuccessNote: string;

  // Tap-to-reveal tooltips for controls that are live and clickable but,
  // on this demo instance, have nothing real behind them yet — see
  // components/ui/Tooltip. contactsTooltip covers the whole LINE/WhatsApp/
  // Instagram row at once; reviewsTooltip is the Reviews row in the info
  // strip.
  contactsTooltip: string;
  reviewsTooltip: string;

  // Label on the storefront's static map graphic — opens the real Google
  // Maps listing in a new tab (see config/site.ts, mapOpenUrl).
  mapOpenCta: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Header & Navigation
    updates: "New",
    sales: "Sales",
    buds: "Buds",
    joints: "Joints",
    accessories: "Accessories",
    menuTitle: "Menu",
    navLabel: "Sections",
    navSite: "Website",
    navStaff: "Staff panel",
    navBusiness: "For business",
    open: "Open",
    close: "Close",
    remove: "Remove",
    basket: "Basket",
    items: "items",
    total: "Total",

    catalogErrorTitle: "Menu unavailable",
    catalogErrorBody: "We couldn't load today's menu. Check the connection and try again — or just ask our staff.",
    catalogRetry: "Try again",
    catalogEmpty: "Nothing on the menu right now. Please ask our staff.",
    filterAll: "All",
    tagNew: "New",
    tagSale: "Sale",

    taste: "Taste",
    terpenes: "Terpenes",
    savingLabel: "saving",
    savingHint: "{qty} {unit} — saving {amount}฿",
    updateCta: "Update",

    idleTitle: "Still there?",
    idleBody: "This screen is shared. We'll clear your basket in {seconds} seconds so the next guest starts fresh.",
    idleStay: "I'm still here",

    // Order flow (kiosk)
    orderTitle: "Your Order",
    emptyCart: "Your cart is empty",
    placeOrder: "Place Order",
    orderPlacedTitle: "Order #{id}",
    showStaffLine: "Show this screen to our staff to complete your order",
    newOrderCta: "Start New Order",

    // Home page
    heroDoorCertTitle: "GET MEDICAL\nCERTIFICATE",
    heroDoorMenuTitle: "EXPLORE\nTODAY'S MENU",
    heroDoorCertLine: "Free, next-day certificate — stay legally protected",
    heroDoorMenuLine: "Full selection, always in stock",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    reviewsLabel: "Reviews",
    aboutLead: "Licensed dispensary. Full menu, live prices.",
    aboutPhotoLabel: "Photo coming soon",
    certSteps: [
      { title: "Send", description: "your request within a minute" },
      { title: "Confirm", description: "details with our manager" },
      { title: "Receive", description: "your certificate the next day" },
    ],
    contactsTitle: "Contact & Follow",
    footerDisclaimer: "18+. Sold only with a valid PT.33 card. Reference only — not advertising.",

    demoBarLabel: "DEMO STORE — sample data",
    demoBarCta: "Back to buds.digital",

    consultCta: "Medical Certificate",
    consultNameLabel: "Name",
    consultPhoneLabel: "Phone",
    consultPhoneCodeOther: "Other…",
    consultConsentLabel: "I agree to the processing of my personal data in accordance with PDPA.",
    consultSubmitCta: "Send Request",
    consultSuccessTitle: "Request Sent",
    consultSuccessHeadline: "Request received.\nWe'll confirm by WhatsApp within the hour.",
    consultSuccessNote: "In your version, this request lands in your /staff panel.",

    contactsTooltip: "Your LINE · WhatsApp · Instagram go here",
    reviewsTooltip: "Your Google rating and review count show here",
    mapOpenCta: "Open in Maps",
  },
  ru: {
    // Header & Navigation
    updates: "Новинки",
    sales: "Распродажа",
    buds: "Buds",
    joints: "Joints",
    accessories: "Аксессуары",
    menuTitle: "Меню",
    navLabel: "Разделы",
    navSite: "Сайт",
    navStaff: "Панель персонала",
    navBusiness: "Для бизнеса",
    open: "Открыть",
    close: "Закрыть",
    remove: "Удалить",
    basket: "Корзина",
    items: "тов.",
    total: "Итого",

    catalogErrorTitle: "Меню недоступно",
    catalogErrorBody: "Не удалось загрузить сегодняшнее меню. Проверьте соединение и попробуйте снова — или спросите у наших сотрудников.",
    catalogRetry: "Повторить",
    catalogEmpty: "Сейчас в меню ничего нет. Спросите у наших сотрудников.",
    filterAll: "Все",
    tagNew: "Новое",
    tagSale: "Скидка",

    taste: "Вкус",
    terpenes: "Терпены",
    savingLabel: "выгода",
    savingHint: "{qty} {unit} — выгода {amount}฿",
    updateCta: "Обновить",

    idleTitle: "Вы ещё здесь?",
    idleBody: "Этим экраном пользуются гости по очереди. Через {seconds} сек. мы очистим корзину, чтобы следующий начал с чистого листа.",
    idleStay: "Я здесь",

    // Order flow (kiosk)
    orderTitle: "Ваш заказ",
    emptyCart: "Корзина пуста",
    placeOrder: "Оформить заказ",
    orderPlacedTitle: "Заказ №{id}",
    showStaffLine: "Покажите этот экран нашему сотруднику, чтобы завершить заказ",
    newOrderCta: "Новый заказ",

    // Home page
    heroDoorCertTitle: "ОФОРМИТЬ\nСПРАВКУ",
    heroDoorMenuTitle: "МЕНЮ\nСЕГОДНЯ",
    heroDoorCertLine: "Бесплатно, уже на следующий день — под защитой закона",
    heroDoorMenuLine: "Полный ассортимент, всегда в наличии",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    reviewsLabel: "Отзывы",
    // Deliberately English, not translated — see the "en" entry above's
    // comment: it sits under the always-English "Flowers. Done properly."
    // tagline and reads as one bilingual-brand unit with it.
    aboutLead: "Licensed dispensary. Full menu, live prices.",
    aboutPhotoLabel: "Фото заведения — скоро",
    certSteps: [
      { title: "Отправьте", description: "заявку в течение минуты" },
      { title: "Подтвердите", description: "детали с нашим менеджером" },
      { title: "Получите", description: "справку на следующий день" },
    ],
    contactsTitle: "Контакты и соцсети",
    footerDisclaimer: "18+. Отпускается только по действующей карте PT.33. Справочная информация, не реклама.",

    demoBarLabel: "ДЕМО-МАГАЗИН — тестовые данные",
    demoBarCta: "Вернуться на buds.digital",

    consultCta: "Медицинская справка",
    consultNameLabel: "Имя",
    consultPhoneLabel: "Телефон",
    consultPhoneCodeOther: "Другой…",
    consultConsentLabel: "Я согласен(на) на обработку персональных данных в соответствии с PDPA.",
    consultSubmitCta: "Отправить заявку",
    consultSuccessTitle: "Заявка отправлена",
    consultSuccessHeadline: "Заявка получена.\nМы подтвердим в WhatsApp в течение часа.",
    consultSuccessNote: "В вашей версии эта заявка попадёт в вашу панель /staff.",

    contactsTooltip: "Здесь будут ваши LINE · WhatsApp · Instagram",
    reviewsTooltip: "Здесь будет ваш рейтинг Google и число отзывов",
    mapOpenCta: "Открыть в Google Картах",
  },
  th: {
    // Header & Navigation
    updates: "มาใหม่",
    sales: "ลดราคา",
    // The words a Thai dispensary prints on its own menu: the flower itself,
    // and the loanword for a pre-roll, which is what the counter says out loud
    // rather than the more literal กัญชามวน.
    buds: "ดอกกัญชา",
    joints: "พรีโรล",
    accessories: "อุปกรณ์เสริม",
    menuTitle: "เมนู",
    navLabel: "หมวดหมู่",
    navSite: "เว็บไซต์",
    navStaff: "แผงพนักงาน",
    navBusiness: "สำหรับธุรกิจ",
    open: "เปิด",
    close: "ปิด",
    remove: "ลบ",
    basket: "ตะกร้า",
    items: "ชิ้น",
    total: "ยอดรวม",

    catalogErrorTitle: "ไม่สามารถแสดงเมนูได้",
    catalogErrorBody: "โหลดเมนูของวันนี้ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง หรือสอบถามพนักงานของเรา",
    catalogRetry: "ลองอีกครั้ง",
    catalogEmpty: "ขณะนี้ยังไม่มีรายการในเมนู กรุณาสอบถามพนักงานของเรา",
    filterAll: "ทั้งหมด",
    tagNew: "ใหม่",
    tagSale: "ลดราคา",

    taste: "รสชาติ",
    terpenes: "เทอร์พีน",
    savingLabel: "ประหยัด",
    savingHint: "{qty} {unit} — ประหยัด {amount}฿",
    updateCta: "อัปเดต",

    idleTitle: "ยังอยู่ไหม?",
    idleBody: "หน้าจอนี้ใช้ร่วมกัน เราจะล้างตะกร้าใน {seconds} วินาที เพื่อให้ลูกค้าคนถัดไปเริ่มใหม่",
    idleStay: "ยังอยู่",

    // Order flow (kiosk)
    orderTitle: "รายการสั่งซื้อของคุณ",
    emptyCart: "ตะกร้าสินค้าว่างเปล่า",
    placeOrder: "ยืนยันคำสั่งซื้อ",
    orderPlacedTitle: "คำสั่งซื้อ #{id}",
    showStaffLine: "แสดงหน้าจอนี้ให้พนักงานของเราเพื่อดำเนินการสั่งซื้อให้เสร็จสมบูรณ์",
    newOrderCta: "เริ่มคำสั่งซื้อใหม่",

    // Home page
    heroDoorCertTitle: "รับใบรับรอง\nทางการแพทย์",
    heroDoorMenuTitle: "ดูเมนู\nวันนี้",
    heroDoorCertLine: "ฟรี รับใบรับรองในวันถัดไป — อุ่นใจได้ตามกฎหมาย",
    heroDoorMenuLine: "สินค้าครบครัน พร้อมจำหน่ายเสมอ",
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    reviewsLabel: "รีวิว",
    // Deliberately English, not translated — see the "en" entry's comment.
    aboutLead: "Licensed dispensary. Full menu, live prices.",
    aboutPhotoLabel: "ภาพร้าน — เร็วๆ นี้",
    certSteps: [
      { title: "ส่ง", description: "คำขอของคุณภายในหนึ่งนาที" },
      { title: "ยืนยัน", description: "รายละเอียดกับผู้จัดการของเรา" },
      { title: "รับ", description: "ใบรับรองของคุณในวันถัดไป" },
    ],
    contactsTitle: "ติดต่อและติดตามเรา",
    footerDisclaimer: "อายุ 18 ปีขึ้นไป จำหน่ายเฉพาะผู้มีบัตร PT.33 ที่ยังไม่หมดอายุ ข้อมูลอ้างอิงเท่านั้น ไม่ใช่การโฆษณา",

    demoBarLabel: "ร้านสาธิต — ข้อมูลตัวอย่าง",
    demoBarCta: "กลับไปที่ buds.digital",

    consultCta: "ใบรับรองทางการแพทย์",
    consultNameLabel: "ชื่อ",
    consultPhoneLabel: "เบอร์โทรศัพท์",
    consultPhoneCodeOther: "อื่นๆ…",
    consultConsentLabel: "ฉันยินยอมให้ประมวลผลข้อมูลส่วนบุคคลของฉันตาม PDPA",
    consultSubmitCta: "ส่งคำขอ",
    consultSuccessTitle: "ส่งคำขอแล้ว",
    consultSuccessHeadline: "ได้รับคำขอแล้ว\nเราจะยืนยันทาง WhatsApp ภายในหนึ่งชั่วโมง",
    consultSuccessNote: "ในเวอร์ชันของคุณ คำขอนี้จะเข้าแผงพนักงาน /staff",

    contactsTooltip: "ตรงนี้จะเป็น LINE · WhatsApp · Instagram ของคุณ",
    reviewsTooltip: "ตรงนี้จะแสดงคะแนนและรีวิว Google ของคุณ",
    mapOpenCta: "เปิดใน Google แผนที่",
  }
};
