#!/bin/sh
# شغّال الموقع محليًا.
# المسار مطلق مش نسبي: المسار النسبي اتفسّر مرة على مجلد قديم
# والسيرفر طلع بيقدّم نسخة تانية من الموقع.
export PATH="$HOME/.local/node/bin:$PATH"
cd /Users/mohamed/portfolio/site || exit 1
exec npm run dev
