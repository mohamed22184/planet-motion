// بيولّد موكاب «فتح المشروع»: الكارت في الفراغ بيتمدد ويبقى هيرو
// صفحة المشروع. الأرقام مش مخترعة — مقيسة من المتصفح على 1440×810:
//
//   الكارت (brand-film) وقسمه مركّز عليه : 196.3, 55.6 · 593.5×354.1
//   الهيرو في /work/brand-film            :  40.0, 74.0 · 1100×618.8
//
// الكاميرا بتتحرك لحد ما إسقاط الكارت يساوي مستطيل الهيرو بالظبط.
//
// التشغيل: node ae/build-open.mjs → ae/open-mockup.jsx
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { W, H, P, FPS, cards, SEC_D, clusterCenter, camDist, EASE } from './scene.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DUR = 5;

const SLUG = 'brand-film';
const card = cards.find((c) => c.slug === SLUG);

// المقيس من المتصفح
const MEAS_CARD = { x: 196.3, y: 55.6, w: 593.5, h: 354.1 };
const HERO = { x: 40, y: 74, w: 1100, h: 618.8 };

// ===== لقطة البداية: نفس لقطة قسم Motion في الموقع =====
const c0 = clusterCenter(0), c1 = clusterCenter(card.sec);
const clamp = (lo, hi, v) => Math.min(hi, Math.max(lo, v));
// نفس حساب ميل الكاميرا في index.astro: الكاميرا بتميل في اتجاه حركتها
const ryShot = clamp(-18, 18, -(c1.x - c0.x) / 95);
const rxShot = clamp(-11, 11, (c1.y - c0.y) / 120);
const distShot = camDist(SEC_D[card.sec]);

// ===== لقطة النهاية: الكارت = الهيرو =====
// عرض الإسقاط = عرض الكارت × zoom / المسافة  →  المسافة المطلوبة
const distHero = (card.w * P) / HERO.w;
const sHero = P / distHero;                       // التكبير عند الوصول
// مركز الهيرو على الشاشة مقابل مركز الفريم — بنزيح الهدف بالعكس
const offX = (W / 2 - (HERO.x + HERO.w / 2)) / sHero;
const offY = (H / 2 - (HERO.y + HERO.h / 2)) / sHero;

const n = (v) => Number(v.toFixed(3));

const jsx = `// ⚠️ متولّد — ماتعدّلش الملف ده. عدّل ae/build-open.mjs وشغّله تاني.
//
// موكاب «فتح المشروع» — ${DUR} ثواني.
// الكاميرا بتدخل من لقطة القسم لحد ما الكارت يملا مستطيل الهيرو
// المقيس من المتصفح (${HERO.x}, ${HERO.y} · ${HERO.w}×${HERO.h})، والفراغ
// بيخفت وراه، وبعدين أثاث الصفحة بيوصل.

(function () {
  var W = ${W}, H = ${H}, FPS = ${FPS}, DUR = ${DUR};
  var CARDS = ${JSON.stringify(cards.map((c) => ({ ...c, hero: c.slug === SLUG })), null, 2).replace(/\n/g, '\n  ')};

  // لقطة البداية (قسم Motion) — نفس أرقام الموقع
  var SHOT = { x: ${n(c1.x)}, y: ${n(c1.y)}, z: ${n(c1.z)}, dist: ${n(distShot)},
               rx: ${n(rxShot)}, ry: ${n(ryShot)} };
  // لقطة النهاية — محسوبة عشان الإسقاط يساوي الهيرو
  var HERO = { x: ${n(card.x + offX)}, y: ${n(card.y + offY)}, z: ${card.z},
               dist: ${n(distHero)} };

  var T_HOLD = 0.6;      // قد إيه نفضل في الفراغ قبل الفتح
  var T_MORPH = 1.05;    // مدة دخول الكاميرا
  var T_UI = T_HOLD + T_MORPH;

  function col(hex) {
    return [parseInt(hex.substr(0, 2), 16) / 255,
            parseInt(hex.substr(2, 2), 16) / 255,
            parseInt(hex.substr(4, 2), 16) / 255];
  }

  // منحنى الموقع cubic-bezier(.16, 1, .30, 1) بمفردات AE
  var EASE = ${JSON.stringify(EASE)};
  function easeTo(prop, delta, dur) {
    var n = prop.numKeys, rate = delta / dur;
    var k1 = new KeyframeEase((EASE.y1 / EASE.x1) * rate, EASE.x1 * 100);
    var k2 = new KeyframeEase(((1 - EASE.y2) / (1 - EASE.x2)) * rate, (1 - EASE.x2) * 100);
    prop.setTemporalEaseAtKey(n - 1, [k1], [k1]);
    prop.setTemporalEaseAtKey(n, [k2], [k2]);
  }
  function straight(prop) {
    for (var i = 1; i <= prop.numKeys; i++) {
      try { prop.setSpatialTangentsAtKey(i, [0, 0, 0], [0, 0, 0]); } catch (e) {}
    }
  }
  function tr(L, name) { return L.property('ADBE Transform Group').property(name); }

  app.beginUndoGroup('Planet Motion — project open mockup');
  if (!app.project) app.newProject();
  for (var k = app.project.numItems; k >= 1; k--) {
    var it = app.project.item(k);
    if (it instanceof CompItem && it.name === 'PM — Project open') it.remove();
  }
  var comp = app.project.items.addComp('PM — Project open', W, H, 1, DUR, FPS);
  comp.bgColor = col('140F0D');
  comp.openInViewer();

  var bg = comp.layers.addSolid(col('140F0D'), 'BG', W, H, 1, DUR);
  bg.locked = true;

  // ===== أثاث الصفحة (ثنائي الأبعاد، بيوصل بعد المورف) =====
  // النص متمثّل بقضبان بمقاسات العناصر الحقيقية: خطوط الموقع مش
  // متسطّبة في النظام، وكتابة بخط بديل هتكدب على التكوين.
  function bar(name, x, y, w, h, hex, op) {
    var s = comp.layers.addSolid(col(hex), name, Math.round(w), Math.round(h), 1, DUR);
    tr(s, 'ADBE Anchor Point').setValue([Math.round(w) / 2, Math.round(h) / 2, 0]);
    tr(s, 'ADBE Position').setValue([x + w / 2, y + h / 2]);
    if (op !== undefined) tr(s, 'ADBE Opacity').setValue(op);
    return s;
  }

  // العنوان: قضيب جوّه ماسك — نفس line-mask في الموقع
  var titleH = 66, titleW = 430, titleY = 740;
  var title = bar('H1', 40, titleY, titleW, titleH, 'F5F5F5', 100);
  var titleMask = bar('H1 mask', 40, titleY, titleW, titleH, 'FFFFFF', 100);
  titleMask.moveBefore(title);
  title.setTrackMatte(titleMask, TrackMatteType.ALPHA);
  var ty = tr(title, 'ADBE Position');
  ty.setValueAtTime(T_UI + 0.12, [40 + titleW / 2, titleY + titleH / 2 + titleH * 1.05]);
  ty.setValueAtTime(T_UI + 0.12 + 0.6, [40 + titleW / 2, titleY + titleH / 2]);
  easeTo(ty, titleH * 1.05, 0.6);
  straight(ty);

  // الشريط العلوي: «← Planet Motion» شمال و«Motion» يمين
  var topL = bar('top ← Planet Motion', 18, 24, 168, 12, 'D7CCC8', 0);
  var topR = bar('top section', 1374 - 60, 24, 60, 12, '8D7E76', 0);
  // علامات الهيرو: نسبة الأبعاد شمال تحت والمدة يمين تحت
  var arL = bar('hero AR', ${HERO.x} + 10, ${HERO.y + HERO.h} - 21, 44, 11, '8D7E76', 0);
  var tcL = bar('hero TC', ${HERO.x + HERO.w} - 54, ${HERO.y + HERO.h} - 21, 44, 11, '8D7E76', 0);
  var ui = [topL, topR, arL, tcL];
  for (var u = 0; u < ui.length; u++) {
    var o = tr(ui[u], 'ADBE Opacity');
    o.setValueAtTime(T_UI + 0.05 + u * 0.05, 0);
    o.setValueAtTime(T_UI + 0.05 + u * 0.05 + 0.4, 100);
  }

  // ===== الكروت في الفراغ =====
  var sorted = CARDS.slice().sort(function (a, b) { return a.z - b.z; });
  var heroLayer = null;
  for (var i = 0; i < sorted.length; i++) {
    var c = sorted[i];
    var sl = comp.layers.addShape();
    sl.name = c.name + (c.hero ? '  ◀ HERO' : '');
    var grp = sl.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    var cont = grp.property('ADBE Vectors Group');
    cont.addProperty('ADBE Vector Shape - Rect').property('ADBE Vector Rect Size').setValue([c.w, c.h]);
    cont.addProperty('ADBE Vector Graphic - Fill')
        .property('ADBE Vector Fill Color').setValue(col('1E1613').concat(1));
    var st = cont.addProperty('ADBE Vector Graphic - Stroke');
    st.property('ADBE Vector Stroke Color').setValue(col('4E342E').concat(1));
    st.property('ADBE Vector Stroke Width').setValue(c.hero ? 2 : 1.5);

    sl.threeDLayer = true;
    tr(sl, 'ADBE Position').setValue([W / 2 + c.x, H / 2 + c.y, -c.z]);

    if (c.hero) { heroLayer = sl; continue; }
    // الفراغ بيخفت وإحنا داخلين — الصفحة بتاخد مكانه
    var o = tr(sl, 'ADBE Opacity');
    o.setValueAtTime(T_HOLD, 100);
    o.setValueAtTime(T_HOLD + 0.45, 0);
  }
  // moveBefore مش moveAfter: الترتيب في AE من فوق لتحت، وmoveAfter
  // كان بيحطه تحت الخلفية فالخلفية بتغطيه. إحنا عايزينه فوق
  // الخلفية على طول وتحت أثاث الصفحة.
  if (heroLayer) heroLayer.moveBefore(bg);

  // ===== الكاميرا =====
  var target = comp.layers.addNull(DUR);
  target.name = 'CAM TARGET';
  target.threeDLayer = true;
  var tp = tr(target, 'ADBE Position');
  tp.setValueAtTime(T_HOLD, [W / 2 + SHOT.x, H / 2 + SHOT.y, -SHOT.z]);
  tp.setValueAtTime(T_HOLD + T_MORPH, [W / 2 + HERO.x, H / 2 + HERO.y, -HERO.z]);
  easeTo(tp, Math.sqrt(Math.pow(HERO.x - SHOT.x, 2) + Math.pow(HERO.y - SHOT.y, 2) +
                       Math.pow(HERO.z - SHOT.z, 2)), T_MORPH);
  straight(tp);

  // الميل بيتفك وإحنا داخلين: الصفحة مستوية، فالكاميرا لازم تبقى
  // عمودية على الكارت في النهاية — وإلا الهيرو بيبقى شبه منحرف.
  var rx = tr(target, 'ADBE Rotate X'), ry = tr(target, 'ADBE Rotate Y');
  rx.setValueAtTime(T_HOLD, SHOT.rx); rx.setValueAtTime(T_HOLD + T_MORPH, 0);
  ry.setValueAtTime(T_HOLD, SHOT.ry); ry.setValueAtTime(T_HOLD + T_MORPH, 0);
  easeTo(rx, Math.abs(SHOT.rx), T_MORPH);
  easeTo(ry, Math.abs(SHOT.ry), T_MORPH);

  var cam = comp.layers.addCamera('CAM', [W / 2, H / 2]);
  cam.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(${P});
  cam.parent = target;
  tr(cam, 'ADBE Anchor Point').setValue([0, 0, 0]);
  var cp = tr(cam, 'ADBE Position');
  cp.setValueAtTime(T_HOLD, [0, 0, -SHOT.dist]);
  cp.setValueAtTime(T_HOLD + T_MORPH, [0, 0, -HERO.dist]);
  easeTo(cp, Math.abs(SHOT.dist - HERO.dist), T_MORPH);
  straight(cp);

  comp.markerProperty.setValueAtTime(T_HOLD, new MarkerValue('open'));
  comp.markerProperty.setValueAtTime(T_UI, new MarkerValue('hero in place'));

  app.endUndoGroup();
})();
`;

writeFileSync(join(here, 'open-mockup.jsx'), jsx);
console.log(
  `✓ ae/open-mockup.jsx — ${SLUG}: مسافة البداية ${distShot} · النهاية ${distHero.toFixed(1)}` +
  ` · تكبير ${sHero.toFixed(3)} · إزاحة الهدف (${offX.toFixed(1)}, ${offY.toFixed(1)})` +
  ` · ميل البداية rx ${rxShot.toFixed(2)} ry ${ryShot.toFixed(2)}`,
);
