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
  medTitle: string;
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
    addressLabel: "Address",
    hoursLabel: "Working hours",
    viewMenuCta: "View Menu",
    medTitle: "Medical Pass PT.33",
    medDesc: "Visit us in-store for a free consultation and on-site PT.33 certificate issuance with a licensed Thai medical practitioner.",
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
    addressLabel: "Адрес",
    hoursLabel: "Часы работы",
    viewMenuCta: "Открыть меню",
    medTitle: "Медицинский рецепт PT.33",
    medDesc: "Приходите к нам — бесплатная консультация и оформление справки PT.33 на месте у лицензированного врача Таиланда.",
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
    addressLabel: "ที่อยู่",
    hoursLabel: "เวลาทำการ",
    viewMenuCta: "ดูเมนู",
    medTitle: "ใบรับรองแพทย์ PT.33",
    medDesc: "แวะมาที่ร้านเพื่อรับคำปรึกษาฟรีและออกใบรับรอง PT.33 ที่ร้านโดยแพทย์ผู้ได้รับใบอนุญาตในประเทศไทย",
    contactsTitle: "ติดต่อและติดตามเรา",
  }
};
