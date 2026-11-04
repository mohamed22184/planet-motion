// ⚠️ متولّد — ماتعدّلش الملف ده. عدّل ae/build-assembly.mjs وشغّله تاني.
//
// موكاب «التجميع»: الكروت بتوصل من أعماق مختلفة والكاميرا بترجع
// لورا من لقطة الريل القريبة للقطة الواسعة. الهندسة كلها مأخوذة
// من site/src/data/work.ts وmعادلات الكاميرا في index.astro:
//   تكبير العنصر = 900 / (900 − z)  ·  الكاميرا على بعد 900 − d من الهدف
//
// الهدف منه: تظبط المنحنيات في الـGraph Editor، وبعدين نقراها
// ونحوّلها لـGSAP CustomEase (ae/read-ease.jsx).

(function () {
  var W = 1440, H = 810, FPS = 25, DUR = 10;
  var CARDS = [
    {
      "name": "Reel 2026 · Reel 2026",
      "sec": 0,
      "w": 660,
      "h": 371,
      "x": 0,
      "y": 0,
      "z": -250,
      "t": 0.5,
      "dur": 1.05
    },
    {
      "name": "Motion · Brand film",
      "sec": 1,
      "w": 470,
      "h": 264,
      "x": -1710,
      "y": -820,
      "z": -1000,
      "t": 1.41,
      "dur": 1.347
    },
    {
      "name": "Motion · Social loop",
      "sec": 1,
      "w": 190,
      "h": 190,
      "x": -1310,
      "y": -875,
      "z": -1260,
      "t": 0.99,
      "dur": 1.449
    },
    {
      "name": "Motion · Explainer",
      "sec": 1,
      "w": 230,
      "h": 129,
      "x": -1315,
      "y": -645,
      "z": -1050,
      "t": 0.64,
      "dur": 1.366
    },
    {
      "name": "Motion · Vertical cut",
      "sec": 1,
      "w": 150,
      "h": 267,
      "x": -1655,
      "y": -510,
      "z": -1310,
      "t": 1.13,
      "dur": 1.469
    },
    {
      "name": "Motion · Title system",
      "sec": 1,
      "w": 175,
      "h": 175,
      "x": -1395,
      "y": -465,
      "z": -1460,
      "t": 0.71,
      "dur": 1.528
    },
    {
      "name": "AI · AI spot",
      "sec": 2,
      "w": 420,
      "h": 236,
      "x": 1690,
      "y": -810,
      "z": -1420,
      "t": 1.34,
      "dur": 1.513
    },
    {
      "name": "AI · AI vertical",
      "sec": 2,
      "w": 165,
      "h": 293,
      "x": 1365,
      "y": -760,
      "z": -1640,
      "t": 0.92,
      "dur": 1.6
    },
    {
      "name": "AI · AI texture",
      "sec": 2,
      "w": 185,
      "h": 185,
      "x": 1765,
      "y": -535,
      "z": -1480,
      "t": 1.27,
      "dur": 1.536
    },
    {
      "name": "AI · AI hybrid",
      "sec": 2,
      "w": 215,
      "h": 121,
      "x": 1410,
      "y": -505,
      "z": -1800,
      "t": 0.78,
      "dur": 1.663
    },
    {
      "name": "Edit · Doc cut",
      "sec": 3,
      "w": 450,
      "h": 253,
      "x": -1830,
      "y": 505,
      "z": -810,
      "t": 1.48,
      "dur": 1.271
    },
    {
      "name": "Edit · Promo",
      "sec": 3,
      "w": 180,
      "h": 180,
      "x": -1465,
      "y": 475,
      "z": -1070,
      "t": 0.85,
      "dur": 1.374
    },
    {
      "name": "Edit · Long form",
      "sec": 3,
      "w": 225,
      "h": 127,
      "x": -1470,
      "y": 695,
      "z": -860,
      "t": 1.06,
      "dur": 1.291
    },
    {
      "name": "Edit · Reels pack",
      "sec": 3,
      "w": 155,
      "h": 276,
      "x": -1785,
      "y": 815,
      "z": -1190,
      "t": 1.55,
      "dur": 1.422
    },
    {
      "name": "About · About",
      "sec": 4,
      "w": 430,
      "h": 430,
      "x": 1720,
      "y": 620,
      "z": -2000,
      "t": 1.2,
      "dur": 1.742
    },
    {
      "name": "Contact · Contact",
      "sec": 5,
      "w": 500,
      "h": 281,
      "x": 0,
      "y": 1250,
      "z": -2400,
      "t": 0.57,
      "dur": 1.9
    }
  ];
  var D_REEL = 470, TZ_REEL = -250;
  var D_WIDE = -3939.33, TZ_WIDE = -1325;
  var CAMZ_REEL = -430.00, CAMZ_WIDE = -4839.33;

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
  var EASE = { x1: 0.16, y1: 1, x2: 0.30, y2: 1 };
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
  cam.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(900);
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
