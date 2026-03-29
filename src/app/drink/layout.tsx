import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "飲酒内容の入力 - お酒の種類と量を選択",
  description:
    "ビール、ワイン、日本酒、焼酎、ハイボールなど飲んだお酒の種類と量を入力。純アルコール量を自動計算し、分解時間の算出に使用します。",
  openGraph: {
    title: "飲酒内容の入力 | 二日酔い回復タイマー",
    description: "飲んだお酒の種類と量を入力して、アルコール分解時間を計算しましょう。",
    url: "/drink",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/drink",
  },
};

export default function DrinkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
