# بورتفوليو محمد — مرحلة الإعداد

## تشغيل الموقع محليًا

```
./dev.sh
```

وبعدين افتح http://localhost:4321

> **مهم:** Node متسطّب في `~/.local/node` ومش مضاف للـPATH بتاعك لسه.
> `dev.sh` بيضيفه لوحده، فالسكربت ده هو الطريقة المضمونة للتشغيل.
> لو عايز تستخدم `npm` من أي تيرمنال، ضيف السطر ده في `~/.zshrc`:
>
> ```
> export PATH="$HOME/.local/node/bin:$PATH"
> ```

## اللي متسطّب

| الحاجة | الإصدار |
|---|---|
| Node.js | v26.13.0 (LTS) — في `~/.local/node` |
| Astro | 7.4 |
| GSAP | 3.15 — ScrollTrigger / SplitText / Flip / CustomEase كلهم مجانيين |
| Lenis | 1.3 — smooth scroll |
| lottie-web | 5.13 — للوجو المتحرك من After Effects |

## الملفات المهمة

| الملف | إيه فيه |
|---|---|
| `site/src/styles/tokens.css` | **مصدر الحقيقة للثيم** — الألوان والخطوط والمسافات والـeasing |
| `site/src/styles/global.css` | reset + الـgrain + كلاس الـmask reveal |
| `site/src/layouts/Base.astro` | الخطوط + إعداد Lenis و GSAP |
| `site/src/pages/index.astro` | صفحة اختبار الثيم (مؤقتة — هتتشال لما نبدأ التصميم الحقيقي) |

## لسه ناقص

- [ ] اختيار الاتجاه النهائي (A / B / C)
- [ ] اللوجو
- [ ] تنزيل الخطوط على الموقع نفسه (self-host) بدل الـCDN — مهم للسرعة
- [ ] الدومين
- [ ] تحديد خطة Vimeo
- [ ] الريفرنسات اللي عاجباك عشان نحدد نظام الحركة
