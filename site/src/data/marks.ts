// أربع علامات مقترحة لـPlanet Motion.
// كلها مرسومة على viewBox 24×24، بلون واحد (currentColor)، ومن غير
// أي تفصيلة بتختفي تحت 16px — دي شروط اللوجو في الريبورت.

export type Mark = { id: string; name: string; idea: string; svg: string; motion: string };

export const marks: Mark[] = [
  {
    id: 'playhead',
    name: 'Playhead',
    idea: 'رأس التشغيل: مثلث وخط رأسي. موجود في الموقع أصلًا كأقوى عنصر فيه — اللوجو مش هيبقى حاجة مضافة، هيبقى نفس العلامة اللي بتتحرك مع كل سكرول.',
    motion: 'الخط بيعدّي من الشمال لليمين ويكشف الاسم — نفس حركته في السكرابر.',
    svg: `<path d="M4 3h16l-8 7z" fill="currentColor"/>
          <path d="M12 10v11" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'orbit',
    name: 'Orbit',
    idea: 'دايرة (الكوكب) وخط رأسي بيقطعها (رأس التشغيل). بيربط الاسم بالصنعة في شكل واحد: Planet + Motion.',
    motion: 'الدايرة بتترسم، وبعدها الخط بيعدّي عليها.',
    svg: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v22" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'frame',
    name: 'Frame',
    idea: 'علامات قص الفريم — نفس العلامات اللي في أركان الموقع. أهدى واحدة فيهم، وبتشتغل كإطار حوالين أي حاجة تانية.',
    motion: 'الأركان الأربعة بتتقفل على بعض زي ما الكاميرا بتظبط الكادر.',
    svg: `<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"
            fill="none" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'splice',
    name: 'Splice',
    idea: 'فريم 16:9 متقطوع بخط مايل ونصّه مزحلق — لحظة القطع في المونتاج نفسها.',
    motion: 'النصين بيتزحلقوا ويتلموا، فيبقى فريم واحد.',
    svg: `<path d="M2 7h9l-3 10H2z" fill="currentColor"/>
          <path d="M13 7h9v10h-9l3-10z" fill="currentColor" opacity=".55"/>`,
  },
];
