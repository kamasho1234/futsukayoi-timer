import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "回復タイマー - アルコール分解完了までカウントダウン",
  description:
    "アルコール分解完了までのリアルタイムカウントダウン。残り時間、推奨水分摂取量、回復のアドバイスを表示します。",
  openGraph: {
    title: "回復タイマー | 二日酔い回復タイマー",
    description: "アルコール分解完了までリアルタイムでカウントダウン。回復をサポートします。",
    url: "/timer",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/timer",
  },
};

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
