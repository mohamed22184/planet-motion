# لوبات البريفيو

اللوبات القصيرة اللي بتتعرض في كروت الرئيسية وفي هيرو صفحة المشروع.

## التسمية
**اسم الملف = slug المشروع** (نفس اللي في اللينك `/work/<slug>`).
ملف واحد بيخدم الكارت والهيرو — مفيش نسختين بتسميتين.

| الملف | المكان |
|---|---|
| `reel-2026.mp4` | الـReel — مركز الفراغ |
| `brand-film.mp4` | Motion — Brand film |
| `social-loop.mp4` | Motion — Social loop |
| `explainer.mp4` | Motion — Explainer |
| `vertical-cut.mp4` | Motion — Vertical cut |
| `title-system.mp4` | Motion — Title system |
| `ai-spot.mp4` | AI — AI spot |
| `ai-vertical.mp4` | AI — AI vertical |
| `ai-texture.mp4` | AI — AI texture |
| `ai-hybrid.mp4` | AI — AI hybrid |
| `doc-cut.mp4` | Edit — Doc cut |
| `promo.mp4` | Edit — Promo |
| `long-form.mp4` | Edit — Long form |
| `reels-pack.mp4` | Edit — Reels pack |
| `about.mp4` | كارت About |
| `contact.mp4` | كارت Contact |

لو غيّرت أسماء المشاريع في `src/data/work.ts`، أسماء الملفات بتتغير
معاها (الـslug هو المصدر).

الكارت اللي ملوش ملف مابياخدش عنصر فيديو أصلًا — بيفضل مستطيل فاضي
من غير أي طلب شبكة. يعني تقدر تضيفهم واحد واحد وتشوف النتيجة.

## المواصفات
| | |
|---|---|
| المدة | 3 ثواني |
| الصوت | متشال خالص |
| الدقة | 720p |
| الحجم | أقل من 1MB |
| الكودك | H.264 (ملف `.mp4`) |

ممكن تضيف نسخة `.webm` جنب الـ`.mp4` لو حبيت — المتصفح بياخد الأول
اللي يقدر يشغّله.

> **القياس:** الفيديو هو أغلى حاجة في الصفحة مش العمق. عشان كده
> الموقع بيشغّل لوب القسم المركّز عليه بس، وبيوقفه أثناء حركة
> الكاميرا. التفاصيل في `docs/motion-system.md`.
