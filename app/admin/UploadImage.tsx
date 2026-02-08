{\rtf1\ansi\ansicpg1253\cocoartf2513
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 "use client";\
\
import \{ useState \} from "react";\
\
export default function UploadImage(\{\
  onUploaded,\
\}: \{\
  onUploaded: (url: string) => void;\
\}) \{\
  const [loading, setLoading] = useState(false);\
\
  async function upload(e: React.ChangeEvent<HTMLInputElement>) \{\
    const file = e.target.files?.[0];\
    if (!file) return;\
\
    setLoading(true);\
\
    const formData = new FormData();\
    formData.append("file", file);\
\
    const res = await fetch("/api/upload", \{\
      method: "POST",\
      body: formData,\
    \});\
\
    const data = await res.json();\
    onUploaded(data.url);\
\
    setLoading(false);\
  \}\
\
  return (\
    <div style=\{\{ marginBottom: 14 \}\}>\
      <label className="elegant-text">\uc0\u913 \u957 \u941 \u946 \u945 \u963 \u956 \u945  \u960 \u961 \u959 \u963 \u954 \u955 \u951 \u964 \u951 \u961 \u943 \u959 \u965 </label>\
      <input type="file" accept="image/*" onChange=\{upload\} />\
      \{loading && <div style=\{\{ fontSize: 12 \}\}>\uc0\u913 \u957 \u949 \u946 \u945 \u943 \u957 \u949 \u953 \'85</div>\}\
    </div>\
  );\
\}}