// بيقرا منحنيات الكيفريمات من الكومب ويطلّعها بصيغة CSS/GSAP.
//
// الاستعمال: ظبّط الحركة في الـGraph Editor، اختار البروبرتي
// (أو سيبها من غير اختيار وهياخد كل اللي متحرّك)، وبعدين
// File ▸ Scripts ▸ Run Script File ▸ ae/read-ease.jsx
//
// الرياضة: منحنى AE محفوظ كـ(سرعة، تأثير) على كل مفتاح. نقطة
// التحكّم الأولى للبيزييه المعيّر = (i1/100, s1·T/Δ · i1/100)
// والتانية = (1 − i2/100, 1 − s2·T/Δ · i2/100) — حيث T مدة
// المقطع وΔ مقدار التغيّر (أو طول المسار في الموضع).

(function () {
  var comp = app.project.activeItem;
  if (!(comp instanceof CompItem)) { alert('افتح الكومب الأول.'); return; }

  function len(a, b) {
    if (a instanceof Array) {
      var s = 0;
      for (var i = 0; i < a.length; i++) s += (b[i] - a[i]) * (b[i] - a[i]);
      return Math.sqrt(s);
    }
    return Math.abs(b - a);
  }

  function round(n) { return Math.round(n * 1000) / 1000; }

  // المقطع بين مفتاحين → cubic-bezier معيّر
  function curve(prop, k) {
    var t0 = prop.keyTime(k), t1 = prop.keyTime(k + 1);
    var T = t1 - t0;
    var D = len(prop.keyValue(k), prop.keyValue(k + 1));
    if (T <= 0 || D === 0) return null;
    var out = prop.keyOutTemporalEase(k)[0];
    var inn = prop.keyInTemporalEase(k + 1)[0];
    var x1 = out.influence / 100;
    var y1 = (out.speed * T / D) * x1;
    var x2 = 1 - inn.influence / 100;
    var y2 = 1 - (inn.speed * T / D) * (inn.influence / 100);
    return { x1: round(x1), y1: round(y1), x2: round(x2), y2: round(y2), T: round(T) };
  }

  var rows = [];
  var seen = {};

  function take(layer, prop) {
    if (!prop.canVaryOverTime || prop.numKeys < 2) return;
    var c = curve(prop, 1);
    if (!c) return;
    var key = c.x1 + ',' + c.y1 + ',' + c.x2 + ',' + c.y2;
    var label = layer.name + ' › ' + prop.name;
    if (seen[key]) { seen[key].n++; return; }
    seen[key] = { n: 1, c: c, first: label };
    rows.push(seen[key]);
  }

  var sel = comp.selectedProperties;
  if (sel.length) {
    for (var i = 0; i < sel.length; i++) {
      if (sel[i].propertyType === PropertyType.PROPERTY) {
        take(sel[i].propertyGroup(sel[i].propertyDepth), sel[i]);
      }
    }
  } else {
    for (var li = 1; li <= comp.numLayers; li++) {
      var L = comp.layer(li);
      var g = L.property('ADBE Transform Group');
      var names = ['ADBE Position', 'ADBE Opacity', 'ADBE Scale', 'ADBE Rotate Z'];
      for (var ni = 0; ni < names.length; ni++) {
        var p = g.property(names[ni]);
        if (p) take(L, p);
      }
    }
  }

  if (!rows.length) { alert('مفيش كيفريمات أقراها.'); return; }

  var out = ['// متولّد من ' + comp.name + ' — ' + rows.length + ' منحنى مختلف', ''];
  for (var r = 0; r < rows.length; r++) {
    var c = rows[r].c;
    var bez = c.x1 + ', ' + c.y1 + ', ' + c.x2 + ', ' + c.y2;
    out.push('// ' + rows[r].first + '  ·  ' + rows[r].n + ' بروبرتي بنفس المنحنى  ·  ' + c.T + 's');
    out.push('cubic-bezier(' + bez + ')');
    out.push('CustomEase.create("pm' + (r + 1) + '", "M0,0 C' + c.x1 + ',' + c.y1 +
             ' ' + c.x2 + ',' + c.y2 + ' 1,1")');
    out.push('');
  }
  var text = out.join('\n');

  var f = new File(File($.fileName).path + '/ease-export.txt');
  try { f.open('w'); f.write(text); f.close(); } catch (e) {}
  alert(text);
})();
