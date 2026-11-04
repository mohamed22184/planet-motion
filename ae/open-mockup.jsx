// ⚠️ متولّد — ماتعدّلش الملف ده. عدّل ae/build-open.mjs وشغّله تاني.
//
// موكاب «فتح المشروع» — 5 ثواني.
// الكاميرا بتدخل من لقطة القسم لحد ما الكارت يملا مستطيل الهيرو
// المقيس من المتصفح (40, 74 · 1100×618.8)، والفراغ
// بيخفت وراه، وبعدين أثاث الصفحة بيوصل.

(function () {
  var W = 1440, H = 810, FPS = 25, DUR = 5;
  var CARDS = [
    {
      "name": "Reel 2026 · Reel 2026",
      "slug": "reel-2026",
      "sec": 0,
      "w": 660,
      "h": 371,
      "x": 0,
      "y": 0,
      "z": -250,
      "hero": false
    },
    {
      "name": "Motion · Brand film",
      "slug": "brand-film",
      "sec": 1,
      "w": 470,
      "h": 264,
      "x": -1710,
      "y": -820,
      "z": -1000,
      "hero": true
    },
    {
      "name": "Motion · Social loop",
      "slug": "social-loop",
      "sec": 1,
      "w": 190,
      "h": 190,
      "x": -1310,
      "y": -875,
      "z": -1260,
      "hero": false
    },
    {
      "name": "Motion · Explainer",
      "slug": "explainer",
      "sec": 1,
      "w": 230,
      "h": 129,
      "x": -1315,
      "y": -645,
      "z": -1050,
      "hero": false
    },
    {
      "name": "Motion · Vertical cut",
      "slug": "vertical-cut",
      "sec": 1,
      "w": 150,
      "h": 267,
      "x": -1655,
      "y": -510,
      "z": -1310,
      "hero": false
    },
    {
      "name": "Motion · Title system",
      "slug": "title-system",
      "sec": 1,
      "w": 175,
      "h": 175,
      "x": -1395,
      "y": -465,
      "z": -1460,
      "hero": false
    },
    {
      "name": "AI · AI spot",
      "slug": "ai-spot",
      "sec": 2,
      "w": 420,
      "h": 236,
      "x": 1690,
      "y": -810,
      "z": -1420,
      "hero": false
    },
    {
      "name": "AI · AI vertical",
      "slug": "ai-vertical",
      "sec": 2,
      "w": 165,
      "h": 293,
      "x": 1365,
      "y": -760,
      "z": -1640,
      "hero": false
    },
    {
      "name": "AI · AI texture",
      "slug": "ai-texture",
      "sec": 2,
      "w": 185,
      "h": 185,
      "x": 1765,
      "y": -535,
      "z": -1480,
      "hero": false
    },
    {
      "name": "AI · AI hybrid",
      "slug": "ai-hybrid",
      "sec": 2,
      "w": 215,
      "h": 121,
      "x": 1410,
      "y": -505,
      "z": -1800,
      "hero": false
    },
    {
      "name": "Edit · Doc cut",
      "slug": "doc-cut",
      "sec": 3,
      "w": 450,
      "h": 253,
      "x": -1830,
      "y": 505,
      "z": -810,
      "hero": false
    },
    {
      "name": "Edit · Promo",
      "slug": "promo",
      "sec": 3,
      "w": 180,
      "h": 180,
      "x": -1465,
      "y": 475,
      "z": -1070,
      "hero": false
    },
    {
      "name": "Edit · Long form",
      "slug": "long-form",
      "sec": 3,
      "w": 225,
      "h": 127,
      "x": -1470,
      "y": 695,
      "z": -860,
      "hero": false
    },
    {
      "name": "Edit · Reels pack",
      "slug": "reels-pack",
      "sec": 3,
      "w": 155,
      "h": 276,
      "x": -1785,
      "y": 815,
      "z": -1190,
      "hero": false
    },
    {
      "name": "About · About",
      "slug": "about",
      "sec": 4,
      "w": 430,
      "h": 430,
      "x": 1720,
      "y": 620,
      "z": -2000,
      "hero": false
    },
    {
      "name": "Contact · Contact",
      "slug": "contact",
      "sec": 5,
      "w": 500,
      "h": 281,
      "x": 0,
      "y": 1250,
      "z": -2400,
      "hero": false
    }
  ];

  // لقطة البداية (قسم Motion) — نفس أرقام الموقع
  var SHOT = { x: -1477, y: -663, z: -1216, dist: 1030,
               rx: -5.525, ry: 15.547 };
  // لقطة النهاية — محسوبة عشان الإسقاط يساوي الهيرو
  var HERO = { x: -1654.455, y: -810.771, z: -1000,
               dist: 384.545 };

  var T_HOLD = 0.6;      // قد إيه نفضل في الفراغ قبل الفتح
  var T_MORPH = 1.05;    // مدة دخول الكاميرا
  var T_UI = T_HOLD + T_MORPH;

  function col(hex) {
    return [parseInt(hex.substr(0, 2), 16) / 255,
            parseInt(hex.substr(2, 2), 16) / 255,
            parseInt(hex.substr(4, 2), 16) / 255];
  }

  // منحنى الموقع cubic-bezier(.16, 1, .30, 1) بمفردات AE
  var EASE = {"x1":0.16,"y1":1,"x2":0.3,"y2":1};
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
  var arL = bar('hero AR', 40 + 10, 692.8 - 21, 44, 11, '8D7E76', 0);
  var tcL = bar('hero TC', 1140 - 54, 692.8 - 21, 44, 11, '8D7E76', 0);
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
  cam.property('ADBE Camera Options Group').property('ADBE Camera Zoom').setValue(900);
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
