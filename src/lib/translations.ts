export type Language = 'en' | 'ru' | 'th';

export interface TranslationDictionary {
  // Header & Navigation
  updates: string;
  sales: string;
  accessories: string;
  open: string;
  close: string;
  basket: string;
  items: string;
  total: string;

  // Order flow (kiosk)
  orderTitle: string;
  emptyCart: string;
  placeOrder: string;
  orderPlacedTitle: string;
  showStaffLine: string;
  newOrderCta: string;

  // Home page
  heroDoorCertTitle: string;
  heroDoorCertSubtitle: string;
  heroDoorCertMicroCta: string;
  heroDoorMenuTitle: string;
  heroDoorMenuSubtitle: string;
  heroDoorMenuMicroCta: string;
  // "Cannabis. Done properly." is hardcoded in English across all locales
  // (not translated) — see HomeClient.
  addressLabel: string;
  hoursLabel: string;
  reviewsLabel: string;
  aboutLead: string;
  aboutPhotoLabel: string;
  certSteps: [string, string, string];
  contactsTitle: string;
  footerDisclaimer: [string, string];

  // Free consultation request form
  consultCta: string;
  consultNameLabel: string;
  consultPhoneLabel: string;
  consultConsentLabel: string;
  consultSubmitCta: string;
  consultSuccessMessage: string;
  consultErrorMessage: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Header & Navigation
    updates: "New",
    sales: "Sales",
    accessories: "Accessories",
    open: "Open",
    close: "Close",
    basket: "Basket",
    items: "items",
    total: "Total",

    // Order flow (kiosk)
    orderTitle: "Your Order",
    emptyCart: "Your cart is empty",
    placeOrder: "Place Order",
    orderPlacedTitle: "Order #{id}",
    showStaffLine: "Show this screen to our staff to complete your order",
    newOrderCta: "Start New Order",

    // Home page
    heroDoorCertTitle: "Get Your Certificate",
    heroDoorCertSubtitle: "Free, on the spot — stay legally protected",
    heroDoorCertMicroCta: "Takes 2 minutes",
    heroDoorMenuTitle: "Browse the Menu",
    heroDoorMenuSubtitle: "What we have in shop",
    heroDoorMenuMicroCta: "See today's stock",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    reviewsLabel: "Reviews",
    aboutLead: "What a modern dispensary should feel like",
    aboutPhotoLabel: "Interior photo coming soon",
    certSteps: [
      "Visit the store",
      "Free consultation with a licensed physician",
      "Certificate issued, no paperwork required",
    ],
    contactsTitle: "Contact & Follow",
    footerDisclaimer: [
      "18+. Medical cannabis is dispensed only with a valid PT.33 medical card.",
      "Information on this site is for reference only and does not constitute cannabis advertising.",
    ],

    consultCta: "Request a Free Consultation",
    consultNameLabel: "Name",
    consultPhoneLabel: "Phone",
    consultConsentLabel: "I agree to the processing of my personal data in accordance with PDPA.",
    consultSubmitCta: "Send Request",
    consultSuccessMessage: "Thanks — we'll reach out on LINE to confirm your visit.",
    consultErrorMessage: "Something went wrong. Please try again or contact us on LINE.",
  },
  ru: {
    // Header & Navigation
    updates: "Новинки",
    sales: "Распродажа",
    accessories: "Аксессуары",
    open: "Открыть",
    close: "Закрыть",
    basket: "Корзина",
    items: "тов.",
    total: "Итого",

    // Order flow (kiosk)
    orderTitle: "Ваш заказ",
    emptyCart: "Корзина пуста",
    placeOrder: "Оформить заказ",
    orderPlacedTitle: "Заказ №{id}",
    showStaffLine: "Покажите этот экран нашему сотруднику, чтобы завершить заказ",
    newOrderCta: "Новый заказ",

    // Home page
    heroDoorCertTitle: "Оформить справку",
    heroDoorCertSubtitle: "Бесплатная консультация, справка сразу на месте",
    heroDoorCertMicroCta: "Займёт 2 минуты",
    heroDoorMenuTitle: "Смотреть меню",
    heroDoorMenuSubtitle: "Цветы, джойнты и аксессуары",
    heroDoorMenuMicroCta: "Смотреть наличие на сегодня",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    reviewsLabel: "Отзывы",
    aboutLead: "Каким должен быть современный диспансер",
    aboutPhotoLabel: "Фото интерьера — скоро",
    certSteps: [
      "Приходите в магазин",
      "Бесплатная консультация лицензированного врача",
      "Справка выдаётся сразу — без бумажной волокиты",
    ],
    contactsTitle: "Контакты и соцсети",
    footerDisclaimer: [
      "18+. Медицинский каннабис отпускается только при наличии действующей карты PT.33/гос.образца.",
      "Информация на сайте носит справочный характер и не является рекламой каннабиса.",
    ],

    consultCta: "Запросить бесплатную консультацию",
    consultNameLabel: "Имя",
    consultPhoneLabel: "Телефон",
    consultConsentLabel: "Я согласен(на) на обработку персональных данных в соответствии с PDPA.",
    consultSubmitCta: "Отправить заявку",
    consultSuccessMessage: "Спасибо — мы свяжемся с вами в LINE, чтобы подтвердить визит.",
    consultErrorMessage: "Что-то пошло не так. Попробуйте ещё раз или напишите нам в LINE.",
  },
  th: {
    // Header & Navigation
    updates: "มาใหม่",
    sales: "ลดราคา",
    accessories: "อุปกรณ์เสริม",
    open: "เปิด",
    close: "ปิด",
    basket: "ตะกร้า",
    items: "ชิ้น",
    total: "ยอดรวม",

    // Order flow (kiosk)
    orderTitle: "รายการสั่งซื้อของคุณ",
    emptyCart: "ตะกร้าสินค้าว่างเปล่า",
    placeOrder: "ยืนยันคำสั่งซื้อ",
    orderPlacedTitle: "คำสั่งซื้อ #{id}",
    showStaffLine: "แสดงหน้าจอนี้ให้พนักงานของเราเพื่อดำเนินการสั่งซื้อให้เสร็จสมบูรณ์",
    newOrderCta: "เริ่มคำสั่งซื้อใหม่",

    // Home page
    heroDoorCertTitle: "ขอใบรับรองของคุณ",
    heroDoorCertSubtitle: "ปรึกษาฟรี ออกใบรับรองทันทีที่ร้าน",
    heroDoorCertMicroCta: "ใช้เวลาแค่ 2 นาที",
    heroDoorMenuTitle: "ดูเมนู",
    heroDoorMenuSubtitle: "ดอก โจ๊ยท์ และอุปกรณ์เสริม",
    heroDoorMenuMicroCta: "ดูสต๊อกวันนี้",
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    reviewsLabel: "รีวิว",
    aboutLead: "นี่คือสิ่งที่ร้านกัญชาสมัยใหม่ควรจะเป็น",
    aboutPhotoLabel: "ภาพภายในร้าน — เร็วๆ นี้",
    certSteps: [
      "มาที่ร้าน",
      "ปรึกษาฟรีกับแพทย์ผู้ได้รับใบอนุญาต",
      "ออกใบรับรองทันที — ไม่ต้องเตรียมเอกสาร",
    ],
    contactsTitle: "ติดต่อและติดตามเรา",
    footerDisclaimer: [
      "อายุ 18 ปีขึ้นไป กัญชาทางการแพทย์จำหน่ายเฉพาะผู้ที่มีบัตรรับรองทางการแพทย์ (PT.33) ที่ยังไม่หมดอายุเท่านั้น",
      "ข้อมูลบนเว็บไซต์นี้มีไว้เพื่อการอ้างอิงเท่านั้น ไม่ถือเป็นการโฆษณากัญชา",
    ],

    consultCta: "ขอรับคำปรึกษาฟรี",
    consultNameLabel: "ชื่อ",
    consultPhoneLabel: "เบอร์โทรศัพท์",
    consultConsentLabel: "ฉันยินยอมให้ประมวลผลข้อมูลส่วนบุคคลของฉันตาม PDPA",
    consultSubmitCta: "ส่งคำขอ",
    consultSuccessMessage: "ขอบคุณ — เราจะติดต่อคุณทาง LINE เพื่อยืนยันการเข้าร้าน",
    consultErrorMessage: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งหรือติดต่อเราทาง LINE",
  }
};
