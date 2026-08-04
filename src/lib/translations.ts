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
  heroTagline: string;
  addressLabel: string;
  hoursLabel: string;
  viewMenuCta: string;
  aboutTitle: string;
  aboutDesc: string[];
  aboutPhotoLabel: string;
  facadePhotoLabel: string;
  medTitle: string;
  medSubtitle: string;
  medSteps: [string, string, string];
  medPills: [string, string, string];
  menuTeaserTitle: string;
  menuTeaserCta: string;
  contactsTitle: string;
  footerDisclaimer: [string, string];
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
    heroTagline: "Your trusted access to medical cannabis",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    viewMenuCta: "View Menu",
    aboutTitle: "About Us",
    aboutDesc: [
      "420 Store is a showcase of what a modern dispensary in Thailand looks like.",
      "We operate strictly within the law: every guest gets a free consultation with a licensed physician and an official medical card issued on the spot, no paperwork required.",
      "A relaxed atmosphere and attentive staff — for those who value comfort and transparency.",
      "Great selection and fair prices — for those who know quality when they see it",
    ],
    aboutPhotoLabel: "Interior photo coming soon",
    facadePhotoLabel: "Facade photo coming soon",
    medTitle: "Get your 420-Pass — same day, on site",
    medSubtitle: "Officially: Medical Pass PT.33",
    medSteps: [
      "Visit the store",
      "Free consultation with a licensed physician",
      "Certificate issued same day — no paperwork",
    ],
    medPills: ["Free", "Same-day", "No paperwork"],
    menuTeaserTitle: "What's on the menu",
    menuTeaserCta: "View Full Menu",
    contactsTitle: "Contact & Follow",
    footerDisclaimer: [
      "18+. Medical cannabis is dispensed only with a valid PT.33 medical card.",
      "Information on this site is for reference only and does not constitute cannabis advertising.",
    ],
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
    heroTagline: "Надёжный доступ к медицинскому каннабису",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    viewMenuCta: "Открыть меню",
    aboutTitle: "О нас",
    aboutDesc: [
      "420 Store — образец современного диспенсари в Таиланде.",
      "Работаем строго по закону: каждый гость получает бесплатную консультацию лицензированного врача и медицинскую карту гос.образца на месте, без лишних бумаг.",
      "Уютная атмосфера и внимательный персонал — для тех, кто ценит комфорт и прозрачность.",
      "Отличный выбор и приятные цены — для тех, кто знает толк в качественных продуктах!",
    ],
    aboutPhotoLabel: "Фото интерьера — скоро",
    facadePhotoLabel: "Фото фасада — скоро",
    medTitle: "Получите 420-Pass — в этот же день, на месте",
    medSubtitle: "Официально: Medical Pass PT.33",
    medSteps: [
      "Приходите в магазин",
      "Бесплатная консультация лицензированного врача",
      "Справка выдаётся в тот же день — без бумажной волокиты",
    ],
    medPills: ["Бесплатно", "В тот же день", "Без бумаг"],
    menuTeaserTitle: "Что в меню",
    menuTeaserCta: "Открыть полное меню",
    contactsTitle: "Контакты и соцсети",
    footerDisclaimer: [
      "18+. Медицинский каннабис отпускается только при наличии действующей карты PT.33/гос.образца.",
      "Информация на сайте носит справочный характер и не является рекламой каннабиса.",
    ],
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
    heroTagline: "การเข้าถึงกัญชาทางการแพทย์ที่เชื่อถือได้",
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    viewMenuCta: "ดูเมนู",
    aboutTitle: "เกี่ยวกับเรา",
    aboutDesc: [
      "420 Store คือตัวอย่างร้านจำหน่ายกัญชาสมัยใหม่ในประเทศไทย",
      "เราดำเนินธุรกิจอย่างถูกต้องตามกฎหมาย ลูกค้าทุกท่านจะได้รับคำปรึกษาฟรีจากแพทย์ผู้มีใบอนุญาต พร้อมออกบัตรรับรองทางการแพทย์ให้ทันทีโดยไม่ต้องใช้เอกสารยุ่งยาก",
      "บรรยากาศอบอุ่นและพนักงานที่ใส่ใจ เหมาะสำหรับผู้ที่ให้คุณค่ากับความสะดวกสบายและความโปร่งใส",
      "สินค้าคุณภาพดีในราคาที่คุ้มค่า สำหรับผู้ที่รู้จักเลือกสินค้าคุณภาพ!",
    ],
    aboutPhotoLabel: "ภาพภายในร้าน — เร็วๆ นี้",
    facadePhotoLabel: "ภาพหน้าร้าน — เร็วๆ นี้",
    medTitle: "รับ 420-Pass ของคุณ — วันเดียวจบ ที่ร้านเลย",
    medSubtitle: "ชื่อทางการ: Medical Pass PT.33",
    medSteps: [
      "มาที่ร้าน",
      "ปรึกษาฟรีกับแพทย์ผู้ได้รับใบอนุญาต",
      "ออกใบรับรองในวันเดียวกัน — ไม่ต้องเตรียมเอกสาร",
    ],
    medPills: ["ฟรี", "วันเดียวจบ", "ไม่ต้องใช้เอกสาร"],
    menuTeaserTitle: "มีอะไรในเมนูบ้าง",
    menuTeaserCta: "ดูเมนูทั้งหมด",
    contactsTitle: "ติดต่อและติดตามเรา",
    footerDisclaimer: [
      "อายุ 18 ปีขึ้นไป กัญชาทางการแพทย์จำหน่ายเฉพาะผู้ที่มีบัตรรับรองทางการแพทย์ (PT.33) ที่ยังไม่หมดอายุเท่านั้น",
      "ข้อมูลบนเว็บไซต์นี้มีไว้เพื่อการอ้างอิงเท่านั้น ไม่ถือเป็นการโฆษณากัญชา",
    ],
  }
};
