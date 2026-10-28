#!/bin/sh
# شغّال الموقع محليًا. بيضيف Node للـPATH الأول.
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")/site" || exit 1
exec npm run dev
