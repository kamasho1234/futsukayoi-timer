import { Gender, DrinkEntry, MetabolismResult, AdviceLevel } from "@/types";
import { DRINK_PRESETS } from "./drink-presets";

const WIDMARK_FACTOR: Record<Gender, number> = { male: 0.68, female: 0.55 };
const METABOLISM_RATE_PER_KG = 0.1; // g/h per kg

function getAdviceLevel(totalAlcoholG: number): AdviceLevel {
  if (totalAlcoholG <= 20) return "light";
  if (totalAlcoholG <= 40) return "moderate";
  if (totalAlcoholG <= 80) return "heavy";
  return "dangerous";
}

export function getMetabolismRate(weightKg: number, gender: Gender): number {
  const r = WIDMARK_FACTOR[gender];
  const effectiveWeight = weightKg * (r / 0.68);
  return effectiveWeight * METABOLISM_RATE_PER_KG;
}

export function calculateRecovery(
  entries: DrinkEntry[],
  weightKg: number,
  gender: Gender,
  drinkStartTime: Date = new Date()
): MetabolismResult {
  const totalAlcoholG = entries.reduce((sum, e) => sum + e.pureAlcoholG * e.quantity, 0);
  // 性別係数を反映: 女性は体内水分量が少なく分解に時間がかかる
  const r = WIDMARK_FACTOR[gender];
  const effectiveWeight = weightKg * (r / 0.68); // 男性基準で正規化
  const metabolismRateGPerHour = effectiveWeight * METABOLISM_RATE_PER_KG;
  const hoursToSober = metabolismRateGPerHour > 0 ? totalAlcoholG / metabolismRateGPerHour : 0;
  const soberTime = new Date(drinkStartTime.getTime() + hoursToSober * 3600000);

  return {
    totalAlcoholG: Math.round(totalAlcoholG * 10) / 10,
    metabolismRateGPerHour: Math.round(metabolismRateGPerHour * 10) / 10,
    hoursToSober: Math.round(hoursToSober * 10) / 10,
    soberTime,
    adviceLevel: getAdviceLevel(totalAlcoholG),
  };
}
