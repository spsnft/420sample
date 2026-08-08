export type Language = 'en' | 'ru' | 'th';

export interface CertStep {
  title: string;
  description: string;
}

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
  heroDoorCertLine: string;
  heroDoorMenuLine: string;
  // "Cannabis. Done properly." is hardcoded in English across all locales
  // (not translated) — see HomeClient. Hero card titles ("Get Medical
  // Certificate" / "Explore The Today's Menu") are hardcoded the same way.
  addressLabel: string;
  hoursLabel: string;
  reviewsLabel: string;
  aboutLead: string;
  aboutPhotoLabel: string;
  certSteps: [CertStep, CertStep, CertStep];
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
    heroDoorCertLine: "Free, on the spot — stay legally protected",
    heroDoorMenuLine: "Full selection, always in stock",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    reviewsLabel: "Reviews",
    aboutLead: "What a modern dispensary should feel like",
    aboutPhotoLabel: "Interior photo coming soon",
    certSteps: [
      { title: "Send", description: "your request within a minute" },
      { title: "Confirm", description: "details with our manager" },
      { title: "Receive", description: "your certificate the next day" },
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
    heroDoorCertLine: "Бесплатно, на месте — под защитой закона",
    heroDoorMenuLine: "Полный ассортимент, всегда в наличии",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    reviewsLabel: "Отзывы",
    aboutLead: "Каким должен быть современный диспансер",
    aboutPhotoLabel: "Фото интерьера — скоро",
    certSteps: [
      { title: "Отправьте", description: "заявку в течение минуты" },
      { title: "Подтвердите", description: "детали с нашим менеджером" },
      { title: "Получите", description: "справку на следующий день" },
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
    heroDoorCertLine: "ฟรี ออกทันทีที่ร้าน — อุ่นใจได้ตามกฎหมาย",
    heroDoorMenuLine: "สินค้าครบครัน พร้อมจำหน่ายเสมอ",
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    reviewsLabel: "รีวิว",
    aboutLead: "นี่คือสิ่งที่ร้านกัญชาสมัยใหม่ควรจะเป็น",
    aboutPhotoLabel: "ภาพภายในร้าน — เร็วๆ นี้",
    certSteps: [
      { title: "ส่ง", description: "คำขอของคุณภายในหนึ่งนาที" },
      { title: "ยืนยัน", description: "รายละเอียดกับผู้จัดการของเรา" },
      { title: "รับ", description: "ใบรับรองของคุณในวันถัดไป" },
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
