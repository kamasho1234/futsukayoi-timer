"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DrinkEntry } from "@/types";
import { DRINK_PRESETS } from "@/lib/drink-presets";
import { loadProfile, loadSession, saveSession } from "@/lib/storage";

export default function DrinkPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Map<string, number>>(new Map());
  const [customDrinks, setCustomDrinks] = useState<DrinkEntry[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPercent, setCustomPercent] = useState("");
  const [customMl, setCustomMl] = useState("");
  const existingSessionRef = useRef<{ startedAt: string; entries: DrinkEntry[] } | null>(null);
  const customIdRef = useRef(Date.now());

  useEffect(() => {
    const profile = loadProfile();
    if (!profile) { router.replace("/"); return; }
    const session = loadSession();
    if (session) {
      existingSessionRef.current = { startedAt: session.startedAt, entries: session.entries };
    }
  }, [router]);

  const updateQuantity = (presetId: string, delta: number) => {
    setEntries((prev) => {
      const next = new Map(prev);
      const current = next.get(presetId) || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) next.delete(presetId);
      else next.set(presetId, newVal);
      return next;
    });
  };

  const addCustomDrink = () => {
    const pct = Number(customPercent);
    const ml = Number(customMl);
    if (pct <= 0 || pct > 100 || ml <= 0) return;
    const pureAlcoholG = Math.round(ml * (pct / 100) * 0.8 * 10) / 10;
    const name = customName.trim() || `カスタム（${pct}% / ${ml}ml）`;
    customIdRef.current += 1;
    setCustomDrinks((prev) => [
      ...prev,
      { presetId: `custom_${customIdRef.current}`, name, quantity: 1, pureAlcoholG },
    ]);
    setCustomName("");
    setCustomPercent("");
    setCustomMl("");
    setShowCustom(false);
  };

  const removeCustomDrink = (presetId: string) => {
    setCustomDrinks((prev) => prev.filter((d) => d.presetId !== presetId));
  };

  const presetAlcohol = Array.from(entries.entries()).reduce((sum, [id, qty]) => {
    const preset = DRINK_PRESETS.find((p) => p.id === id);
    return sum + (preset ? preset.pureAlcoholG * qty : 0);
  }, 0);
  const customAlcohol = customDrinks.reduce((sum, d) => sum + d.pureAlcoholG * d.quantity, 0);
  const totalAlcohol = presetAlcohol + customAlcohol;

  const handleCalculate = () => {
    const profile = loadProfile();
    if (!profile || (entries.size === 0 && customDrinks.length === 0)) return;

    const presetEntries: DrinkEntry[] = Array.from(entries.entries()).map(([id, qty]) => {
      const preset = DRINK_PRESETS.find((p) => p.id === id)!;
      return { presetId: id, name: preset.name, quantity: qty, pureAlcoholG: preset.pureAlcoholG };
    });
    const newEntries: DrinkEntry[] = [...presetEntries, ...customDrinks];

    const existing = existingSessionRef.current;
    let mergedEntries: DrinkEntry[];
    let startedAt: string;

    if (existing) {
      const entryMap = new Map<string, DrinkEntry>();
      for (const e of existing.entries) entryMap.set(e.presetId, { ...e });
      for (const e of newEntries) {
        const prev = entryMap.get(e.presetId);
        if (prev) prev.quantity += e.quantity;
        else entryMap.set(e.presetId, { ...e });
      }
      mergedEntries = Array.from(entryMap.values());
      startedAt = existing.startedAt;
    } else {
      mergedEntries = newEntries;
      startedAt = new Date().toISOString();
    }

    saveSession({ entries: mergedEntries, startedAt, profile });
    router.push("/timer");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button onClick={() => router.back()} className="text-[var(--accent)] text-xs mb-3 hover:opacity-70 transition-opacity">
          ← 戻る
        </button>
        <h1 className="text-xl font-bold tracking-tight">
          {existingSessionRef.current ? "追加オーダー" : "飲酒内容の入力"}
        </h1>
        <p className="text-[var(--text-dim)] text-xs mt-1">
          飲んだお酒と数量を選択してください
        </p>
      </div>

      {existingSessionRef.current && (
        <div className="card-highlight text-xs">
          <div className="text-[var(--accent)] font-semibold mb-2 text-xs">
            現在の記録
          </div>
          <div className="flex flex-col gap-1 text-[var(--text-muted)]">
            {existingSessionRef.current.entries.map((e) => (
              <div key={e.presetId} className="flex justify-between">
                <span>{e.name}</span>
                <span>x{e.quantity}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text-dim)] mt-2">
            以下で選択した分が加算されます
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {DRINK_PRESETS.map((preset) => {
          const qty = entries.get(preset.id) || 0;
          return (
            <div key={preset.id} className={`drink-chip justify-between ${qty > 0 ? "border-[rgba(212,175,55,0.25)]" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={preset.image} alt={`${preset.name} - ${preset.alcoholPercentage}%`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium text-sm text-[var(--text)]">{preset.name}</div>
                  <div className="text-[10px] text-[var(--text-dim)] mt-0.5">
                    {preset.alcoholPercentage}% ・ {preset.pureAlcoholG}g
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => updateQuantity(preset.id, -1)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-base text-[var(--text-muted)] hover:border-[var(--accent)] transition-colors"
                >
                  −
                </button>
                <span className="w-5 text-center font-mono font-bold text-sm">{qty}</span>
                <button
                  onClick={() => updateQuantity(preset.id, 1)}
                  className="w-8 h-8 rounded-lg bg-[var(--accent-glow)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-base text-[var(--accent)] hover:bg-[rgba(212,175,55,0.25)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom drink input */}
      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          className="text-xs text-[var(--accent)] hover:opacity-70 transition-opacity text-left py-1"
        >
          + その他のお酒を追加（度数・量を入力）
        </button>
      ) : (
        <div className="card flex flex-col gap-3">
          <div className="text-xs text-[var(--text-muted)] font-semibold">カスタム入力</div>
          <input
            type="text"
            className="input-field text-sm"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="名前（任意）例: マッコリ"
          />
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="number"
                className="input-field text-sm pr-8"
                value={customPercent}
                onChange={(e) => setCustomPercent(e.target.value)}
                placeholder="度数"
                min={0.1}
                max={100}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-xs">%</span>
            </div>
            <div className="flex-1 relative">
              <input
                type="number"
                className="input-field text-sm pr-10"
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                placeholder="量"
                min={1}
                step={1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] text-xs">ml</span>
            </div>
          </div>
          {Number(customPercent) > 0 && Number(customMl) > 0 && (
            <div className="text-[10px] text-[var(--text-dim)]">
              純アルコール量: {Math.round(Number(customMl) * (Number(customPercent) / 100) * 0.8 * 10) / 10}g
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={addCustomDrink}
              disabled={!customPercent || !customMl || Number(customPercent) <= 0 || Number(customMl) <= 0}
              className="flex-1 btn-primary text-xs py-2.5"
            >
              追加する
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="px-4 py-2.5 text-xs text-[var(--text-muted)] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Custom drinks list */}
      {customDrinks.length > 0 && (
        <div className="flex flex-col gap-2">
          {customDrinks.map((d) => (
            <div key={d.presetId} className="drink-chip justify-between border-[rgba(212,175,55,0.25)]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="/drinks/custom.svg" alt={`${d.name} - カスタム入力のお酒`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium text-sm text-[var(--text)]">{d.name}</div>
                  <div className="text-[10px] text-[var(--text-dim)] mt-0.5">
                    {d.pureAlcoholG}g
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeCustomDrink(d.presetId)}
                className="w-8 h-8 rounded-lg bg-[rgba(192,57,43,0.1)] border border-[rgba(192,57,43,0.2)] flex items-center justify-center text-xs text-[var(--danger)] hover:bg-[rgba(192,57,43,0.2)] transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {totalAlcohol > 0 && (
        <>
          <div className="gold-divider" />
          <div className="card-highlight text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">今回の合計アルコール量</div>
            <div className="text-2xl font-mono font-bold text-[var(--accent-light)]">
              {Math.round(totalAlcohol * 10) / 10}<span className="text-sm ml-1">g</span>
            </div>
          </div>
        </>
      )}

      <button
        className="btn-primary"
        onClick={handleCalculate}
        disabled={entries.size === 0 && customDrinks.length === 0}
      >
        回復時間を計算する
      </button>
    </div>
  );
}
