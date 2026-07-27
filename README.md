# موقع خطة نمو دام

عرض ويب تفاعلي لخطة نمو منصة دام (90 يومًا) + الملفات المساندة.

## المحتويات

| الملف | الوصف |
|---|---|
| `index.html` | الصفحة الرئيسية — الخطة كاملة بشكل تفاعلي |
| `pages/report.html` | التقييم الكامل (14 قسمًا) |
| `pages/competitors.html` | تحليل المنافسين والتموضع |
| `pages/eastern.html` | المنطقة الشرقية: السوق والفرصة |
| `pages/platform-review.html` | مراجعة المنصة والتطبيقات بالحلول التقنية |
| `pages/protection.html` | دفتر حماية الأصول الرقمية |
| `assets/` | الخطوط والمكتبات والصور — كلها محلية (يشتغل بلا إنترنت خارجي) |

> **ملاحظة خصوصية:** النسخة دي منقّاة من البيانات المالية الشخصية والتفاصيل الحساسة — مخصصة للنشر العام. التفاصيل الكاملة في الملفات الخاصة.

## النشر على GitHub Pages (3 دقائق)

1. أنشئ مستودعًا جديدًا على GitHub (مثلًا `dam-growth-plan`) — **Public**.
2. ارفع محتويات المجلد ده كله (بما فيها مجلدي `assets` و`pages`) لجذر المستودع:
   ```bash
   cd dam-plan-site
   git init
   git add .
   git commit -m "dam growth plan site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/dam-growth-plan.git
   git push -u origin main
   ```
3. من إعدادات المستودع: **Settings ← Pages ← Source: Deploy from a branch ← Branch: main / (root) ← Save**.
4. خلال دقيقة أو اثنتين الرابط يشتغل: `https://USERNAME.github.io/dam-growth-plan/`

## التحويل لـPDF لاحقًا

كل الصفحات فيها تنسيق طباعة مدمج — افتح أي صفحة في المتصفح واعمل **Ctrl+P ← حفظ كـPDF** وهتطلع نسخة نظيفة بخلفية بيضاء (الهيدر والحركات بتتشال تلقائيًا في الطباعة).

## ملاحظات تقنية

- عربي RTL بالكامل · خطوط IBM Plex Sans Arabic وTajawal محلية
- حركات GSAP + ScrollTrigger (محلية) مع دعم `prefers-reduced-motion`
- الروابط العميقة بتفتح الصفحة على القسم المطلوب مع إضاءة توضيحية
- `noindex` مفعّلة — الموقع مش هيظهر في محركات البحث
