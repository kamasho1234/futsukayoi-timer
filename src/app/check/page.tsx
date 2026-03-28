"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadSession, saveSession } from "@/lib/storage";
import { getMetabolismRate } from "@/lib/alcohol-calc";

const CHECKLIST_ITEMS = [
  { id: "headache", label: "頭痛はありませんか？" },
  { id: "dizziness", label: "めまいやふらつきはありませんか？" },
  { id: "nausea", label: "吐き気はありませんか？" },
  { id: "vision", label: "視界はクリアですか？" },
  { id: "concentration", label: "集中力に問題はありませんか？" },
  { id: "reaction", label: "反応速度は普段通りですか？" },
  { id: "smell", label: "お酒の匂いは残っていませんか？" },
  { id: "straight", label: "まっすぐ歩けますか？" },
];

const ADDITIONAL_MINUTES = 60;

export default function CheckPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, null]))
  );
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!loadSession()) router.replace("/");
  }, [router]);

  const allAnswered = Object.values(answers).every((v) => v !== null);
  const hasNG = Object.values(answers).some((v) => v === false);
  const ngCount = Object.values(answers).filter((v) => v === false).length;

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddTimer = () => {
    const session = loadSession();
    if (!session) { router.replace("/"); return; }
    const additionalMs = ngCount * ADDITIONAL_MINUTES * 60 * 1000;
    const newSoberTarget = new Date(Date.now() + additionalMs);
    const totalAlcoholG = session.entries.reduce((s, e) => s + e.pureAlcoholG * e.quantity, 0);
    const rate = getMetabolismRate(session.profile.weightKg, session.profile.gender);
    const hoursToSober = rate > 0 ? totalAlcoholG / rate : 0;
    const adjustedStart = new Date(newSoberTarget.getTime() - hoursToSober * 3600000);
    saveSession({ ...session, startedAt: adjustedStart.toISOString() });
    router.replace("/timer");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold opacity-80">
          飲酒後セルフチェック
        </div>
        <h1 className="text-xl font-bold tracking-tight mt-1">状態確認</h1>
        <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed">
          全ての項目に正直にお答えください。<br />
          1つでもNGがある場合は運転を控えてください。
        </p>
      </div>

      <div className="card-highlight text-xs leading-relaxed">
        <div className="text-xs text-[var(--warning)] font-semibold mb-1">免責事項</div>
        <p className="text-[var(--text-muted)]">
          このチェックリストは自己確認用です。タイマー完了後も体内にアルコールが残っている可能性があります。
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {CHECKLIST_ITEMS.map((item, idx) => (
          <div key={item.id} className="card">
            <div className="flex items-start justify-between mb-2.5">
              <div className="text-sm font-medium">{item.label}</div>
              <span className="text-[10px] text-[var(--text-dim)] font-mono">{String(idx + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer(item.id, true)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  answers[item.id] === true
                    ? "bg-[rgba(39,174,96,0.12)] border-[var(--success)] text-[var(--success)]"
                    : "bg-transparent border-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                問題なし
              </button>
              <button
                onClick={() => handleAnswer(item.id, false)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  answers[item.id] === false
                    ? "bg-[rgba(192,57,43,0.12)] border-[var(--danger)] text-[var(--danger)]"
                    : "bg-transparent border-[rgba(255,255,255,0.06)] text-[var(--text-dim)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                症状あり
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showResult && (
        <button
          className="btn-primary"
          onClick={() => setShowResult(true)}
          disabled={!allAnswered}
        >
          チェック結果を確認する
        </button>
      )}

      {showResult && (
        <div className="flex flex-col gap-4">
          {hasNG ? (
            <>
              <div className="card text-center" style={{ borderColor: "var(--danger)" }}>
                <div className="text-3xl mb-2">⛔</div>
                <div className="text-base font-bold text-[var(--danger)] mb-1">
                  運転はまだ控えてください
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {ngCount}項目でNG判定が出ています。<br />
                  追加で{ngCount * ADDITIONAL_MINUTES}分の回復時間を設定します。
                </p>
              </div>
              <button className="btn-primary" onClick={handleAddTimer}>
                追加タイマーを開始（{ngCount * ADDITIONAL_MINUTES}分）
              </button>
            </>
          ) : (
            <>
              <div className="card-highlight text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-base font-bold text-[var(--success)] mb-1">
                  全項目クリア
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  セルフチェックを通過しました。<br />
                  少しでも異変を感じたら運転は控えてください。
                </p>
              </div>
              <button className="btn-primary" onClick={() => router.push("/complete")}>
                完了画面へ
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
