// بيولّد سكربت After Effects من نفس مصدر الشغل (site/src/data/work.ts)
// وبنفس معادلات الكاميرا اللي في index.astro — فالموكاب مش تقريب
// للموقع، ده الموقع بالأرقام بتاعته.
//
// التشغيل:  node ae/build-assembly.mjs
// الناتج:   ae/assembly-mockup.jsx  →  File ▸ Scripts ▸ Run Script File
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { W, H, P, FPS, cards, computeWide, camDist, EASE } from './scene.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const DUR = 10;

// ===== اللقطة الواسعة — نفس computeWide في index.astro =====
const wide = computeWide();
const tzWide = wide.tz, dWide = wide.d;

// لقطة الافتتاح: قريب على الـReel
const reel = cards.find((c) => c.sec === 0);
const dReel = 470;
const tzReel = reel.z;

// AE: z موجب = بعيد، والعكس في CSS. والكاميرا بتقعد على بعد P − d
// من الهدف، فالتكبير zoom/distance = P/(P − d) — نفس معادلة الموقع.
const camZ = (d) => -camDist(d);

// الترتيب: الأقرب للريل بيوصل الأول — الوصول بيتقرا كموجة من النص لبرّه
const order = [...cards.keys()].sort(
  (i, j) => Math.hypot(cards[i].x, cards[i].y) - Math.hypot(cards[j].x, cards[j].y),
);
const delay = new Array(cards.length);
order.forEach((ci, k) => { delay[ci] = +(0.5 + k * 0.07).toFixed(3); });

// العمق بيتولد من اختلاف السرعات مش من مسافة بس: الكارت الأبعد
// بياخد وقت أطول في نفس الرحلة. لو كلهم بنفس المدة المخ بيقراهم
// كطبقة واحدة — ده بالظبط اللي سقّط تجربة الكوكب الأولى.
const depth = cards.map((c) => Math.abs(c.z));
const dMin = Math.min(...depth), dMax = Math.max(...depth);
const dur = (z) => +(1.05 + 0.85 * ((Math.abs(z) - dMin) / (dMax - dMin || 1))).toFixed(3);

const data = cards.map((c, i) => ({ ...c, t: delay[i], dur: dur(c.z) }));

const jsx = `// ⚠️ متولّد — ماتعدّلش الملف ده. عدّل ae/build-assembly.mjs وشغّله تاني.
//
// موكاب «التجميع»: الكروت بتوصل من أعماق مختلفة والكاميرا بترجع
// لورا من لقطة الريل القريبة للقطة الواسعة. الهندسة كلها مأخوذة
// من site/src/data/work.ts وmعادلات الكاميرا في index.astro:
//   تكبير العنصر = ${P} / (${P} − z)  ·  الكاميرا على بعد ${P} − d من الهدف
//
// الهدف منه: تظبط المنحنيات في الـGraph Editor، وبعدين نقراها
// ونحوّلها لـGSAP CustomEase (ae/read-ease.jsx).

(function () {
  var W = ${W}, H = ${H}, FPS = ${FPS}, DUR = ${DUR};
  var CARDS = ${JSON.stringify(data, null, 2).replace(/\n/g, '\n  ')};
  var D_REEL = ${dReel}, TZ_REEL = ${tzReel};
  var D_WIDE = ${dWide.toFixed(2)}, TZ_WIDE = ${tzWide};
  var CAMZ_REEL = ${camZ(dReel).toFixed(2)}, CAMZ_WIDE = ${camZ(dWide).toFixed(2)};

  // توقيت الحركة — دي الأرقام اللي بتتظبط
  var CAM_START = 0.45, CAM_DUR = 2.6;
  // مدة كل كارت متخزّنة معاه (c.dur) — الأبعد أبطأ
  var Z_BACK = 2600;    // الكارت بيبدأ أبعد بكام بكسل
  var SPREAD = 1.35;    // وبينزاح لبرّه، فبيتجمّع للداخل وهو جاي

  function col(hex) {
    return [
      parseInt(hex.substr(0, 2), 16) / 255,
      parseInt(hex.substr(2, 2), 16) / 255,
      parseInt(hex.substr(4, 2), 16) / 255,
    ];
  }

  // المنحنى الافتتاحي هو منحنى الموقع نفسه: cubic-bezier(.16, 1, .30, 1)
  // مترجم لمفردات AE. التحويل: سرعة المفتاح الأول = (y1/x1)·(Δ/T)
  // وتأثيره = x1·100 · وسرعة الأخير = ((1−y2)/(1−x2))·(Δ/T) وتأثيره
  // = (1−x2)·100. فلو قريت المنحنى تاني بـread-ease.jsx لازم يرجع
  // نفس الأربع أرقام — ده الاختبار إن الاتجاهين مظبوطين.
  // مفاتيح AE بتبدأ من 1 مش 0.
  var EASE = ${JSON.stringify(EASE)};
  function easeTo(prop, delta, dur) {
    var n = prop.numKeys;
    var rate = delta / dur;
    var s1 = (EASE.y1 / EASE.x1) * rate;
    var s2 = ((1 - EASE.y2) / (1 - EASE.x2)) * rate;
    var k1 = new KeyframeEase(s1, EASE.x1 * 100);
    var k2 = new KeyframeEase(s2, (1 - EASE.x2) * 100);
    prop.setTemporalEaseAtKey(n - 1, [k1], [k1]);
    prop.setTemporalEaseAtKey(n, [k2], [k2]);
  }

  function dist3(a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function straight(prop) {
    for (var i = 1; i <= prop.numKeys; i++) {
      try { prop.setSpatialTangentsAtKey(i, [0, 0, 0], [0, 0, 0]); } catch (e) {}
    }
  }

  app.beginUndoGroup('Planet Motion — assembly mockup');

  if (!app.project) app.newProject();

  // تشغيل تاني = إعادة بناء، مش نسخة تانية. بنشيل الكومب المتولّد
  // بالاسم ده بس — أي حاجة تانية في المشروع مابتتلمسش.
  for (var k = app.project.numItems; k >= 1; k--) {
    var it = app.project.item(k);
    if (it instanceof CompItem && it.name === 'PM — Assembly') it.remove();
  }

  var comp = app.project.items.addComp('PM — Assembly', W, H, 1, DUR, FPS);
  comp.bgColor = col('140F0D');
  comp.openInViewer();

  // خلفية: نفس الـ--ink
  var bg = comp.layers.addSolid(col('140F0D'), 'BG', W, H, 1, DUR);
  bg.locked = true;

  // الكروت — من الأبعد للأقرب عشان ترتيب الطبقات يطابق العمق
  var sorted = CARDS.slice().sort(function (a, b) { return a.z - b.z; });
  for (var i = 0; i < sorted.length; i++) {
    var c = sorted[i];
    var isReel = c.sec === 0;

    var sl = comp.layers.addShape();
    sl.name = c.name;
    var grp = sl.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    var cont = grp.property('ADBE Vectors Group');
    var rect = cont.addProperty('ADBE Vector Shape - Rect');
    rect.property('ADBE Vector Rect Size').setValue([c.w, c.h]);
    var fill = cont.addProperty('ADBE Vector Graphic - Fill');
    // أغمق من الخلفية بدرجة واحدة بس في الموقع — هنا بنرفع التباين
    // عشان الموكاب يتحكم عليه بالعين في الفيوّر.
    fill.property('ADBE Vector Fill Color').setValue(col(isReel ? '2A201B' : '221A17').concat(1));
    var stroke = cont.addProperty('ADBE Vector Graphic - Stroke');
    stroke.property('ADBE Vector Stroke Color').setValue(col(isReel ? 'E65100' : '7A5247').concat(1));
    stroke.property('ADBE Vector Stroke Width').setValue(isReel ? 3 : 2);

    sl.threeDLayer = true;
    var pos = sl.property('ADBE Transform Group').property('ADBE Position');
    var op = sl.property('ADBE Transform Group').property('ADBE Opacity');

    // AE z = −(z في CSS)
    var endP = [W / 2 + c.x, H / 2 + c.y, -c.z];

    if (isReel) {
      // الريل موجود من أول فريم — قاعدة الـ6 ثواني
      pos.setValue(endP);
      op.setValue(100);
    } else {
      var startP = [W / 2 + c.x * SPREAD, H / 2 + c.y * SPREAD, -c.z + Z_BACK];
      pos.setValueAtTime(c.t, startP);
      pos.setValueAtTime(c.t + c.dur, endP);
      easeTo(pos, dist3(startP, endP), c.dur);
      straight(pos);

      op.setValueAtTime(c.t, 0);
      op.setValueAtTime(c.t + c.dur * 0.45, 100);
      easeTo(op, 100, c.dur * 0.45);
    }
  }

  // ===== الكاميرا =====
  // نَل = الهدف (بيحمل الموضع والدوران)، والكاميرا بنتّه على بعد
  // P − d منه. كده حركة الكاميرا هي نفس موديل الموقع بالظبط.
  var target = comp.layers.addNull(DUR);
  target.name = 'CAM TARGET';
  target.threeDLayer = true;
  var tp = target.property('ADBE Transform Group').property('ADBE Position');
  tp.setValueAtTime(CAM_START, [W / 2, H / 2, -TZ_REEL]);
  tp.setValueAtTime(CAM_START + CAM_DUR, [W / 2, H / 2, -TZ_WIDE]);
  easeTo(tp, Math.abs(TZ_WIDE - TZ_REEL), CAM_DUR);
  straight(tp);

  var cam = comp.layers.addCamera('CAM', [W / 2, H / 2]);
  cam.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(${P});
  cam.parent = target;
  cam.property('ADBE Transform Group').property('ADBE Anchor Point').setValue([0, 0, 0]);
  var cp = cam.property('ADBE Transform Group').property('ADBE Position');
  cp.setValueAtTime(CAM_START, [0, 0, CAMZ_REEL]);
  cp.setValueAtTime(CAM_START + CAM_DUR, [0, 0, CAMZ_WIDE]);
  easeTo(cp, Math.abs(CAMZ_WIDE - CAMZ_REEL), CAM_DUR);
  straight(cp);

  comp.markerProperty.setValueAtTime(CAM_START, new MarkerValue('camera out'));
  comp.markerProperty.setValueAtTime(CAM_START + CAM_DUR, new MarkerValue('wide'));

  app.endUndoGroup();

  'comp=' + comp.name + ' layers=' + comp.numLayers + ' dWide=' + D_WIDE +
    ' camZwide=' + CAMZ_WIDE;
})();
`;

writeFileSync(join(here, 'assembly-mockup.jsx'), jsx);
console.log(`✓ ae/assembly-mockup.jsx — ${cards.length} كارت · اللقطة الواسعة d=${dWide.toFixed(1)} · tz=${tzWide}`);
