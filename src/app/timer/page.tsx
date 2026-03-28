"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadSession, clearSession } from "@/lib/storage";
import { calculateRecovery } from "@/lib/alcohol-calc";
import { generateAdvice } from "@/lib/advice";
import { useTimer } from "@/hooks/use-timer";
import { useHydrationReminder } from "@/hooks/use-hydration-reminder";
import { MetabolismResult, RecoveryAdvice, DrinkEntry } from "@/types";
import { DRINK_PRESETS } from "@/lib/drink-presets";

export default function TimerPage() {
  const router = useRouter();
  const [result, setResult] = useState<MetabolismResult | null>(null);
  const [advice, setAdvice] = useState<RecoveryAdvice | null>(null);
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [hydrationOn, setHydrationOn] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (!session) { router.replace("/"); return; }
    setDrinks(session.entries);
    const r = calculateRecovery(
      session.entries,
      session.profile.weightKg,
      session.profile.gender,
      new Date(session.startedAt)
    );
    setResult(r);
    setAdvice(generateAdvice(r.totalAlcoholG, r.adviceLevel));
  }, [router]);

  const timer = useTimer(result?.soberTime ?? null);
  useHydrationReminder(hydrationOn);

  useEffect(() => {
    if (timer.isComplete && result) {
      router.push("/check");
    }
  }, [timer.isComplete, result, router]);

  if (!result || !advice) return null;

  const levelLabels = {
    light: "軽め",
    moderate: "やや多め",
    heavy: "多い",
    dangerous: "非常に多い",
  };

  const levelColors = {
    light: "text-[var(--success)] border-[var(--success)]",
    moderate: "text-[var(--warning)] border-[var(--warning)]",
    heavy: "text-[var(--danger)] border-[var(--danger)]",
    dangerous: "text-[var(--danger)] border-[var(--danger)]",
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">回復タイマー</h1>
        </div>
        <div className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border ${levelColors[result.adviceLevel]}`}>
          {levelLabels[result.adviceLevel]}
        </div>
      </div>

      {/* Timer */}
      <div className="card-highlight text-center py-8">
        <div className="text-xs text-[var(--text-muted)] mb-3">分解完了まで</div>
        <div className="text-5xl font-mono font-bold tracking-widest text-[var(--text)]">
          {pad(timer.hours)}<span className="text-[var(--accent)] mx-0.5">:</span>{pad(timer.minutes)}<span className="text-[var(--accent)] mx-0.5">:</span>{pad(timer.seconds)}
        </div>
        <div className="mt-5 mx-4 h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, timer.progress * 100)}%`,
              background: "linear-gradient(90deg, var(--accent), #e8c84a)",
            }}
          />
        </div>
        <div className="mt-3 text-xs text-[var(--text-dim)]">
          完了予定 {result.soberTime.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-[10px] text-[var(--text-dim)]">総アルコール</div>
          <div className="text-lg font-mono font-bold mt-1">{result.totalAlcoholG}<span className="text-xs text-[var(--text-muted)] ml-0.5">g</span></div>
        </div>
        <div className="card text-center">
          <div className="text-[10px] text-[var(--text-dim)]">分解速度</div>
          <div className="text-lg font-mono font-bold mt-1">{result.metabolismRateGPerHour}<span className="text-xs text-[var(--text-muted)] ml-0.5">g/時</span></div>
        </div>
      </div>

      {/* Drinks consumed */}
      <div className="card">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-3">飲んだお酒</div>
        <div className="flex flex-col gap-2.5">
          {drinks.map((entry) => {
            const preset = DRINK_PRESETS.find((p) => p.id === entry.presetId);
            return (
              <div key={entry.presetId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0">
                    <img src={preset?.image ?? "/drinks/custom.svg"} alt={`${entry.name} - 飲酒記録`} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm">{entry.name}</span>
                </div>
                <div className="text-sm text-[var(--text-muted)] font-mono">
                  x{entry.quantity} <span className="text-[var(--text-dim)]">({Math.round(entry.pureAlcoholG * entry.quantity * 10) / 10}g)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hydration Toggle */}
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">水分補給リマインダー</div>
          <div className="text-[10px] text-[var(--text-dim)] mt-0.5">30分間隔で通知</div>
        </div>
        <button
          onClick={() => setHydrationOn(!hydrationOn)}
          className={`w-11 h-6 rounded-full transition-all relative ${
            hydrationOn ? "bg-[var(--accent)]" : "bg-[rgba(255,255,255,0.1)]"
          }`}
        >
          <div
            className="bg-white rounded-full absolute top-[3px] transition-all"
            style={{ width: "18px", height: "18px", left: hydrationOn ? "22px" : "3px" }}
          />
        </button>
      </div>

      {/* Water Intake */}
      <div className="card">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-1">推奨水分摂取量</div>
        <div className="text-2xl font-mono font-bold text-[var(--accent-light)]">
          {advice.waterIntakeMl}<span className="text-sm ml-1">ml</span>
        </div>
      </div>

      {/* Warnings */}
      {advice.warnings.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(192,57,43,0.25)" }}>
          <div className="text-xs text-[var(--danger)] font-semibold mb-2">注意事項</div>
          <ul className="flex flex-col gap-1.5">
            {advice.warnings.map((w, i) => (
              <li key={i} className="text-xs text-[var(--text-muted)] leading-relaxed">・{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Foods */}
      <div className="card">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-2">おすすめの食べ物</div>
        <ul className="flex flex-col gap-1.5">
          {advice.foods.map((f, i) => (
            <li key={i} className="text-xs text-[var(--text-muted)] leading-relaxed">・{f}</li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="card">
        <div className="text-xs text-[var(--text-muted)] font-semibold mb-2">回復のヒント</div>
        <ul className="flex flex-col gap-1.5">
          {advice.tips.map((t, i) => (
            <li key={i} className="text-xs text-[var(--text-muted)] leading-relaxed">・{t}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button className="btn-secondary" onClick={() => router.push("/drink")}>
          飲酒を追加する
        </button>
        <button
          className="text-xs text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors py-2"
          onClick={() => { clearSession(); router.push("/"); }}
        >
          リセットして最初から
        </button>
      </div>
    </div>
  );
}
