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
  ratingReviews: string;
  addressLabel: string;
  hoursLabel: string;
  viewMenuCta: string;
  medTitle: string;
  medSubtitle: string;
  medDesc: string;
  contactsTitle: string;
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
    heroTagline: "Presence, Compliance, Ordering — One Platform",
    ratingReviews: "Google reviews",
    addressLabel: "Address",
    hoursLabel: "Working hours",
    viewMenuCta: "View Menu",
    medTitle: "Get your 420-Pass — same day, on site",
    medSubtitle: "Officially: Medical Pass PT.33",
    medDesc: "Free consultation with a licensed physician. Certificate issued on the spot — no paperwork needed.",
    contactsTitle: "Contact & Follow",
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
    heroTagline: "Presence, Compliance, Ordering — One Platform",
    ratingReviews: "отзывов в Google",
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    viewMenuCta: "Открыть меню",
    medTitle: "Получите 420-Pass — в этот же день, на месте",
    medSubtitle: "Официально: Medical Pass PT.33",
    medDesc: "Бесплатная консультация лицензированного врача. Справка выдаётся на месте — без бумажной волокиты.",
    contactsTitle: "Контакты и соцсети",
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
    heroTagline: "Presence, Compliance, Ordering — One Platform",
    ratingReviews: "รีวิวจาก Google",
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    viewMenuCta: "ดูเมนู",
    medTitle: "รับ 420-Pass ของคุณ — วันเดียวจบ ที่ร้านเลย",
    medSubtitle: "ชื่อทางการ: Medical Pass PT.33",
    medDesc: "ปรึกษาฟรีกับแพทย์ผู้ได้รับใบอนุญาต ออกใบรับรองทันทีที่ร้าน ไม่ต้องเตรียมเอกสาร",
    contactsTitle: "ติดต่อและติดตามเรา",
  }
};
