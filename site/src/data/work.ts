// مصدر واحد للشغل: الصفحة الرئيسية بتبني منه الفراغ الثلاثي،
// وصفحات المشاريع بتتولّد منه كمان. أي مشروع جديد بيتضاف هنا بس.

export type Item = {
  slug: string;
  title: string;
  client: string;
  role: string;
  year: string;
  tools: string;
  tc: string;
  brief: string;
  approach: string;
  result: string;
  /** عرض الكارت في الفراغ (بكسل، على مقاس 1440) */
  w: number;
  ar: string;
  /** إزاحة الكارت عن مركز عنقوده */
  dx: number; dy: number; dz: number;
};

export type Section = {
  id: string;
  label: string;
  meta: string;
  /** مسافة المشاهدة للقطة دي */
  d: number;
  /** مركز العنقود في الفراغ */
  x: number; y: number; z: number;
  items: Item[];
};

const P = (
  slug: string, title: string, client: string, role: string, tc: string,
  w: number, ar: string, dx: number, dy: number, dz: number,
): Item => ({
  slug, title, client, role, year: '2026', tools: 'After Effects · Premiere Pro',
  tc, w, ar, dx, dy, dz,
  brief: 'نص مؤقت — الملخّص اللي العميل جه بيه، في سطرين أو تلاتة.',
  approach: 'نص مؤقت — إزاي اتعاملت معاه: القرارات، الإيقاع، الأدوات.',
  result: 'نص مؤقت — النتيجة: أرقام، أثر، أو رد فعل العميل.',
});

export const sections: Section[] = [
  {
    id: 'reel', label: 'Reel 2026', meta: '01:24', d: 470,
    x: 0, y: 0, z: -250,
    items: [P('reel-2026', 'Reel 2026', 'Planet Motion', 'Edit · Motion', '00:00', 660, '16 / 9', 0, 0, 0)],
  },
  {
    // كل عنقود فيه كارت مسيطر وباقي الكروت أصغر بوضوح — التباين في
    // المقاس هو اللي بيدي العين نقطة تبدأ منها
    id: 'motion', label: 'Motion', meta: '05 films', d: 180,
    x: -1560, y: -700, z: -1200,
    items: [
      P('brand-film', 'Brand film', 'Client one', 'Lead animator', '00:42', 470, '16 / 9', -150, -120, 200),
      P('social-loop', 'Social loop', 'Client two', 'Motion design', '01:10', 190, '1 / 1', 250, -175, -60),
      P('explainer', 'Explainer', 'Client three', 'Edit · Motion', '00:28', 230, '16 / 9', 245, 55, 150),
      P('vertical-cut', 'Vertical cut', 'Client four', 'Edit', '00:55', 150, '9 / 16', -95, 190, -110),
      P('title-system', 'Title system', 'Client five', 'Motion design', '02:06', 175, '1 / 1', 165, 235, -260),
    ],
  },
  {
    id: 'ai', label: 'AI', meta: '04 experiments', d: 190,
    x: 1580, y: -700, z: -1600,
    items: [
      P('ai-spot', 'AI spot', 'Client six', 'Direction · Finish', '00:33', 420, '16 / 9', 110, -110, 180),
      P('ai-vertical', 'AI vertical', 'Personal', 'Experiment', '00:18', 165, '9 / 16', -215, -60, -40),
      P('ai-texture', 'AI texture', 'Personal', 'Experiment', '00:47', 185, '1 / 1', 185, 165, 120),
      P('ai-hybrid', 'AI hybrid', 'Client seven', 'Comp · Edit', '01:02', 215, '16 / 9', -170, 195, -200),
    ],
  },
  {
    id: 'edit', label: 'Edit', meta: '04 cuts', d: 185,
    x: -1700, y: 620, z: -1000,
    items: [
      P('doc-cut', 'Doc cut', 'Client eight', 'Editor', '01:35', 450, '16 / 9', -130, -115, 190),
      P('promo', 'Promo', 'Client nine', 'Editor', '00:51', 180, '1 / 1', 235, -145, -70),
      P('long-form', 'Long form', 'Client ten', 'Editor', '02:14', 225, '16 / 9', 230, 75, 140),
      P('reels-pack', 'Reels pack', 'Client eleven', 'Editor', '00:39', 155, '9 / 16', -85, 195, -190),
    ],
  },
  {
    id: 'about', label: 'About', meta: 'Cairo / Riyadh', d: 300,
    x: 1720, y: 620, z: -2000,
    items: [P('about', 'About', '—', '—', '—', 430, '1 / 1', 0, 0, 0)],
  },
  {
    id: 'contact', label: 'Contact', meta: "Let's talk", d: 300,
    x: 0, y: 1250, z: -2400,
    items: [P('contact', 'Contact', '—', '—', '—', 500, '16 / 9', 0, 0, 0)],
  },
];

/** كل المشاريع بالترتيب — للتنقّل «المشروع اللي بعده» */
export const allItems = sections.flatMap((s) =>
  s.items.map((it) => ({ ...it, section: s.label, sectionId: s.id })),
);

/** اسم ملف اللوب = slug المشروع (`brand-film.mp4`) — **مصدر واحد**.
 *  كان فيه تسميتين: الرئيسية بترقم (`motion-1`) وصفحة المشروع
 *  بالقسم+الـslug، فملف واحد مكنش يخدم الاتنين والهيرو كان هيفضل
 *  فاضي مهما تضيف. الـslug فريد أصلًا (هو مسار الصفحة). */
export const loopBase = (slug: string) => slug;

/** الصفحتين دول ليهم صفحاتهم الخاصة، مش صفحات مشاريع */
export const projectItems = allItems.filter(
  (i) => i.sectionId !== 'about' && i.sectionId !== 'contact',
);
