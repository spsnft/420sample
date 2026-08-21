import type { Language } from "@/lib/translations"

export interface PrivacySection {
  title: string;
  body: string;
}

export interface PrivacyDictionary {
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  contactTitle: string;
  contactBody: string;
}

// Shown at /privacy, linked from the consultation form's PDPA consent line
// and from the pitch page's footer. Plain-language and short by design —
// this is a demo instance, not a real dispensary's registered data
// controller, and says so.
export const privacyTranslations: Record<Language, PrivacyDictionary> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: 2026",
    intro: "This page explains what personal data this site collects, why, and how it is used. This is a demo instance built to show what a real dispensary's site and staff panel look like — no real customer data is collected here.",
    sections: [
      {
        title: "What we collect",
        body: "On the public site: the name and phone number you submit through the \"Free Consultation\" request form. In the PT.33 staff panel: client names, PT.33 prescription details and sale records entered by staff for compliance record-keeping.",
      },
      {
        title: "Why we collect it",
        body: "Consultation requests are used only to contact you on LINE or by phone to confirm a visit. PT.33 client and sale records exist so a dispensary can show, on request, what was dispensed to whom and under which valid prescription — a legal requirement for a Thai medical cannabis dispensary, not a marketing use.",
      },
      {
        title: "Who sees it",
        body: "Consultation requests go to this shop's own staff. PT.33 records are visible only to signed-in staff accounts on this instance, and are never shared with third parties or used for advertising.",
      },
      {
        title: "How long we keep it",
        body: "Consultation requests are kept only as long as needed to follow up on the visit. PT.33 records are kept for as long as Thai dispensary compliance record-keeping requires.",
      },
    ],
    contactTitle: "Questions",
    contactBody: "For questions about this policy or a request to delete your data, message us on WhatsApp or LINE using the links on this page.",
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Обновлено: 2026",
    intro: "На этой странице объясняется, какие персональные данные собирает этот сайт, зачем и как они используются. Это демо-инстанс, созданный, чтобы показать, как выглядит сайт и панель персонала реального диспенсари — реальные данные клиентов здесь не собираются.",
    sections: [
      {
        title: "Что мы собираем",
        body: "На публичном сайте — имя и номер телефона, которые вы указываете в форме «Бесплатная консультация». В панели персонала PT.33 — имена клиентов, данные рецептов PT.33 и записи о продажах, которые вносит персонал для учёта.",
      },
      {
        title: "Зачем мы это собираем",
        body: "Заявки на консультацию используются только для того, чтобы связаться с вами в LINE или по телефону и подтвердить визит. Записи клиентов и продаж PT.33 нужны, чтобы диспенсари мог по запросу показать, кому и по какому действующему рецепту был отпущен товар — это требование закона для диспенсари в Таиланде, а не маркетинговое использование.",
      },
      {
        title: "Кто это видит",
        body: "Заявки на консультацию видит персонал магазина. Записи PT.33 доступны только авторизованным сотрудникам в этом инстансе и никогда не передаются третьим лицам и не используются в рекламе.",
      },
      {
        title: "Как долго мы это храним",
        body: "Заявки на консультацию хранятся только до завершения визита. Записи PT.33 хранятся столько, сколько требует законодательство Таиланда об учёте в диспенсари.",
      },
    ],
    contactTitle: "Вопросы",
    contactBody: "По вопросам об этой политике или с запросом на удаление данных напишите нам в WhatsApp или LINE по ссылкам на этой странице.",
  },
  th: {
    title: "นโยบายความเป็นส่วนตัว",
    updated: "อัปเดตล่าสุด: 2026",
    intro: "หน้านี้อธิบายว่าเว็บไซต์นี้เก็บข้อมูลส่วนบุคคลอะไรบ้าง เพื่ออะไร และใช้งานอย่างไร นี่คือระบบสาธิตที่สร้างขึ้นเพื่อแสดงหน้าตาเว็บไซต์และแผงพนักงานของร้านจำหน่ายกัญชาจริง — ไม่มีการเก็บข้อมูลลูกค้าจริงที่นี่",
    sections: [
      {
        title: "ข้อมูลที่เราเก็บ",
        body: "บนหน้าเว็บสาธารณะ: ชื่อและเบอร์โทรศัพท์ที่คุณกรอกในแบบฟอร์ม \"คำปรึกษาฟรี\" ในแผงพนักงาน PT.33: ชื่อลูกค้า รายละเอียดใบสั่งยา PT.33 และบันทึกการขายที่พนักงานกรอกเพื่อการปฏิบัติตามกฎหมาย",
      },
      {
        title: "เหตุผลที่เราเก็บ",
        body: "คำขอคำปรึกษาใช้เพื่อติดต่อคุณทาง LINE หรือโทรศัพท์เพื่อยืนยันการเข้าร้านเท่านั้น บันทึกลูกค้าและการขาย PT.33 มีไว้เพื่อให้ร้านสามารถแสดงได้ตามคำขอว่าจ่ายยาให้ใครและภายใต้ใบสั่งยาที่ยังใช้ได้ใบใด ซึ่งเป็นข้อกำหนดทางกฎหมายสำหรับร้านจำหน่ายกัญชาทางการแพทย์ในประเทศไทย ไม่ใช่การใช้เพื่อการตลาด",
      },
      {
        title: "ใครเห็นข้อมูลนี้",
        body: "คำขอคำปรึกษาจะส่งถึงพนักงานของร้านเท่านั้น บันทึก PT.33 มองเห็นได้เฉพาะบัญชีพนักงานที่เข้าสู่ระบบในระบบนี้ และไม่มีการแชร์กับบุคคลที่สามหรือนำไปใช้เพื่อโฆษณา",
      },
      {
        title: "เราเก็บข้อมูลไว้นานเท่าใด",
        body: "คำขอคำปรึกษาจะถูกเก็บไว้เท่าที่จำเป็นสำหรับการติดตามการเข้าร้าน บันทึก PT.33 จะถูกเก็บไว้ตามระยะเวลาที่กฎหมายไทยกำหนดสำหรับการเก็บบันทึกของร้านจำหน่ายกัญชา",
      },
    ],
    contactTitle: "หากมีคำถาม",
    contactBody: "หากมีคำถามเกี่ยวกับนโยบายนี้หรือต้องการขอลบข้อมูลของคุณ ทักหาเราทาง WhatsApp หรือ LINE ผ่านลิงก์บนหน้านี้",
  },
};
