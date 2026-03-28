import { AdviceLevel, RecoveryAdvice } from "@/types";

export function generateAdvice(totalAlcoholG: number, adviceLevel: AdviceLevel): RecoveryAdvice {
  const waterIntakeMl = Math.round(500 + totalAlcoholG * 30);

  const foods = [
    "経口補水液・スポーツドリンク（電解質補給）",
    "味噌汁（ナトリウム・水分補給）",
    "バナナ（カリウム補給）",
    "卵料理（L-システインでアセトアルデヒド分解補助）",
    "しじみの味噌汁（オルニチンで肝機能サポート）",
  ];

  const warnings = [
    "迎え酒は絶対にNG（分解がさらに遅れます）",
    "サウナや激しい運動は脱水を悪化させます",
  ];

  const tips = [
    "水分は一気に飲まず、少しずつこまめに摂取しましょう",
    "ビタミンB群のサプリメントが代謝を助けます",
  ];

  if (adviceLevel === "heavy" || adviceLevel === "dangerous") {
    warnings.push("アルコール摂取量が多いです。体調不良時は医療機関を受診してください");
    tips.push("安静にして十分な睡眠をとりましょう");
  }

  if (adviceLevel === "dangerous") {
    warnings.push("非常に多量の飲酒です。車の運転は絶対に避けてください");
  }

  return { waterIntakeMl, foods, warnings, tips };
}
