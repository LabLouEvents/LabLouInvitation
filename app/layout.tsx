import "./globals.css";
import { GFS_Didot, Noto_Serif } from "next/font/google";

const titleFont = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  variable: "--font-title",
});

const bodyFont = Noto_Serif({
  weight: ["400", "500", "600"],
  subsets: ["greek"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}