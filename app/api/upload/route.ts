{\rtf1\ansi\ansicpg1253\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ NextResponse \} from "next/server";\
import path from "path";\
import fs from "fs/promises";\
\
export async function POST(req: Request) \{\
  const formData = await req.formData();\
  const file = formData.get("file") as File | null;\
\
  if (!file) \{\
    return NextResponse.json(\{ error: "No file uploaded" \}, \{ status: 400 \});\
  \}\
\
  const bytes = await file.arrayBuffer();\
  const buffer = Buffer.from(bytes);\
\
  const fileName = `$\{Date.now()\}-$\{file.name.replace(/\\s+/g, "-")\}`;\
  const filePath = path.join(process.cwd(), "public/uploads", fileName);\
\
  await fs.writeFile(filePath, buffer);\
\
  return NextResponse.json(\{\
    url: `/uploads/$\{fileName\}`,\
  \});\
\}}