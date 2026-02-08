rm -f app/api/upload/route.ts
mkdir -p app/api/upload

cat > app/api/upload/route.ts <<'EOF'
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true });
}
EOF