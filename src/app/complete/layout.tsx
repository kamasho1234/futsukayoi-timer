import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "回復完了 - アルコール分解が完了しました",
  description:
    "アルコールの分解が完了しました。回復後の食事や水分補給のアドバイスを確認しましょう。",
  openGraph: {
    title: "回復完了 | 二日酔い回復タイマー",
    description: "アルコール分解完了。回復後のアドバイスを確認しましょう。",
    url: "/complete",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/complete",
  },
};

export default function CompleteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
