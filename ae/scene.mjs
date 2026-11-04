// الهندسة المشتركة بين موكابات AE. مصدرها الوحيد بيانات الشغل،
// ومعادلاتها هي نفس معادلات site/src/pages/index.astro.
import { sections } from '../site/src/data/work.ts';

// نفس مرجع الموقع: fit = 1 عند عرض 1440، والـperspective 900
export const W = 1440, H = 810, P = 900, FPS = 25;

/** كل الكروت بإحداثياتها في الفراغ (نفس نظام إحداثيات الموقع) */
export const cards = sections.flatMap((sec, si) =>
  sec.items.map((it) => {
    const [a, b] = it.ar.split('/').map((n) => Number(n.trim()));
    return {
      name: `${sec.label} · ${it.title}`,
      slug: it.slug,
      sec: si,
      w: it.w,
      h: Math.round((it.w * b) / a),
      x: sec.x + it.dx,
      y: sec.y + it.dy,
      z: sec.z + it.dz,
    };
  }),
);

/** نفس SEC_D_BASE في index.astro */
export const SEC_D = [470, -130, -110, -120, 300, 300];

/** مركز عنقود قسم = متوسط كروته، زي ما الموقع بيحسبه */
export const clusterCenter = (si) => {
  const g = cards.filter((c) => c.sec === si);
  const avg = (k) => g.reduce((a, c) => a + c[k], 0) / g.length;
  return { x: avg('x'), y: avg('y'), z: avg('z') };
};

/** نفس computeWide() — اللقطة الواسعة متحسوبة من امتداد الكروت */
export const computeWide = () => {
  const halfW = cards.map((c) => Math.abs(c.x) + c.w / 2);
  const halfH = cards.map((c) => Math.abs(c.y) + c.w / 2);
  const zs = cards.map((c) => c.z);
  const need = Math.min(
    ((W / 2) * 0.92) / Math.max(...halfW),
    ((H / 2) * 0.84) / Math.max(...halfH),
  );
  return { tz: (Math.min(...zs) + Math.max(...zs)) / 2, d: P * (1 - 1 / (need * 0.82)) };
};

/** الكاميرا بتقعد على بعد P − d من الهدف (AE z موجب = بعيد) */
export const camDist = (d) => P - d;

/** منحنى الموقع cubic-bezier(.16, 1, .30, 1) — بيتحوّل لسرعة+تأثير في AE */
export const EASE = { x1: 0.16, y1: 1, x2: 0.30, y2: 1 };
