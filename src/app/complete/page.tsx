"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession, loadSession } from "@/lib/storage";
import { getMetabolismRate } from "@/lib/alcohol-calc";

const SITE_URL = "https://futsukayoi-timer.net";

export default function CompletePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [totalAlcoholG, setTotalAlcoholG] = useState<number | undefined>();
  const [hoursToSober, setHoursToSober] = useState<number | undefined>();
  const [shareText, setShareText] = useState("二日酔い回復タイマーで飲酒後の回復時間がわかる！🍻👇");

  useEffect(() => {
    const session = loadSession();
    if (!session) return;
    const total = Math.round(session.entries.reduce((s, e) => s + e.pureAlcoholG * e.quantity, 0) * 10) / 10;
    const rate = getMetabolismRate(session.profile.weightKg, session.profile.gender);
    const hours = rate > 0 ? Math.round(total / rate * 10) / 10 : 0;
    setTotalAlcoholG(total);
    setHoursToSober(hours);
    setShareText(`アルコール${total}gを約${hours}時間で分解完了しました！🎉\n\n二日酔い回復タイマーで飲酒後の回復時間がわかる👇`);
  }, []);

  const shareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="w-full card-highlight shimmer py-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold mb-2 opacity-80">
          分解完了
        </div>
        <h1 className="text-2xl font-bold tracking-tight">お疲れ様でした</h1>
        <p className="text-xs text-[var(--text-dim)] mt-2">
          アルコールの分解が完了しました
        </p>
      </div>

      {/* Stats summary */}
      {totalAlcoholG && hoursToSober && (
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="card text-center">
            <div className="text-[10px] text-[var(--text-dim)]">総アルコール</div>
            <div className="text-lg font-mono font-bold mt-1">{totalAlcoholG}<span className="text-xs text-[var(--text-muted)] ml-0.5">g</span></div>
          </div>
          <div className="card text-center">
            <div className="text-[10px] text-[var(--text-dim)]">分解時間</div>
            <div className="text-lg font-mono font-bold mt-1">{hoursToSober}<span className="text-xs text-[var(--text-muted)] ml-0.5">時間</span></div>
          </div>
        </div>
      )}

      <div className="card w-full">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-3">回復後のアドバイス</div>
        <ul className="flex flex-col gap-3 text-xs text-[var(--text-muted)] leading-relaxed">
          <li className="flex gap-3">
            <span className="text-[var(--accent)] font-mono flex-shrink-0">01</span>
            <span>軽い食事から始めましょう</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent)] font-mono flex-shrink-0">02</span>
            <span>水分補給を続けましょう</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent)] font-mono flex-shrink-0">03</span>
            <span>激しい運動は避け、ゆっくり休みましょう</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent)] font-mono flex-shrink-0">04</span>
            <span>運転は体調が完全に回復してから</span>
          </li>
        </ul>
      </div>

      {/* SNS Share */}
      <div className="w-full">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-3 text-center">結果をシェア</div>
        <div className="flex gap-2.5">
          <button
            onClick={shareX}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[var(--text)]">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-medium">X</span>
          </button>
          <button
            onClick={shareLine}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-[#06C755]">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span className="text-xs font-medium">LINE</span>
          </button>
          <button
            onClick={copyLink}
            className="flex-1 card flex items-center justify-center gap-2 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--text)] stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-xs font-medium">{copied ? "コピー済み" : "リンク"}</span>
          </button>
        </div>
      </div>

      <button className="btn-primary w-full" onClick={() => { clearSession(); router.push("/"); }}>
        最初に戻る
      </button>
    </div>
  );
}
