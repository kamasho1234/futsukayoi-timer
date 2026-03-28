import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "飲酒後セルフチェック - 8項目で体調を確認",
  description:
    "頭痛、めまい、吐き気など8つの項目で飲酒後の体調をセルフチェック。運転可能かどうかの判断をサポートします。",
  openGraph: {
    title: "飲酒後セルフチェック | 二日酔い回復タイマー",
    description: "8項目のチェックリストで飲酒後の体調を確認。安全な行動判断をサポートします。",
    url: "/check",
  },
  alternates: {
    canonical: "/check",
  },
};

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
