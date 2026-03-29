"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gender } from "@/types";
import { loadProfile, saveProfile } from "@/lib/storage";

const HEROES = ["/hero-beer.jpg", "/hero-wine.jpg", "/hero-cocktail.jpg"];

const PHRASES = [
  "飲んだ分だけ、ちゃんと休もう。",
  "明日の自分に、やさしい選択を。",
  "楽しい夜の、最後の仕上げ。",
  "後悔しない朝は、ここから始まる。",
  "今夜も頑張った。あとは体に任せよう。",
  "飲みすぎた夜も、朝はちゃんと来る。",
  "お酒は楽しむもの。無理はしない。",
  "一杯の水が、明日の自分を変える。",
  "帰り道の判断が、いちばん大事。",
  "よく遊び、よく休む。それが大人。",
  "酔いは抜ける。思い出は残る。",
  "「もう一杯」の前に、ちょっと確認。",
  "今日の乾杯を、明日も笑って語れるように。",
  "回復時間を知ることが、大人のたしなみ。",
  "身体が資本。お酒とは上手に付き合おう。",
];

export default function HomePage() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [hero, setHero] = useState(HEROES[0]);
  const [phrase, setPhrase] = useState(PHRASES[0]);

  useEffect(() => {
    setHero(HEROES[Math.floor(Math.random() * HEROES.length)]);
    setPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    const profile = loadProfile();
    if (profile) {
      setWeight(String(profile.weightKg));
      setGender(profile.gender);
    }
  }, []);

  const handleStart = () => {
    const w = Number(weight);
    if (w < 30 || w > 200) return;
    saveProfile({ weightKg: w, gender });
    router.push("/drink");
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-48">
        <img
          src={hero}
          alt="二日酔い回復タイマー - お酒の分解時間を計算"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[rgba(12,15,20,0.3)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl font-bold tracking-tight">二日酔い回復タイマー</h1>
          <div className="gold-divider mt-3 w-16" />
        </div>
      </div>

      {/* Phrase */}
      <p className="text-xs text-[var(--text-muted)] text-center italic leading-relaxed">
        {phrase}
      </p>

      {/* SEO Content Section */}
      <section aria-label="アプリの説明">
        <h2 className="text-sm font-bold text-[var(--text)] mb-2">
          飲酒量からアルコール分解時間を自動計算
        </h2>
        <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
          飲んだお酒の種類と量を入力するだけで、アルコールの分解完了時間を自動計算する無料Webアプリです。
          二日酔いの回復をリアルタイムでサポートし、お酒が抜ける時間の目安をお知らせします。
        </p>
      </section>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="weight-input" className="block text-xs text-[var(--text-muted)] mb-2.5 font-medium">
            体重
          </label>
          <div className="relative">
            <input
              id="weight-input"
              type="number"
              className="input-field pr-12 text-lg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="65"
              min={30}
              max={200}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-sm">
              kg
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-2.5 font-medium">
            性別
          </label>
          <div className="flex gap-3">
            {([["male", "男性"], ["female", "女性"]] as const).map(([g, label]) => (
              <button
                key={g}
                className={`flex-1 py-3.5 rounded-lg font-medium text-sm transition-all border ${
                  gender === g
                    ? "bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent-light)]"
                    : "bg-transparent border-[rgba(255,255,255,0.06)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                onClick={() => setGender(g)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="gold-divider" />

        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={!weight || Number(weight) < 30}
        >
          飲酒内容を入力する
        </button>
      </div>

      {/* Features Section for SEO */}
      <section aria-label="機能紹介">
        <h2 className="text-xs font-bold text-[var(--text-muted)] mb-3 tracking-wide">主な機能</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: "分解時間の自動計算", desc: "体重・性別・飲酒量から算出" },
            { title: "リアルタイムタイマー", desc: "回復までカウントダウン" },
            { title: "セルフチェック", desc: "8項目で体調を確認" },
            { title: "水分補給リマインダー", desc: "30分間隔で通知" },
          ].map((feature) => (
            <div key={feature.title} className="card py-3 px-3.5">
              <h3 className="text-[11px] font-semibold text-[var(--text)]">{feature.title}</h3>
              <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alcohol breakdown reference table for SEO */}
      <section aria-label="アルコール分解時間の目安">
        <h2 className="text-xs font-bold text-[var(--text-muted)] mb-3 tracking-wide">お酒別の分解時間（体重65kgの場合）</h2>
        <div className="card overflow-hidden p-0">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left py-2 px-3 text-[var(--text-dim)] font-medium">お酒</th>
                <th className="text-right py-2 px-3 text-[var(--text-dim)] font-medium">アルコール</th>
                <th className="text-right py-2 px-3 text-[var(--text-dim)] font-medium">分解目安</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["ビール 350ml", "14g", "約2.2時間"],
                ["ビール 500ml", "20g", "約3.1時間"],
                ["日本酒 1合", "21.6g", "約3.3時間"],
                ["ワイン グラス1杯", "12g", "約1.8時間"],
                ["ハイボール 1杯", "19.6g", "約3.0時間"],
                ["ストロング系 350ml", "25.2g", "約3.9時間"],
                ["焼酎ロック 1合", "36g", "約5.5時間"],
              ].map(([name, alc, time]) => (
                <tr key={name} className="border-b border-[rgba(255,255,255,0.03)]">
                  <td className="py-1.5 px-3">{name}</td>
                  <td className="py-1.5 px-3 text-right font-mono">{alc}</td>
                  <td className="py-1.5 px-3 text-right font-mono text-[var(--accent)]">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-[var(--text-dim)] mt-1.5">※ 体重1kgあたり0.1g/時の分解速度で計算。個人差があります。</p>
      </section>

      {/* FAQ Section (visible, matches JSON-LD) */}
      <section aria-label="よくある質問">
        <h2 className="text-xs font-bold text-[var(--text-muted)] mb-3 tracking-wide">よくある質問</h2>
        <div className="flex flex-col gap-2">
          {[
            { q: "アルコールの分解時間はどのくらい？", a: "体重60kgの男性の場合、ビール1杯（350ml）で約2〜3時間。体重・性別・飲酒量で個人差があります。" },
            { q: "二日酔いを早く治すには？", a: "水分補給が最重要。スポーツドリンクや経口補水液で電解質を補給し、十分な休息を取りましょう。" },
            { q: "飲酒後いつから運転できる？", a: "アルコールが完全に分解されるまで運転は控えてください。少しでも不安なら運転しないのが鉄則です。" },
            { q: "計算結果は正確？", a: "ウィドマーク公式に基づく一般的な目安です。体調や食事の有無でも変わるため、参考値としてご利用ください。" },
            { q: "二日酔いに効く食べ物は？", a: "しじみの味噌汁、梅干し、バナナ、はちみつ、大根おろしなどが効果的です。" },
          ].map(({ q, a }) => (
            <details key={q} className="card group">
              <summary className="text-xs font-medium cursor-pointer flex items-center justify-between">
                <span>{q}</span>
                <span className="text-[var(--text-dim)] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-[10px] text-[var(--text-dim)] mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* SNS Share */}
      <div>
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-3 text-center">友達にシェア</div>
        <div className="flex gap-2.5">
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("飲酒量からアルコール分解時間がわかる！二日酔い回復タイマー🍻")}&url=${encodeURIComponent("https://futsukayoi-timer.net")}`, "_blank", "noopener,noreferrer")}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--text)]">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-medium">X</span>
          </button>
          <button
            onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://futsukayoi-timer.net")}&text=${encodeURIComponent("飲酒量からアルコール分解時間がわかる！二日酔い回復タイマー🍻")}`, "_blank", "noopener,noreferrer")}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-[#06C755]">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span className="text-xs font-medium">LINE</span>
          </button>
          <button
            onClick={async () => { try { await navigator.clipboard.writeText("https://futsukayoi-timer.net"); } catch {} }}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--text)] stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-xs font-medium">リンク</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-center text-[var(--text-dim)] leading-relaxed">
        計算結果はあくまで目安です。個人差があります。<br />
        飲酒運転は法律で禁止されています。
      </p>
    </div>
  );
}
