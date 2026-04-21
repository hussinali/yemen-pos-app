# Yemen POS System - تقنيات البرمجة والإعداد

## 🛠️ لغات وتقنيات البرمجة المستخدمة

### الواجهة الأمامية (Frontend)
- **TypeScript** - لغة برمجة آمنة مع نظام أنواع قوي
- **React 19** - مكتبة واجهات المستخدم
- **Tailwind CSS 4** - إطار عمل تصميم الواجهات
- **Vite** - أداة بناء وتطوير سريعة

### الخادم (Backend)
- **Node.js** - بيئة تشغيل JavaScript على الخادم
- **Express.js** - إطار عمل الويب
- **TypeScript** - لغة البرمجة
- **tRPC** - نظام استدعاء الإجراءات عن بعد الآمن

### قاعدة البيانات
- **MySQL/TiDB** - قاعدة بيانات علائقية
- **Drizzle ORM** - أداة تعامل مع قاعدة البيانات

### الاختبار
- **Vitest** - إطار عمل الاختبارات

### أدوات التطوير
- **pnpm** - مدير الحزم
- **Drizzle Kit** - أداة إدارة الهجرات

---

## 📋 متطلبات التشغيل الأوفلاين

### المتطلبات الأساسية:
1. **Node.js** (الإصدار 18 أو أحدث)
2. **pnpm** أو **npm**
3. **MySQL** أو **MariaDB** (قاعدة بيانات محلية)

### خطوات التثبيت والتشغيل:

#### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd yemen-pos-app
```

#### 2. تثبيت المكتبات
```bash
pnpm install
```

#### 3. إعداد قاعدة البيانات المحلية
```bash
# إنشاء قاعدة بيانات MySQL محلية
mysql -u root -p
CREATE DATABASE yemen_pos;
USE yemen_pos;
```

#### 4. تعديل متغيرات البيئة
أنشئ ملف `.env` في جذر المشروع:
```env
DATABASE_URL="mysql://root:password@localhost:3306/yemen_pos"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

#### 5. تطبيق الهجرات على قاعدة البيانات
```bash
pnpm db:push
```

#### 6. تشغيل خادم التطوير
```bash
pnpm dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

---

## 🏗️ بنية المشروع

```
yemen-pos-app/
├── client/                 # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── components/    # مكونات قابلة لإعادة الاستخدام
│   │   ├── lib/           # مكتبات مساعدة
│   │   └── index.css      # أنماط عامة
│   └── index.html
├── server/                # الخادم (Node.js + Express)
│   ├── routers/           # مسارات tRPC
│   ├── db.ts              # مساعدات قاعدة البيانات
│   └── routers.ts         # تعريف جميع المسارات
├── drizzle/               # إدارة قاعدة البيانات
│   ├── schema.ts          # تعريف الجداول
│   └── migrations/        # ملفات الهجرات
├── package.json           # المكتبات والنصوص
└── tsconfig.json          # إعدادات TypeScript
```

---

## 🚀 أوامر مهمة

| الأمر | الوصف |
|------|-------|
| `pnpm dev` | تشغيل خادم التطوير |
| `pnpm build` | بناء المشروع للإنتاج |
| `pnpm start` | تشغيل النسخة المبنية |
| `pnpm test` | تشغيل الاختبارات |
| `pnpm db:push` | تطبيق الهجرات على قاعدة البيانات |
| `pnpm format` | تنسيق الكود |

---

## 💾 نسخ احتياطية من البيانات

### تصدير البيانات من MySQL:
```bash
mysqldump -u root -p yemen_pos > backup.sql
```

### استيراد البيانات:
```bash
mysql -u root -p yemen_pos < backup.sql
```

---

## 🔒 الأمان والخصوصية

- جميع البيانات محفوظة محلياً على جهازك
- لا توجد اتصالات خارجية عند التشغيل الأوفلاين
- كلمات المرور مشفرة في قاعدة البيانات
- سجل التدقيق يسجل جميع العمليات الحساسة

---

## 📞 الدعم والمساعدة

للمزيد من المعلومات، راجع:
- [توثيق React](https://react.dev)
- [توثيق tRPC](https://trpc.io)
- [توثيق Drizzle ORM](https://orm.drizzle.team)
- [توثيق Tailwind CSS](https://tailwindcss.com)
