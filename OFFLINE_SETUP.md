# دليل التشغيل الأوفلاين - نظام Yemen POS

## 🎯 الخطوات السريعة للتشغيل المحلي

### المرحلة 1: التحضير (5 دقائق)

#### 1.1 تثبيت البرامج المطلوبة

**Windows:**
- تحميل [Node.js](https://nodejs.org/) (اختر LTS)
- تحميل [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- تحميل [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (اختياري)

**macOS:**
```bash
# باستخدام Homebrew
brew install node
brew install mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm mysql-server
```

#### 1.2 التحقق من التثبيت
```bash
node --version    # يجب أن يكون v18+
npm --version
mysql --version
```

---

### المرحلة 2: إعداد قاعدة البيانات (10 دقائق)

#### 2.1 بدء خدمة MySQL

**Windows:**
- افتح Services (services.msc)
- ابحث عن MySQL80 وابدأها

**macOS/Linux:**
```bash
# بدء MySQL
sudo systemctl start mysql
# أو
brew services start mysql
```

#### 2.2 إنشاء قاعدة البيانات
```bash
# الاتصال بـ MySQL
mysql -u root -p

# ثم أدخل كلمة المرور (إن وجدت) وأكتب:
CREATE DATABASE yemen_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pos_user'@'localhost' IDENTIFIED BY 'pos_password_123';
GRANT ALL PRIVILEGES ON yemen_pos.* TO 'pos_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### المرحلة 3: تثبيت المشروع (10 دقائق)

#### 3.1 نسخ المشروع
```bash
# إذا كان لديك Git
git clone <repository-url>
cd yemen-pos-app

# أو انسخ المجلد مباشرة
```

#### 3.2 تثبيت المكتبات
```bash
# تثبيت pnpm أولاً (مدير الحزم الموصى به)
npm install -g pnpm

# ثم تثبيت مكتبات المشروع
pnpm install
```

#### 3.3 إعداد متغيرات البيئة
أنشئ ملف `.env` في جذر المشروع:

```env
# قاعدة البيانات
DATABASE_URL="mysql://pos_user:pos_password_123@localhost:3306/yemen_pos"

# الأمان
JWT_SECRET="your-super-secret-key-change-this-in-production"

# البيئة
NODE_ENV="development"

# OAuth (اختياري للتشغيل المحلي)
VITE_APP_ID="local-dev"
OAUTH_SERVER_URL="http://localhost:3000"
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
```

---

### المرحلة 4: تطبيق الهجرات (5 دقائق)

```bash
# تطبيق جميع جداول قاعدة البيانات
pnpm db:push
```

---

### المرحلة 5: التشغيل (2 دقيقة)

```bash
# بدء خادم التطوير
pnpm dev
```

**النتيجة المتوقعة:**
```
Server running on http://localhost:3000/
```

افتح المتصفح على: **http://localhost:3000**

---

## 🎮 الاستخدام الأول

1. **تسجيل الدخول**: استخدم بيانات اعتماد Manus (أو سجل حساب جديد)
2. **لوحة التحكم**: ستظهر لك الصفحة الرئيسية
3. **إضافة منتجات**: انقر على "إدارة المنتجات"
4. **البيع**: انقر على "بيع جديد" لبدء عملية بيع

---

## 🔧 استكشاف الأخطاء

### المشكلة: "Cannot connect to database"
**الحل:**
```bash
# تحقق من أن MySQL قيد التشغيل
mysql -u pos_user -p -e "SELECT 1"

# تحقق من DATABASE_URL في .env
```

### المشكلة: "Port 3000 already in use"
**الحل:**
```bash
# استخدم منفذ مختلف
PORT=3001 pnpm dev
```

### المشكلة: "Module not found"
**الحل:**
```bash
# أعد تثبيت المكتبات
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📊 قاعدة البيانات

### الوصول إلى قاعدة البيانات مباشرة:
```bash
mysql -u pos_user -p yemen_pos

# أوامر مفيدة:
SHOW TABLES;
SELECT COUNT(*) FROM products;
SELECT * FROM sales LIMIT 10;
```

### عمل نسخة احتياطية:
```bash
mysqldump -u pos_user -p yemen_pos > backup_$(date +%Y%m%d).sql
```

### استعادة نسخة احتياطية:
```bash
mysql -u pos_user -p yemen_pos < backup_20240101.sql
```

---

## 🛑 إيقاف التطبيق

```bash
# اضغط Ctrl+C في نافذة الطرفية
```

---

## 📱 الوصول من أجهزة أخرى على الشبكة المحلية

```bash
# ابحث عن IP الجهاز
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig               # Windows

# ثم استخدم: http://YOUR_IP:3000
```

---

## 🚀 النشر على الإنتاج

```bash
# بناء النسخة الإنتاجية
pnpm build

# تشغيل النسخة المبنية
pnpm start
```

---

## 📝 ملاحظات مهمة

✅ البيانات محفوظة محلياً بالكامل
✅ لا توجد اتصالات خارجية (أوفلاين تماماً)
✅ يمكنك إيقاف الخادم في أي وقت
✅ جميع البيانات آمنة على جهازك

---

## 📞 الدعم

للمساعدة:
1. تحقق من ملفات السجل في `.manus-logs/`
2. تأكد من تثبيت جميع المتطلبات
3. جرب إعادة تشغيل MySQL والخادم
